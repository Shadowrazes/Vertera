import Entity from "./Entity.js";
import User from "./User.js";
import Ticket from "./Ticket.js";
import Message from "./Message.js";
import HelperDepartment from "./HelperDepartment.js";
import ThemeDepartment from "./ThemeDepartment.js";

class Helper extends Entity{
    static TableName = 'helpers';
    static PrimaryField = 'id';
    static JobTitleField = 'jobTitle';
    static BirthdayField = 'birthday';
    static StartWorkDateField = 'startWorkDate';

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetList() {
        const sql = `SELECT * FROM ${this.TableName}`;
        const result = await super.Request(sql);
        return result;
    }

    static async GetStats(helperId) {
        const sql = `
            SELECT 
                COUNT(*) AS totalTickets,
                SUM(statusId = 1) AS newTickets,
                SUM(statusId = 2) AS closedTickets,
                SUM(statusId = 3) AS inProgressTickets,
                SUM(reaction = 'like') AS likes,
                SUM(reaction = 'dislike') AS dislikes,
                COUNT(CASE WHEN reaction IS NULL THEN 1 ELSE NULL END) AS notRated
            FROM ${Ticket.TableName}
            WHERE ${Ticket.HelperIdField} = ?;
        `;
        const result = await super.Request(sql, [helperId]);

        let stats = result[0];
        console.log(stats);


        const msgSql = `
            SELECT  ${Message.SenderIdField}, ${Message.DateField}  
            FROM    ${Message.TableName} 
            WHERE   ${Message.SenderIdField} = ? OR ${Message.RecieverIdField} = ?
        `;
        const msgResult = await super.Request(msgSql, [helperId, helperId]);
        console.log(msgResult);

        // первое сообщение всегда от клиента
        let clientMsg = msgResult[0];
        let dateDiffs = [];
        let skipToNextClient = false;

        for(const curMsg of msgResult){
            console.log(curMsg.senderId);
            if(skipToNextClient){
                if(curMsg.senderId != helperId){
                    clientMsg = curMsg;
                    skipToNextClient = false;
                }
                continue;
            }

            if(curMsg.senderId == helperId){
                dateDiffs.push(curMsg.date - clientMsg.date);
                skipToNextClient = true;
                console.log(curMsg.date);
            }
        }

        console.log(dateDiffs);
        return stats;
    }

    static async GetMostFreeHelper(subThemeId, departmentId) {
        const findingDepartmentIdSql = `
            SELECT ${ThemeDepartment.DepartmentIdField} 
            FROM ${ThemeDepartment.TableName} 
            WHERE ${ThemeDepartment.SubThemeIdField} = ?
        `;

        const ticketCountAS = 'ticketCount';
        const statusFilter = [2];
        let fields = [statusFilter];

        if(!departmentId){
            fields.push(subThemeId)
        }

        const sql = `
            SELECT 
                ${this.TableName}.${this.PrimaryField}, 
                IFNULL(${Ticket.TableName}.${ticketCountAS}, 0) AS ${ticketCountAS}
            FROM ${this.TableName}
            LEFT JOIN (
                SELECT ${Ticket.HelperIdField}, COUNT(*) AS ${ticketCountAS}
                FROM ${Ticket.TableName} WHERE ${Ticket.StatusIdField} NOT IN (?)
                GROUP BY ${Ticket.HelperIdField}
            ) AS ${Ticket.TableName} 
            ON ${this.TableName}.${this.PrimaryField} = ${Ticket.TableName}.${Ticket.HelperIdField} 
            WHERE ${this.PrimaryField} IN ( 
                SELECT ${HelperDepartment.HelperIdField}  
                FROM ${HelperDepartment.TableName} 
                WHERE ${HelperDepartment.DepartmentIdField} 
                IN (
                    ${departmentId ? departmentId : findingDepartmentIdSql}
                ) 
                GROUP BY ${HelperDepartment.HelperIdField}
            ) 
            ORDER BY ${ticketCountAS}
            LIMIT 1
        `;
        const result = await super.Request(sql, fields);
        return result[0].id;
    }

    static async TransInsert(userFields, helperFields) {
        return await super.Transaction(async (conn) => {
            userFields.role = 'helper';
            const id = await User.TransInsert(conn, userFields);
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = {id, jobTitleId: helperFields.jobTitleId, birthday: helperFields.birthday, 
                            startWorkDate: new Date()};
            const result = await super.TransRequest(conn, sql, [fields]);

            const helperDepartmentResult = await HelperDepartment.TransInsert(conn, id, helperFields.departmentIds);

            return id;
        });
    }

    static async TransUpdate(id, userFields, helperArgs) {
        return await super.Transaction(async (conn) => {
            if(super.IsArgsEmpty(userFields) && super.IsArgsEmpty(helperArgs)) throw new Error('Empty fields');

            let helperResult = super.EmptyUpdateInfo;
            if(super.ArgsSize(helperArgs) != 1 && helperArgs.departmentIds){
                const helperFields = { jobTitle: helperArgs.jobTitle, birthday: helperArgs.birthday };
                const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
                helperResult = await super.TransRequest(conn, sql, [helperFields, id]);
            }

            if(!super.IsArgsEmpty(userFields)){
                const userResult = await User.TransUpdate(conn, id, userFields);
            }

            if(helperArgs.departmentIds && helperArgs.departmentIds.length > 0){
                const helperDepartmentDelResult = await HelperDepartment.TransDeleteByHelper(conn, id);
                const helperDepartmentInsertResult = await HelperDepartment.TransInsert(conn, id, helperArgs.departmentIds);
            }

            return {affected: helperResult.affectedRows, changed: helperResult.changedRows, warning: helperResult.warningStatus};
        });
    }
}

export default Helper;
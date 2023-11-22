import Entity from "./Entity.js";
import UserEntity from "./User.js";
import TicketEntity from "./Ticket.js";
import HelperDepartmentEntity from "./HelperDepartment.js";
import ThemeDepartmentEntity from "./ThemeDepartment.js";

class HelperEntity extends Entity{
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

    // ИНДИВИДУАЛЫ

    // SELECT helpers.id, IFNULL(tickets.ticketCount, 0) AS ticketCount
    // FROM helpers
    // LEFT JOIN (
    //     SELECT helperId, COUNT(*) AS ticketCount
    //     FROM tickets WHERE status <> 'Закрыт'
    //     GROUP BY helperId
    // ) AS tickets 
    // ON helpers.id = tickets.helperId 
    // WHERE id IN (
    //     SELECT helperId FROM helper_departments WHERE departmentId IN (
    //         SELECT departmentId FROM theme_departments WHERE subThemeId = 31
    //     ) 
    //     GROUP BY helperId
    // ) 
    // ORDER BY ticketCount

    static async GetMostFreeHelper(subThemeId, departmentId) {
        const findingDepartmentIdSql = `
            SELECT ${ThemeDepartmentEntity.DepartmentIdField} 
            FROM ${ThemeDepartmentEntity.TableName} 
            WHERE ${ThemeDepartmentEntity.SubThemeIdField} = ?
        `;

        const ticketCountAS = 'ticketCount';
        const statusFilter = ['Закрыт'];
        let fields = [statusFilter];

        if(!departmentId){
            fields.push(subThemeId)
        }

        const sql = `
            SELECT 
                ${this.TableName}.${this.PrimaryField}, 
                IFNULL(${TicketEntity.TableName}.${ticketCountAS}, 0) AS ${ticketCountAS}
            FROM ${this.TableName}
            LEFT JOIN (
                SELECT ${TicketEntity.HelperIdField}, COUNT(*) AS ${ticketCountAS}
                FROM ${TicketEntity.TableName} WHERE ${TicketEntity.StatusField} NOT IN (?)
                GROUP BY ${TicketEntity.HelperIdField}
            ) AS ${TicketEntity.TableName} 
            ON ${this.TableName}.${this.PrimaryField} = ${TicketEntity.TableName}.${TicketEntity.HelperIdField} 
            WHERE ${this.PrimaryField} IN ( 
                SELECT ${HelperDepartmentEntity.HelperIdField}  
                FROM ${HelperDepartmentEntity.TableName} 
                WHERE ${HelperDepartmentEntity.DepartmentIdField} 
                IN (
                    ${departmentId ? departmentId : findingDepartmentIdSql}
                ) 
                GROUP BY ${HelperDepartmentEntity.HelperIdField}
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
            const id = await UserEntity.TransInsert(conn, userFields);
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = {id, jobTitle: helperFields.jobTitle, birthday: helperFields.birthday, 
                            startWorkDate: new Date()};
            const result = await super.TransRequest(conn, sql, [fields]);

            const helperDepartmentResult = await HelperDepartmentEntity.TransInsert(conn, id, helperFields.departmentIds);

            return id;
        });
    }

    static async TransUpdate(id, userFields, helperArgs) {
        return await super.Transaction(async (conn) => {
            const helperFields = { jobTitle: helperArgs.jobTitle, birthday: helperArgs.birthday };
            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
            
            const helperResult = await super.TransRequest(conn, sql, [helperFields, id]);
            const userResult = await UserEntity.TransUpdate(conn, id, userFields);
            const helperDepartmentDelResult = await HelperDepartmentEntity.TransDeleteByHelper(conn, id);
            const helperDepartmentInsertResult = await HelperDepartmentEntity.TransInsert(conn, id, helperArgs.departmentIds);

            return {affected: helperResult.affectedRows, changed: helperResult.changedRows, 
                    warning: helperResult.warningStatus};
        });
    }
}

export default HelperEntity;
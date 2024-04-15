import Entity from "./Entity.js";
import User from "./User.js";
import Ticket from "./Ticket.js";
import Message from "./Message.js";
import HelperDepartment from "./HelperDepartment.js";
import ThemeDepartment from "./ThemeDepartment.js";
import HelperPermission from "./HelperPermission.js";
import Errors from "../Utils/Errors.js";

class Helper extends Entity {
    static TableName = 'helpers';
    static PrimaryField = 'id';
    static JobTitleIdField = 'jobTitleId';
    static BirthdayField = 'birthday';
    static StartWorkDateField = 'startWorkDate';

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetList() {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} <> 0`;
        const result = await super.Request(sql);
        return result;
    }

    static async GetListFiltered(filters) {
        let sql = `
            SELECT * FROM ${this.TableName} 
            JOIN ${User.TableName} 
            ON ${this.TableName}.${this.PrimaryField} = ${User.TableName}.${User.PrimaryField}
            WHERE 
            ${this.TableName}.${this.PrimaryField} <> 0 AND
            ${User.TableName}.${User.IsActiveField} <> 0
        `;

        let fields = [];
        if (filters.countryIds && filters.countryIds.length > 0) {
            sql += ` AND ${User.CountryIdField} IN (?)`;
            fields.push(filters.countryIds);
        }
        if (filters.departmentIds && filters.departmentIds.length > 0) {
            sql += ` AND ${this.PrimaryField} IN (
                SELECT DISTINCT ${HelperDepartment.HelperIdField} FROM ${HelperDepartment.TableName} 
                WHERE ${HelperDepartment.DepartmentIdField} IN (?)
            )`;
            fields.push(filters.departmentIds);
        }

        const result = await super.Request(sql, fields);
        return result;
    }

    static async GetStatsById(helperId, filters) {
        let sql = `
            SELECT 
                COUNT(*) AS totalTickets,
                IFNULL(SUM(${Ticket.StatusIdField} = ${Ticket.StatusIdOpened}), 0) AS newTickets,
                IFNULL(SUM(${Ticket.StatusIdField} = ${Ticket.StatusIdClosed}), 0) AS closedTickets,
                IFNULL(SUM(${Ticket.StatusIdField} = ${Ticket.StatusIdInProgress}), 0) AS inProgressTickets,
                IFNULL(SUM(${Ticket.StatusIdField} = ${Ticket.StatusIdOnRevision}), 0) AS onRevisionTickets,
                IFNULL(SUM(${Ticket.StatusIdField} = ${Ticket.StatusIdOnExtension}), 0) AS onExtensionTickets,
                IFNULL(SUM(${Ticket.StatusIdField} = ${Ticket.StatusIdOnMentor}), 0) AS onMentorTickets,
                IFNULL(SUM(${Ticket.ReactionField} = ${Ticket.ReactionMarkLike}), 0) AS likes,
                IFNULL(SUM(${Ticket.ReactionField} = ${Ticket.ReactionMarkDislike}), 0) AS dislikes,
                COUNT(CASE WHEN ${Ticket.ReactionField} IS NULL THEN 1 ELSE NULL END) AS notRated
            FROM ${Ticket.TableName}
            WHERE ? IN (${Ticket.InitiatorIdField}, ${Ticket.RecipientIdField}, ${Ticket.AssistantIdField})
        `;

        let fields = [helperId];

        if(filters.dateAfter && filters.dateBefore) {
            sql += ` AND ${Ticket.DateField} BETWEEN ? AND ?`;
            fields.push(filters.dateAfter, filters.dateBefore);
        }
        if(filters.unitIds){
            sql += ` AND ${Ticket.UnitField} IN (?)`;
            fields.push(filters.unitIds);
        }
        if(filters.themeIds){
            sql += ` AND ${Ticket.ThemeField} IN (?)`;
            fields.push(filters.themeIds);
        }
        if(filters.subthemeIds){
            sql += ` AND ${Ticket.SubThemeField} IN (?)`;
            fields.push(filters.subthemeIds);
        }

        const result = await super.Request(sql, fields);

        let stats = result[0];

        const msgsAs1 = 'm1';
        const msgsAs2 = 'm2';
        const ticketsAs = `tics`;
        const diffLimit = 200000;
        const dateDiffSql = `ABS(TIMESTAMPDIFF(SECOND, ${msgsAs1}.${Message.DateField}, ${msgsAs2}.${Message.DateField}))`;

        let ticketJoinSql = ``;
        if (filters.unitIds || filters.themeIds || filters.subthemeIds) {
            ticketJoinSql = ` 
                JOIN ${Ticket.TableName} ${ticketsAs} 
                ON ${msgsAs1}.${Message.TicketIdField} = ${ticketsAs}.${Ticket.PrimaryField}
            `;
        }

        let msgSql = `
            SELECT  ${dateDiffSql} AS rTime, 
                    ${msgsAs1}.${Message.PrimaryField} AS hMsgID,
                    ${msgsAs2}.${Message.PrimaryField} AS cMsgID

            FROM    ${Message.TableName} ${msgsAs1}

            JOIN    ${Message.TableName} ${msgsAs2} 
            ON      ${msgsAs1}.${Message.SenderIdField} = ${msgsAs2}.${Message.RecieverIdField} AND
                    ${msgsAs1}.${Message.RecieverIdField} = ${msgsAs2}.${Message.SenderIdField} AND 
                    ${msgsAs1}.${Message.TicketIdField} = ${msgsAs2}.${Message.TicketIdField}

            ${ticketJoinSql}

            WHERE   ${msgsAs1}.${Message.SenderIdField} = ?
            AND     ${msgsAs1}.${Message.DateField} > ${msgsAs2}.${Message.DateField}
            AND     ${dateDiffSql} < ${diffLimit}
        `;

        let msgSqlFields = [helperId];
        if(filters.dateAfter && filters.dateBefore) {
            msgSql += ` AND ${msgsAs2}.${Message.DateField} BETWEEN ? AND ?`;
            msgSqlFields.push(filters.dateAfter, filters.dateBefore);
        }
        if(filters.unitIds){
            msgSql += ` AND ${ticketsAs}.${Ticket.UnitField} IN (?)`;
            msgSqlFields.push(filters.unitIds);
        }
        if(filters.themeIds){
            msgSql += ` AND ${ticketsAs}.${Ticket.ThemeField} IN (?)`;
            msgSqlFields.push(filters.themeIds);
        }
        if(filters.subthemeIds){
            msgSql += ` AND ${ticketsAs}.${Ticket.SubThemeField} IN (?)`;
            msgSqlFields.push(filters.subthemeIds);
        }

        msgSql += `ORDER BY rTime`;
        const msgResult = await super.Request(msgSql, msgSqlFields);

        const seen = new Set();
        const uqRes = [];

        for (const obj of msgResult) {
            if (!seen.has(obj.hMsgID) && !seen.has(obj.cMsgID)) {
                seen.add(obj.hMsgID);
                seen.add(obj.cMsgID);
                uqRes.push(obj);
            }
        }

        const timeSum = uqRes.reduce((total, item) => total + item.rTime, 0);

        const avgTimeSecs = +((timeSum / uqRes.length).toFixed(2));
        stats.avgReplyTime = isNaN(avgTimeSecs) ? -60 * 60 : avgTimeSecs;
        stats.fantasy = +((60 * 60 / stats.avgReplyTime + 0.5 * stats.likes + stats.totalTickets * 0.2).toFixed(3));

        return stats;
    }

    static async GetStatsList(filters) {
        let result = [];
        const helpers = await this.GetListFiltered(filters);

        for (const helper of helpers) {
            let helperStatData = {};
            helperStatData.helper = helper;
            helperStatData.stats = await this.GetStatsById(helper.id, filters);
            result.push(helperStatData);
        }

        if (filters.orderDir === 'DESC') {
            result.sort((a, b) => b.stats[filters.orderBy] - a.stats[filters.orderBy]);
        }
        else {
            result.sort((a, b) => a.stats[filters.orderBy] - b.stats[filters.orderBy]);
        }

        const limitedResult = result.slice(0 + filters.offset, filters.limit + filters.offset);

        return limitedResult;
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

        if (!departmentId) {
            fields.push(subThemeId)
        }

        const sql = `
            SELECT 
                ${this.TableName}.${this.PrimaryField}, 
                IFNULL(${Ticket.TableName}.${ticketCountAS}, 0) AS ${ticketCountAS}
            FROM ${this.TableName}
            
            LEFT JOIN (
                SELECT ${Ticket.RecipientIdField}, COUNT(*) AS ${ticketCountAS}
                FROM ${Ticket.TableName} WHERE ${Ticket.StatusIdField} NOT IN (?)
                GROUP BY ${Ticket.RecipientIdField}
            ) AS ${Ticket.TableName} 
            ON ${this.TableName}.${this.PrimaryField} = ${Ticket.TableName}.${Ticket.RecipientIdField} 
            
            LEFT JOIN ${User.TableName} 
            ON ${this.TableName}.${this.PrimaryField} = ${User.TableName}.${User.PrimaryField}

            LEFT JOIN ${HelperPermission.TableName} 
            ON ${this.TableName}.${this.PrimaryField} = ${HelperPermission.TableName}.${HelperPermission.PrimaryField}  
            
            WHERE ${this.TableName}.${this.PrimaryField} IN ( 
                SELECT ${HelperDepartment.HelperIdField}  
                FROM ${HelperDepartment.TableName} 
                WHERE ${HelperDepartment.DepartmentIdField} 
                IN (
                    ${departmentId ? departmentId : findingDepartmentIdSql}
                ) 
                GROUP BY ${HelperDepartment.HelperIdField}
            ) 
            AND ${User.TableName}.${User.IsActiveField} <> 0
            AND ${HelperPermission.TableName}.${HelperPermission.SendMsgField} <> 0

            ORDER BY ${ticketCountAS} LIMIT 1
        `;
        const result = await super.Request(sql, fields);
        return result[0].id;
    }

    static async TransInsert(userFields, helperFields) {
        return await super.Transaction(async (conn) => {
            userFields.role = User.RoleHelper;
            const id = await User.TransInsert(conn, userFields);
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = {
                id, jobTitleId: helperFields.jobTitleId, birthday: helperFields.birthday,
                startWorkDate: new Date()
            };
            const result = await super.TransRequest(conn, sql, [fields]);

            const helperDepartmentResult = await HelperDepartment.TransInsert(conn, id, helperFields.departmentIds);
            const helperPermissionResult = await HelperPermission.TransInsert(conn, id);

            return id;
        });
    }

    static async TransUpdate(id, userFields, helperArgs) {
        return await super.Transaction(async (conn) => {
            if (super.IsArgsEmpty(userFields) && super.IsArgsEmpty(helperArgs)) throw new Error(Errors.EmptyArgsFields);

            let helperResult = super.EmptyUpdateInfo;

            if (helperArgs.departmentIds && helperArgs.departmentIds.length > 0) {
                const helperDepartmentDelResult = await HelperDepartment.TransDeleteByHelper(conn, id);
                const helperDepartmentInsertResult = await HelperDepartment.TransInsert(conn, id, helperArgs.departmentIds);
            }

            if (!super.IsArgsEmpty(userFields)) {
                const userResult = await User.TransUpdate(conn, id, userFields);
                helperResult = userResult;
            }

            const helperFields = {};
            if (helperArgs.jobTitleId) helperFields.jobTitleId = helperArgs.jobTitleId;
            if (helperArgs.birthday) helperFields.birthday = helperArgs.birthday;

            if (!super.IsArgsEmpty(helperFields)) {
                const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
                helperResult = await super.TransRequest(conn, sql, [helperFields, id]);
                helperResult = { affected: helperResult.affectedRows, changed: helperResult.changedRows, warning: helperResult.warningStatus };
            }

            return helperResult;
        });
    }
}

export default Helper;
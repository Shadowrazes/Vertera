import Entity from "./Entity.js";
import Helper from "./Helper.js";
import Message from "./Message.js";
import User from "./User.js";
import Unit from "./Unit.js";
import Theme from "./Theme.js";
import ThemeDepartment from "./ThemeDepartment.js";
import Translation from "./Translation.js";
import EmailSender from "../Utils/EmailSender.js";
import MySQL from 'mysql2';
import Client from "./Client.js";
import TicketLog from "./TicketLog.js";
import Errors from "../Utils/Errors.js";
import md5 from "md5";

const isBuild = process.argv[2] === 'build';
const baseUrl = isBuild ? 'https://help.vertera.org' : 'http://localhost:5173';

class Ticket extends Entity {
    static TableName = 'tickets';
    static PrimaryField = 'id';
    static InitiatorIdField = 'initiatorId';
    static RecipientIdField = 'recipientId';
    static AssistantIdField = 'assistantId';
    static StatusIdField = 'statusId';
    static DateField = 'date';
    static UnitField = 'unitId';
    static ThemeField = 'themeId';
    static SubThemeField = 'subThemeId';
    static ReactionField = 'reaction';
    static LinkField = 'link';
    static TitleField = 'title';

    static StatusIdOpened = 1;
    static StatusIdClosed = 2;
    static StatusIdInProgress = 3;
    static StatusIdOnRevision = 4;
    static StatusIdOnExtension = 5;
    static StatusIdNotification = 6;
    static StatusIdOnMentor = 7;

    static ReactionMarkLike = 1;
    static ReactionMarkDislike = 0;

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async TransGetById(conn, id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.TransRequest(conn, {sql, nestTables: true}, [id]);
        return result[0].tickets;
    }

    static async GetByLink(link) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.LinkField} = ?`;
        const result = await super.Request(sql, [link]);
        return result[0];
    }

    static async GetLastMsg(ticketId) {
        const sql = `
            SELECT * FROM ${Message.TableName} 
            WHERE ${Message.TicketIdField} = ? 
            ORDER BY ${Message.DateField} DESC LIMIT 1
        `;
        const result = await super.Request(sql, [ticketId]);
        return result[0];
    }

    static async GetMsgStats(ticketId) {
        const sql = `
        SELECT COUNT(*) AS total, SUM(IF(${Message.TableName}.${Message.ReadField} = 0, 1, 0)) AS unread
        FROM ${Message.TableName} WHERE ${Message.TicketIdField} = ?;
        `;
        const result = await super.Request(sql, [ticketId]);
        return result[0];
    }

    // ORDER BY lastMsgDate, themeStroke, unitStroke, date, и другие (по необходимости)
    static async GetList(filter, clientId) {
        const lastMsgDateAS = 'lastMsgDate';
        const totalMsgAS = 'totalMsg';

        const themeIdAS = 'thmId';
        const themeTranslationAS = 'themeStroke';
        const themeJoinTableName = 'themeSubReq';

        const unitIdAS = 'untId';
        const unitTranslationAS = 'unitStroke';
        const unitJoinTableName = 'unitSubReq';

        let unitColSql = ``;
        let unitJoinSql = ``;

        let themeColSql = ``;
        let themeJoinSql = ``;

        if (filter.orderBy == unitTranslationAS) {
            unitColSql = `${unitJoinTableName}.${unitTranslationAS} AS ${unitTranslationAS},`;
            unitJoinSql = `
                JOIN (
                    SELECT  ${Unit.TableName}.${Unit.PrimaryField} AS ${unitIdAS}, 
                            ${Translation.TableName}.${filter.lang} AS ${unitTranslationAS} 
                    FROM ${Unit.TableName}
                    JOIN ${Translation.TableName} 
                    ON ${Unit.NameCodeField} = ${Translation.TableName}.${Translation.CodeField}
                ) ${unitJoinTableName}
                ON ${this.TableName}.${this.UnitField} = ${unitJoinTableName}.${unitIdAS}
            `;
        }

        if (filter.orderBy == themeTranslationAS) {
            themeColSql = `${themeJoinTableName}.${themeTranslationAS} AS ${themeTranslationAS},`;
            themeJoinSql = `
                JOIN (
                    SELECT  ${Theme.TableName}.${Theme.PrimaryField} AS ${themeIdAS}, 
                            ${Translation.TableName}.${filter.lang} AS ${themeTranslationAS} 
                    FROM ${Theme.TableName}
                    JOIN ${Translation.TableName} 
                    ON ${Theme.NameCodeField} = ${Translation.TableName}.${Translation.CodeField}
                ) ${themeJoinTableName}
                ON ${this.TableName}.${this.ThemeField} = ${themeJoinTableName}.${themeIdAS}
            `;
        }

        let sql = `
        SELECT  ${this.TableName}.${this.PrimaryField}, ${this.TableName}.${this.InitiatorIdField}, 
                ${this.TableName}.${this.RecipientIdField}, ${this.TableName}.${this.StatusIdField}, 
                ${this.TableName}.${this.DateField}, ${this.TableName}.${this.UnitField}, 
                ${this.TableName}.${this.ThemeField}, ${this.TableName}.${this.SubThemeField},
                ${this.TableName}.${this.ReactionField}, ${this.TableName}.${this.LinkField},
                ${this.TableName}.${this.AssistantIdField}, ${this.TableName}.${this.TitleField},
                ${unitColSql}
                ${themeColSql}
                MAX(${Message.TableName}.${Message.DateField}) AS ${lastMsgDateAS}, 
                COUNT(${Message.TableName}.${Message.PrimaryField}) AS ${totalMsgAS}

        FROM    ${this.TableName} 

        ${unitJoinSql}
        ${themeJoinSql}

        JOIN    ${Message.TableName} 
                ON ${this.TableName}.${this.PrimaryField} = ${Message.TableName}.${Message.TicketIdField}

        WHERE   1=1 
        `;

        let fields = [];

        if (clientId) {
            sql += ` AND ? IN (
                ${this.InitiatorIdField}, 
                ${this.RecipientIdField}, 
                ${this.AssistantIdField}
            )`;
            fields.push(clientId);
        }
        if (filter.words && filter.words.length > 0) {
            sql += ` 
                AND ${this.TableName}.${this.PrimaryField} IN (
                    SELECT DISTINCT ${Message.TicketIdField} 
                    FROM ${Message.TableName} 
                    WHERE MATCH (${Message.TextField}) AGAINST (? IN BOOLEAN MODE)
                )
            `;
            fields.push(filter.words);
        }
        if (filter.unitIds && filter.unitIds.length > 0) {
            sql += ` AND ${this.UnitField} IN (?)`;
            fields.push(filter.unitIds);
        }
        if (filter.themeIds && filter.themeIds.length > 0) {
            sql += ` AND ${this.TableName}.${this.ThemeField} IN (?)`;
            fields.push(filter.themeIds);
        }
        if (filter.subThemeIds && filter.subThemeIds.length > 0) {
            sql += ` AND ${this.SubThemeField} IN (?)`;
            fields.push(filter.subThemeIds);
        }
        if (filter.helperIds && filter.helperIds.length > 0) {
            sql += ` AND (
                ${this.InitiatorIdField} IN (?) OR 
                ${this.RecipientIdField} IN (?) OR 
                ${this.AssistantIdField} IN (?)
            )`;
            fields.push(filter.helperIds, filter.helperIds, filter.helperIds);
        }
        if (filter.helperCountryIds && filter.helperCountryIds.length > 0) {
            const countryHelperIdsSubQuery = `
                SELECT ${User.PrimaryField} 
                FROM ${User.TableName} 
                WHERE ${User.CountryIdField} IN (?) AND ${User.RoleField} = '${User.RoleHelper}'
            `;

            sql += ` 
                AND (
                    ${this.InitiatorIdField} IN (${countryHelperIdsSubQuery}) OR
                    ${this.RecipientIdField} IN (${countryHelperIdsSubQuery})
                )
            `;
            fields.push(filter.helperCountryIds, filter.helperCountryIds);
        }
        if (filter.clientCountryIds && filter.clientCountryIds.length > 0) {
            const countryClientIdsSubQuery = `
                SELECT ${User.PrimaryField} 
                FROM ${User.TableName} 
                WHERE ${User.CountryIdField} IN (?) AND ${User.RoleField} = '${User.RoleClient}'
            `;

            sql += ` 
                AND (
                    ${this.InitiatorIdField} IN (${countryClientIdsSubQuery}) OR
                    ${this.RecipientIdField} IN (${countryClientIdsSubQuery})
                )
            `;
            fields.push(filter.clientCountryIds, filter.clientCountryIds);
        }
        if (filter.replyed != undefined) {
            sql += ` 
            AND ${this.InitiatorIdField} = (
                SELECT ${Message.SenderIdField}
                FROM ${Message.TableName}
                WHERE ${Message.DateField} = (
                    SELECT MAX(${Message.DateField}) 
                    FROM ${Message.TableName} 
                    WHERE ${Message.TicketIdField} ${!filter.replyed ? '=' : '<>'} ${this.TableName}.${this.PrimaryField})
                )
            `;
        }
        if (filter.statusIds && filter.statusIds.length > 0) {
            sql += ` AND ${this.StatusIdField} IN (?)`;
            fields.push(filter.statusIds);
        }
        if (filter.dateAfter && filter.dateBefore) {
            sql += ` AND ${this.TableName}.${this.DateField} BETWEEN ? AND ?`;
            fields.push(filter.dateAfter, filter.dateBefore);
        }
        if (filter.reaction != undefined) {
            sql += ` AND ${this.ReactionField} = ?`;
            fields.push(filter.reaction);
        }
        if (filter.outerId) {
            const outerIdSubQuery = `
                SELECT ${User.PrimaryField} 
                FROM ${User.TableName} 
                WHERE ${User.OuterIdField} IN (?)
            `;

            sql += ` 
                AND (
                    ${this.InitiatorIdField} IN (${outerIdSubQuery}) OR
                    ${this.RecipientIdField} IN (${outerIdSubQuery})
                )
            `;
            fields.push(filter.outerId);
            fields.push(filter.outerId);
        }
        
        sql += ` GROUP BY ${this.TableName}.${this.PrimaryField}`;

        const countSql = `SELECT COUNT(*) AS total FROM ( ${sql} ) AS subquery`;
        const countRes = await super.Request(countSql, fields);

        sql += ` ORDER BY ${MySQL.escapeId(filter.orderBy)} ${filter.orderDir === 'ASC' ? 'ASC' : 'DESC'}`;
        sql += ` LIMIT ? OFFSET ?`;

        fields.push(filter.limit, filter.offset);
        const res = await super.Request(sql, fields);
        return { count: countRes[0].total, array: res };
    }

    static async Split(parentId, argsList, initiator) {
        return await super.Transaction(async (conn) => {
            const curTicket = await this.GetById(parentId);

            if (curTicket.statusId == this.StatusIdNotification) throw new Error(Errors.UpdateOfNotificationTicket);

            const msgSysFields = {
                senderId: User.AdminId, recieverId: curTicket.initiatorId, type: Message.TypeSystem,
                readed: 0, ticketId: parentId, text: `Обращение разделено на ${argsList.length} новых`
            };
            const msgSysResult = await Message.TransInsert(msgSysFields, conn);

            const splitLogFields = {
                type: TicketLog.TypeSplit, ticketId: parentId,
                info: `Разделил`, initiatorId: initiator.id
            };
            const splitLogRes = await TicketLog.TransInsert(conn, splitLogFields);

            for (let arg of argsList) {
                arg.isSplit = true;
                arg.initiator = initiator;

                const insertRes = await this.TransInsert(arg, conn);
            }

            const systemInitiator = await User.GetById(0);
            const closeTicketUpd = await this.TransUpdate(parentId, { statusId: this.StatusIdClosed }, undefined, systemInitiator, conn);

            return 0;
        });
    }

    static async RedirectToMentor(id, mentorOuterId, initiator) {
        return await super.Transaction(async (conn) => {
            const mentor = await User.GetByOuterId(mentorOuterId);
            if (!mentor) throw new Error(Errors.UserNotFOund);

            const curTicket = await this.GetById(id);
            if (curTicket.statusId == this.StatusIdNotification) throw new Error(Errors.UpdateOfNotificationTicket);

            const msgSysFields = {
                senderId: User.AdminId, recieverId: curTicket.initiatorId, type: Message.TypeSystem,
                readed: 0, ticketId: id, text: `Наставник подключен к диалогу, ожидайте ответа.`
            };
            const msgSysResult = await Message.TransInsert(msgSysFields, conn);

            const assistantTicketUpd = await this.TransUpdate(id, { assistantId: mentor.id }, undefined, initiator, conn);

            return 0;
        });
    }

    static async TransInsertMass(args) {
        return await super.Transaction(async (conn) => {
            let notInsertedIds = [];
            let insertArgs =  {
                ticketFields: args.ticketFields, 
                messageFields: args.messageFields,
                notification: args.notification
            };

            for(let recipientId of args.ids) {
                try{
                    if (!args.idsOuter){
                        // Если переданы внутренние id
                        insertArgs.ticketFields.recipientId = recipientId;
                    }
                    else {
                        // Если переданы внешние id из файла
                        const user = await User.GetByOuterId(recipientId);
                        insertArgs.ticketFields.recipientId = user.id;
                    }
    
                    const insertRes = await this.TransInsert(insertArgs, conn);
                }
                catch {
                    notInsertedIds.push(recipientId);
                }
            }

            return notInsertedIds;
        });
    }

    static async TransInsert(args, conn) {
        const transFunc = async (conn) => {
            const ticketFields = args.ticketFields;
            const messageFields = args.messageFields;

            if(ticketFields.recipientId != undefined) {
                const user = await User.GetById(ticketFields.recipientId);
                if(!user) throw new Error(Errors.UserNotFOund);
            }

            // Надо подобрать хелпера, если адресат тикета не указан явно и тикет - не уведомление
            const autoHelperAssign = ticketFields.recipientId == undefined && !args.notification;

            if(autoHelperAssign){
                const helperId = await Helper.GetMostFreeHelper(ticketFields.subThemeId);
                ticketFields.recipientId = helperId;
            }

            const ticketLink = md5(new Date().toISOString() + ticketFields.initiatorId);

            const sql = `INSERT INTO ${this.TableName} SET ?`;
            ticketFields.link = ticketLink;
            ticketFields.date = new Date();
            ticketFields.statusId = args.notification ? this.StatusIdNotification : this.StatusIdOpened;

            const result = await super.TransRequest(conn, sql, [ticketFields]);

            //
            const createTicketLogFields = {
                type: TicketLog.TypeCreate, ticketId: result.insertId,
                info: 'Создал', initiatorId: ticketFields.initiatorId
            };
            if (args.isSplit) {
                createTicketLogFields.type = TicketLog.TypeSplitCreate;
                createTicketLogFields.info = 'Создал (сплит)';
                createTicketLogFields.initiatorId = args.initiator.id;

                const createTicketLogRes = await TicketLog.TransInsert(conn, createTicketLogFields);

                const msgSysFields = {
                    senderId: User.AdminId, recieverId: ticketFields.initiatorId, type: Message.TypeSystem,
                    readed: 0, ticketId: result.insertId, text: `Обращение создано разделением`
                };
                const msgSysResult = await Message.TransInsert(msgSysFields, conn);
            }
            else {
                const createTicketLogRes = await TicketLog.TransInsert(conn, createTicketLogFields);
            }

            const recipientChangeLogFields = {
                type: TicketLog.TypeRecipientChange, ticketId: result.insertId,
                info: `Назначен адресат`, 
                initiatorId: (autoHelperAssign ? User.AdminId : ticketFields.initiatorId)
            };
            const recipientChangeLogRes = await TicketLog.TransInsert(conn, recipientChangeLogFields);
            //  //

            messageFields.recieverId = ticketFields.recipientId ;
            messageFields.ticketId = result.insertId;
            messageFields.type = Message.TypeDefault;
            const messageResult = await Message.TransInsert(messageFields, conn);

            const dialogLink = baseUrl + `/dialog/${ticketLink}/`;
            const curInitiator = await User.GetById(ticketFields.initiatorId);

            // Если тикет создал клиент, отправляет уведомление на почту
            if(curInitiator.role == User.RoleClient){
                const clientResult = await Client.GetById(ticketFields.initiatorId);
                const emailText = `Здравствуйте, ${curInitiator.name}! Ваше обращение в техподдержку VERTERA принято в обработку.\nВ ближайшее время вы получите ответ.\n\nОтслеживать статус обращения вы можете по ссылке: ${dialogLink}`;
                EmailSender.Notify(clientResult.email, emailText);
            }

            return { id: result.insertId, initiatorId: ticketFields.initiatorId, link: dialogLink };
        };

        if (!conn) {
            return await super.Transaction(async (conn) => {
                return await transFunc(conn);
            });
        }
        else {
            return await transFunc(conn);
        }
    }

    static async TransUpdate(id, fields, departmentId, initiator, conn) {
        const transFunc = async (conn) => {
            const curTicket = await this.GetById(id);

            if (curTicket.statusId == this.StatusIdNotification) throw new Error(Errors.UpdateOfNotificationTicket);

            if (super.IsArgsEmpty(fields) && !departmentId) throw new Error(Errors.EmptyArgsFields);

            if (fields.statusId) {
                let statusChangeLogFields = {
                    type: TicketLog.TypeStatusChange, ticketId: id,
                    info: 'Статус', initiatorId: initiator.id
                };
                if (fields.statusId == this.StatusIdClosed) statusChangeLogFields.info = 'Закрыл';
                if (fields.statusId == this.StatusIdInProgress) statusChangeLogFields.info = 'В работе';
                if (fields.statusId == this.StatusIdOnExtension) statusChangeLogFields.info = 'Требует дополнения';

                const statusChangeLogRes = await TicketLog.TransInsert(conn, statusChangeLogFields);
            }

            if(fields.assistantId){
                let assistantConnLogFields = {
                    type: TicketLog.TypeAssistantConn, ticketId: id,
                    info: `ID ${fields.assistantId} Подключен к диалогу`, initiatorId: initiator.id
                };

                let statusChangeLogFields = {
                    type: TicketLog.TypeStatusChange, ticketId: id,
                };

                if(fields.assistantId > 0){
                    const assistantUser = await User.GetById(fields.assistantId);
                    const isHelperAssistant = assistantUser.role != User.RoleClient;

                    // Если клиент пытается сменить ассистента, а не отключиться
                    if(initiator.role == User.RoleClient) throw new Error(Errors.AccessForbidden);

                    const assistantConnLogRes = await TicketLog.TransInsert(conn, assistantConnLogFields);

                    statusChangeLogFields.initiatorId = isHelperAssistant ? User.AdminId : initiator.id;
                    statusChangeLogFields.info = isHelperAssistant ? 'На уточнении' : 'Направил наставнику';
                    fields.statusId = isHelperAssistant ? this.StatusIdOnRevision : this.StatusIdOnMentor;

                    const statusChangeLogRes = await TicketLog.TransInsert(conn, statusChangeLogFields);
                }
                else {
                    assistantConnLogFields.info = `ID ${curTicket.assistantId} Отключен от диалога`;
                    assistantConnLogFields.initiatorId = initiator.id;
                    const sql = `
                        UPDATE ${this.TableName} 
                        SET ${this.AssistantIdField} = NULL
                        WHERE ${this.PrimaryField} = ?`
                    ;
                    const res = await super.TransRequest(conn, sql, [id]);
                    const assistantConnLogRes = await TicketLog.TransInsert(conn, assistantConnLogFields);
                    delete fields.assistantId;

                    fields.statusId = this.StatusIdInProgress;
                    statusChangeLogFields.initiatorId = User.AdminId;
                    statusChangeLogFields.info = 'В работе';
                    const statusChangeLogRes = await TicketLog.TransInsert(conn, statusChangeLogFields);
                }
            }

            if (fields.reaction) {
                const reactionLogFields = {
                    type: TicketLog.TypeClientReaction, ticketId: id,
                    info: `Поставил оценку`, initiatorId: initiator.id
                };
                const reactionLogRes = await TicketLog.TransInsert(conn, reactionLogFields);
            }

            if (fields.subThemeId) {
                const themeChangeLogFields = {
                    type: TicketLog.TypeThemeChange, ticketId: id,
                    info: `Изменил подтему на ID ${fields.subThemeId}`, initiatorId: initiator.id
                };
                const themeChangeLogRes = await TicketLog.TransInsert(conn, themeChangeLogFields);
            }

            if (fields.title) {
                const titleChangeLogFields = {
                    type: TicketLog.TypeTitleChange, ticketId: id,
                    info: `Изменил заголовок на '${fields.title}'`, initiatorId: initiator.id
                };
                const titleChangeLogRes = await TicketLog.TransInsert(conn, titleChangeLogFields);
            }

            if (fields.initiatorId) {
                const initiatorChangeLogFields = {
                    type: TicketLog.TypeInitiatorChange, ticketId: id,
                    info: `Изменил создателя на ID ${fields.initiatorId}`, initiatorId: initiator.id
                };
                const initiatorChangeLogRes = await TicketLog.TransInsert(conn, initiatorChangeLogFields);
            }

            if (fields.recipientId) {
                const recipientChangeLogFields = {
                    type: TicketLog.TypeRecipientChange, ticketId: id,
                    info: `Изменил адресата на ID ${fields.recipientId}`, initiatorId: initiator.id
                };
                const recipientChangeLogRes = await TicketLog.TransInsert(conn, recipientChangeLogFields);
            }

            // Если хелпер меняется через выбор департамента
            if (departmentId && !fields.recipientId) {
                const curDepartments = await ThemeDepartment.GetListBySubThemeId(curTicket.subThemeId);

                const changeDepLogFields = {
                    type: TicketLog.TypeDepChange, ticketId: id,
                    info: `Изменил деп.`, initiatorId: initiator.id
                };
                const changeDepLogRes = await TicketLog.TransInsert(conn, changeDepLogFields);

                let needNewHelper = true;
                // Если текущий хелпер уже есть в новом департаменте, менять хелпера не надо
                for (const department of curDepartments) {
                    if (departmentId == department.id) {
                        needNewHelper = false;
                        break;
                    }
                }

                if (needNewHelper) {
                    fields.recipientId = await Helper.GetMostFreeHelper(fields.subThemeId, departmentId);

                    const helperAssignLogFields = {
                        type: TicketLog.TypeHelperAssign, ticketId: id,
                        info: `Изменен куратор (деп.) на ID ${fields.recipientId}`, initiatorId: User.AdminId
                    };
                    const helperAssignLogRes = await TicketLog.TransInsert(conn, helperAssignLogFields);
                }
                else {
                    const helperNoAssignLogFields = {
                        type: TicketLog.TypeHelperAssign, ticketId: id,
                        info: `Куратор не изменен (деп.)`, initiatorId: User.AdminId
                    };
                    const helperNoAssignLogRes = await TicketLog.TransInsert(conn, helperNoAssignLogFields);
                }
            }

            let result = super.EmptyUpdateInfo;

            if (!super.IsArgsEmpty(fields)) {
                const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
                result = await super.TransRequest(conn, sql, [fields, id]);
            }

            return { affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus };
        };

        if (!conn) {
            return await super.Transaction(async (conn) => {
                return await transFunc(conn);
            });
        }
        else {
            return await transFunc(conn);
        }
    }

    // Cascade deleting Ticket & Ticket Messages & Messages attachs
    static async DeleteCascade(id) {
        const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result.affectedRows;
    }
}

export default Ticket;
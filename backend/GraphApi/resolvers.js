import Pool from '../DB/Connect.js';
import { GraphQLScalarType, Kind }  from 'graphql';

import Entity from "../Entities/Entity.js";
import UserEntity from "../Entities/User.js";
import HelperEntity from "../Entities/Helper.js";
import ClientEntity from "../Entities/Client.js";
import TicketEntity from "../Entities/Ticket.js";
import MessageEntity from "../Entities/Message.js";
import AttachmentEntity from "../Entities/Attachment.js";
import ThemeEntity from "../Entities/Theme.js";
import SubThemeEntity from "../Entities/SubTheme.js";
import UnitEntity from "../Entities/Unit.js"; 
import DepartmentEntity from "../Entities/Department.js"; 
import ThemeDepartmentEntity from "../Entities/ThemeDepartment.js";
import HelperDepartmentEntity from "../Entities/HelperDepartment.js"; 
import TranslationEntity from "../Entities/Translation.js";

Entity.Pool = Pool;

export const resolvers = {
    Query:{
        user: async (_, { id }) => {
            return await UserEntity.GetById(id);
        },
        userList: async (_, args) => {
            return await UserEntity.GetList();
        },
        helper: async (_, { id }) => {
            return await HelperEntity.GetById(id);
        },
        helperList: async (_, args) => {
            return await HelperEntity.GetList();
        },
        client: async (_, { id }) => {
            // user
            return await ClientEntity.GetById(id);
        },
        clientList: async (_, args) => {
            return await ClientEntity.GetList();
        },
        ticket: async (_, { id }) => {
            // user
            return await TicketEntity.GetById(id);
        },
        ticketList: async (_, args) => {
            // user
            return await TicketEntity.GetList(args.filters);
        },
        message: async (_, { id }) => {
            return await MessageEntity.GetById(id);
        },
        messageList: async (_, { ticketId }) => {
            // user
            return await MessageEntity.GetListByTicket(ticketId);
        },
        attachment: async (_, { id }) => {
            return await AttachmentEntity.GetById(id);
        },
        attachmentList: async (_, { messageId }) => {
            return await AttachmentEntity.GetListByMsg(messageId);
        },
        subThemeList: async (_, args) => {
            return await SubThemeEntity.GetList();
        },
        departmentList: async (_, args) => {
            return await DepartmentEntity.GetList();
        },
    },
    Mutation: {
        addClientUser: async (_, args) => {
            // user
            return await ClientEntity.TransInsert(args.fields);
        },
        addHelperUser: async (_, args) => {
            // superAdmin
            return await HelperEntity.TransInsert(args.fields);
        },
        addTicket: async (_, args) => {
            // user
            return await TicketEntity.TransInsert(args);
        },
        addMessage: async (_, args) => {
            // user
            return await MessageEntity.TransInsert(args.fields);
        },
        updateTicket: async (_, args) => {
            // user
            return await TicketEntity.Update(args.id, args.fields);
        },
        updateClientUser: async (_, args) => {
            // user
            return await ClientEntity.TransUpdate(args.id, args.fields);
        },
        updateHelperUser: async (_, args) => {
            return await HelperEntity.TransUpdate(args.id, args.fields);
        },
        updateSubTheme: async (_, args) => {
            return await SubThemeEntity.Update(args.id, args.fields);
        },
        updateTheme: async (_, args) => {
            return await ThemeEntity.Update(args.id, args.fields);
        },
        updateUnit: async (_, args) => {
            return await UnitEntity.Update(args.id, args.fields);
        },
        updateThemeDepartment: async (_, args) => {
            return await ThemeDepartmentEntity.Update(args.id, args.fields);
        },
        updateDepartment: async (_, args) => {
            return await DepartmentEntity.Update(args.id, args.fields);
        },
        deleteTicket: async (_, { id }) => {
            return await TicketEntity.DeleteCascade(id);
        },
        deleteUser: async (_, { id }) => {
            return await UserEntity.DeleteCascade(id);
        },
        deleteUnit: async (_, { id }) => {
            return await UnitEntity.DeleteCascade(id);
        },
        deleteTheme: async (_, { id }) => {
            return await ThemeEntity.DeleteCascade(id);
        },
        deleteSubTheme: async (_, { id }) => {
            return await SubThemeEntity.DeleteCascade(id);
        },
        deleteThemeDepartment: async (_, { id }) => {
            return await ThemeDepartmentEntity.DeleteCascade(id);
        },
        deleteDepartment: async (_, { id }) => {
            return await DepartmentEntity.DeleteCascade(id);
        },
    },
    Client: {
        user: async (parent, args) => {
            return await UserEntity.GetById(parent.id);
        },
    },
    Helper: {
        user: async (parent, args) => {
            return await UserEntity.GetById(parent.id);
        },
        departments: async (parent, args) => {
            return await HelperDepartmentEntity.GetListByHelperId(parent.id);
        },
    },
    Ticket: {
        client: async (parent, args) => {
            return await ClientEntity.GetById(parent.clientId);
        },
        helper: async (parent, args) => {
            return await HelperEntity.GetById(parent.helperId);
        },
        messages: async (parent, args) => {
            return await MessageEntity.GetListByTicket(parent.id);
        },
        lastMessage: async (parent, args) => {
            return await TicketEntity.GetLastMsg(parent.id);
        },
        msgStats: async (parent, args) => {
            return await TicketEntity.GetMsgStats(parent.id);
        },
        subTheme: async (parent, args) => {
            return await SubThemeEntity.GetById(parent.subThemeId);
        },
    },
    Message: {
        sender: async (parent, args) => {
            return await UserEntity.GetById(parent.senderId);
        },
        reciever: async (parent, args) => {
            return await UserEntity.GetById(parent.recieverId);
        },
        attachs: async (parent, args) => {
            return await AttachmentEntity.GetListByMsg(parent.id);
        },
        ticket: async (parent, args) => {
            return await TicketEntity.GetById(parent.ticketId);
        },
    },
    SubTheme: {
        theme: async (parent, args) => {
            return await ThemeEntity.GetById(parent.themeId);
        },
        departments: async (parent, args) => {
            return await ThemeDepartmentEntity.GetListBySubThemeId(parent.id);
        },
    },
    Theme: {
        unit: async (parent, args) => {
            return await UnitEntity.GetById(parent.unitId);
        },
    },
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'Дата и время в формате ISO 8601',
        serialize(value) {
            return value.toISOString().split('.')[0]; // преобразуем дату в строку в формате ISO 8601
        },
        parseValue(value) {
            return new Date(value); // преобразуем строку в формате ISO 8601 в объект Date
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return new Date(ast.value); // преобразуем строковое значение в формате ISO 8601 в объект Date
            }
            return null;
        },
    }),
}
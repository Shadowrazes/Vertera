import Pool from '../DB/Connect.js';
import { GraphQLScalarType, Kind }  from 'graphql';

import Entity from "../Entities/Entity.js";
import User from "../Entities/User.js";
import Helper from "../Entities/Helper.js";
import Client from "../Entities/Client.js";
import Ticket from "../Entities/Ticket.js";
import Message from "../Entities/Message.js";
import Attachment from "../Entities/Attachment.js";
import Theme from "../Entities/Theme.js";
import SubTheme from "../Entities/SubTheme.js";
import Unit from "../Entities/Unit.js"; 
import Department from "../Entities/Department.js"; 
import Country from '../Entities/Country.js';
import ThemeDepartment from "../Entities/ThemeDepartment.js";
import HelperDepartment from "../Entities/HelperDepartment.js";
import TicketStatus from '../Entities/TicketStatus.js'; 
import HelperJobTitle from '../Entities/HelperJobTitle.js'
import Translations from "../Entities/Translations.js";

Entity.Pool = Pool;

export const resolvers = {
    Query:{
        login: async (_, { login, password }) => {
            return await User.Login(login, password);
        },
        user: async (_, { id }) => {
            return await User.GetById(id);
        },
        userList: async (_, args) => {
            if(!(await User.AccessAllow('helper', args.token))) throw new Error('Forbidden');
            return await User.GetList();
        },
        helper: async (_, { id }) => {
            return await Helper.GetById(id);
        },
        helperList: async (_, args) => {
            return await Helper.GetList();
        },
        client: async (_, { id }) => {
            // user
            return await Client.GetById(id);
        },
        clientList: async (_, args) => {
            return await Client.GetList();
        },
        ticket: async (_, { id }) => {
            // user
            return await Ticket.GetById(id);
        },
        ticketList: async (_, args) => {
            // user
            return await Ticket.GetList(args.filters);
        },
        message: async (_, { id }) => {
            return await Message.GetById(id);
        },
        messageList: async (_, { ticketId }) => {
            // user
            return await Message.GetListByTicket(ticketId);
        },
        attachment: async (_, { id }) => {
            return await Attachment.GetById(id);
        },
        attachmentList: async (_, { messageId }) => {
            return await Attachment.GetListByMsg(messageId);
        },
        subThemeList: async (_, args) => {
            return await SubTheme.GetList();
        },
        departmentList: async (_, args) => {
            return await Department.GetList();
        },
    },
    Mutation: {
        addClientUser: async (_, args) => {
            // user
            return await Client.TransInsert(args.userFields, args.clientFields);
        },
        addHelperUser: async (_, args) => {
            // superAdmin
            return await Helper.TransInsert(args.userFields, args.helperFields);
        },
        addTicket: async (_, args) => {
            // user
            return await Ticket.TransInsert(args);
        },
        addMessage: async (_, args) => {
            // user
            return await Message.TransInsert(args.fields);
        },
        updateTicket: async (_, args) => {
            // user
            return await Ticket.TransUpdate(args.id, args.fields, args.departmentId);
        },
        updateClientUser: async (_, args) => {
            // user
            return await Client.TransUpdate(args.id, args.userFields, args.clientFields);
        },
        updateHelperUser: async (_, args) => {
            return await Helper.TransUpdate(args.id, args.userFields, args.helperFields);
        },
        updateSubTheme: async (_, args) => {
            return await SubTheme.Update(args.id, args.fields);
        },
        updateTheme: async (_, args) => {
            return await Theme.Update(args.id, args.fields);
        },
        updateUnit: async (_, args) => {
            return await Unit.Update(args.id, args.fields);
        },
        updateThemeDepartment: async (_, args) => {
            return await ThemeDepartment.Update(args.id, args.fields);
        },
        updateDepartment: async (_, args) => {
            return await Department.Update(args.id, args.fields);
        },
        deleteTicket: async (_, { id }) => {
            return await Ticket.DeleteCascade(id);
        },
        deleteUser: async (_, { id }) => {
            return await User.DeleteCascade(id);
        },
        deleteUnit: async (_, { id }) => {
            return await Unit.DeleteCascade(id);
        },
        deleteTheme: async (_, { id }) => {
            return await Theme.DeleteCascade(id);
        },
        deleteSubTheme: async (_, { id }) => {
            return await SubTheme.DeleteCascade(id);
        },
        deleteThemeDepartment: async (_, { id }) => {
            return await ThemeDepartment.DeleteCascade(id);
        },
        deleteDepartment: async (_, { id }) => {
            return await Department.DeleteCascade(id);
        },
    },
    User: {
        country: async (parent, args) => {
            return await Country.GetById(parent.countryId);
        },
    },
    Client: {
        user: async (parent, args) => {
            return await User.GetById(parent.id);
        },
    },
    Helper: {
        user: async (parent, args) => {
            return await User.GetById(parent.id);
        },
        jobTitle: async (parent, args) => {
            return await HelperJobTitle.GetById(parent.id);
        },
        departments: async (parent, args) => {
            return await HelperDepartment.GetListByHelperId(parent.id);
        },
    },
    HelperJobTitle: {
        name: async (parent, args) => {
            return await Translations.GetByCode(parent.nameCode, args.lang);
        },
    },
    Ticket: {
        client: async (parent, args) => {
            return await Client.GetById(parent.clientId);
        },
        helper: async (parent, args) => {
            return await Helper.GetById(parent.helperId);
        },
        messages: async (parent, args) => {
            return await Message.GetListByTicket(parent.id);
        },
        lastMessage: async (parent, args) => {
            return await Ticket.GetLastMsg(parent.id);
        },
        msgStats: async (parent, args) => {
            return await Ticket.GetMsgStats(parent.id);
        },
        subTheme: async (parent, args) => {
            return await SubTheme.GetById(parent.subThemeId);
        },
        status: async (parent, args) => {
            return await TicketStatus.GetById(parent.statusId);
        },
    },
    Message: {
        sender: async (parent, args) => {
            return await User.GetById(parent.senderId);
        },
        reciever: async (parent, args) => {
            return await User.GetById(parent.recieverId);
        },
        attachs: async (parent, args) => {
            return await Attachment.GetListByMsg(parent.id);
        },
        ticket: async (parent, args) => {
            return await Ticket.GetById(parent.ticketId);
        },
    },
    SubTheme: {
        theme: async (parent, args) => {
            return await Theme.GetById(parent.themeId);
        },
        departments: async (parent, args) => {
            return await ThemeDepartment.GetListBySubThemeId(parent.id);
        },
        name: async (parent, args) => {
            return await Translations.GetByCode(parent.nameCode, args.lang);
        },
    },
    Theme: {
        unit: async (parent, args) => {
            return await Unit.GetById(parent.unitId);
        },
        name: async (parent, args) => {
            return await Translations.GetByCode(parent.nameCode, args.lang);
        },
    },
    Unit: {
        name: async (parent, args) => {
            return await Translations.GetByCode(parent.nameCode, args.lang);
        },
    },
    TicketStatus: {
        name: async (parent, args) => {
            return await Translations.GetByCode(parent.nameCode, args.lang);
        },
    },
    Department: {
        name: async (parent, args) => {
            return await Translations.GetByCode(parent.nameCode, args.lang);
        },
    },
    Country: {
        name: async (parent, args) => {
            return await Translations.GetByCode(parent.nameCode, args.lang);
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
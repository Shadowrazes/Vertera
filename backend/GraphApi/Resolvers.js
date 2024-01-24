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
import Translation from "../Entities/Translation.js";
import Token from '../Utils/Token.js';

Entity.Pool = Pool;
const clientRole = 'client';
const helperRole = 'helper';
const adminRole = 'system';

async function Access(role, token){
    if(!(await User.AccessAllow(role, token))) throw new Error('Forbidden');
}

export const resolvers = {
    Query:{
        login: async (_, { login, password }) => {
            return await User.Login(login, password);
        },
        clientQuery: async (_, args, context) => {
            //await Access(clientRole, args.token);
            context.token = args.token;
            return {class: 'client'};
        },
        helperQuery: async (_, args) => {
            //await Access(helperRole, args.token);
            return {class: 'helper'};
        },
        adminQuery: async (_, args) => {
            //await Access(adminRole, args.token);
            return {class: 'admin'};
        },
    },
    ClientQuery: {
        client: async (_, { id }) => {
            return await Client.GetById(id);
        },
        ticket: async (_, { link }, context) => {
            // const userId = await Token.Validation(context.token);
            // const isHelper = await User.AccessAllow(helperRole, context.token);
            // const reqTicket = await Ticket.GetByLink(link);
            // const isOwner = reqTicket.clientId == userId;

            // if(!isHelper && !isOwner) throw new Error('Forbidden');

            return await Ticket.GetByLink(link);
        },
        ticketListByClient: async (_, args) => {
            return await Ticket.GetList(args.filters, args.clientId);
        },
        message: async (_, { id }) => {
            return await Message.GetById(id);
        },
        messageList: async (_, { ticketId }) => {
            return await Message.GetListByTicket(ticketId);
        },
        attachment: async (_, { id }) => {
            return await Attachment.GetById(id);
        },
        attachmentList: async (_, { messageId }) => {
            return await Attachment.GetListByMsg(messageId);
        },
        allThemeTree: async (_, args) => {
            return await Unit.GetList();
        },
    },
    HelperQuery: {
        user: async (_, { id }) => {
            return await User.GetById(id);
        },
        userList: async (_, args) => {
            return await User.GetList();
        },
        helper: async (_, { id }) => {
            return await Helper.GetById(id);
        },
        helperList: async (_, args) => {
            return await Helper.GetList();
        },
        helperStatList: async (_, args) => {
            return await Helper.GetStatsList(args.orderBy, args.orderDir, args.limit, args.offset);
        },
        clientList: async (_, args) => {
            return await Client.GetList();
        },
        ticketList: async (_, args) => {
            return await Ticket.GetList(args.filters);
        },
        subThemeList: async (_, args) => {
            return await SubTheme.GetList();
        },
        unit: async (_, { id }) => {
            return await Unit.GetById(id);
        },
        theme: async (_, { id }) => {
            return await Theme.GetById(id);
        },
        subTheme: async (_, { id }) => {
            return await SubTheme.GetById(id);
        },
        ticketStatusList: async (_, args) => {
            return await TicketStatus.GetList();
        },
    },
    AdminQuery: {
        departmentList: async (_, args) => {
            return await Department.GetList();
        },
        jobTitleList: async (_, args) => {
            return await HelperJobTitle.GetList();
        },
        countryList: async (_, args) => {
            return await Country.GetList();
        },
        translationList: async (_, args) => {
            return await Translation.GetList(args.lang);
        },
        translationListByType: async (_, args) => {
            return await Translation.GetListByType(args.lang, args.type);
        },
    },
    Mutation: {
        addClientUser: async (_, args) => {
            return await Client.TransInsert(args.userFields, args.clientFields);
        },
        addHelperUser: async (_, args) => {
            //await Access(adminRole, args.token);
            return await Helper.TransInsert(args.userFields, args.helperFields);
        },
        addTicket: async (_, args) => {
            return await Ticket.TransInsert(args);
        },
        addMessage: async (_, args) => {
            return await Message.TransInsert(args.fields);
        },
        addTicketStatus: async (_, args) => {
            //await Access(adminRole, args.token);
            return await TicketStatus.TransInsert(args.fields);
        },
        addCountry: async (_, args) => {
            //await Access(adminRole, args.token);
            return await Country.TransInsert(args.fields);
        },
        addJobTitle: async (_, args) => {
            //await Access(adminRole, args.token);
            return await HelperJobTitle.TransInsert(args.fields);
        },
        addSubTheme: async (_, args) => {
            //await Access(adminRole, args.token);
            return await SubTheme.TransInsert(args.fields);
        },
        addTheme: async (_, args) => {
            //await Access(adminRole, args.token);
            return await Theme.TransInsert(args.fields);
        },
        addUnit: async (_, args) => {
            //await Access(adminRole, args.token);
            return await Unit.TransInsert(args.fields);
        },
        addDepartment: async (_, args) => {
            //await Access(adminRole, args.token);
            return await Department.TransInsert(args.fields);
        },
        addTranslation: async (_, args) => {
            //await Access(adminRole, args.token);
            return await Translation.Insert(args.fields);
        },
        updateTicket: async (_, args) => {
            return await Ticket.TransUpdate(args.id, args.fields, args.departmentId);
        },
        updateClientUser: async (_, args) => {
            //await Access(clientRole, args.token);
            return await Client.TransUpdate(args.id, args.userFields, args.clientFields);
        },
        updateHelperUser: async (_, args) => {
            //await Access(helperRole, args.token);
            return await Helper.TransUpdate(args.id, args.userFields, args.helperFields);
        },
        updateSubTheme: async (_, args) => {
            //await Access(adminRole, args.token);
            return await SubTheme.TransUpdate(args.id, args.fields);
        },
        updateTheme: async (_, args) => {
            //await Access(adminRole, args.token);
            return await Theme.TransUpdate(args.id, args.fields);
        },
        updateUnit: async (_, args) => {
            //await Access(adminRole, args.token);
            return await Unit.TransUpdate(args.id, args.fields);
        },
        updateDepartment: async (_, args) => {
            //await Access(adminRole, args.token);
            return await Department.TransUpdate(args.id, args.fields);
        },
        updateCountry: async (_, args) => {
            //await Access(adminRole, args.token);
            return await Country.TransUpdate(args.id, args.fields);
        },
        updateTicketStatus: async (_, args) => {
            //await Access(adminRole, args.token);
            return await TicketStatus.TransUpdate(args.id, args.fields);
        },
        updateHelperJobTitle: async (_, args) => {
            //await Access(adminRole, args.token);
            return await HelperJobTitle.TransUpdate(args.id, args.fields);
        },
        updateTranslation: async (_, args) => {
            //await Access(adminRole, args.token);
            return await Translation.Update(args.fields);
        },
        updateMessage: async (_, args) => {
            //await Access(adminRole, args.token);
            return await Message.TransUpdate(args.id, args.fields);
        },
        deleteTicket: async (_, { id }) => {
            //await Access(adminRole, args.token);
            return await Ticket.DeleteCascade(id);
        },
        deleteUser: async (_, { id }) => {
            //await Access(adminRole, args.token);
            return await User.DeleteCascade(id);
        },
        deleteUnit: async (_, { id }) => {
            //await Access(adminRole, args.token);
            return await Unit.DeleteCascade(id);
        },
        deleteTheme: async (_, { id }) => {
            //await Access(adminRole, args.token);
            return await Theme.DeleteCascade(id);
        },
        deleteSubTheme: async (_, { id }) => {
            //await Access(adminRole, args.token);
            return await SubTheme.DeleteCascade(id);
        },
        deleteThemeDepartment: async (_, { id }) => {
            //await Access(adminRole, args.token);
            return await ThemeDepartment.DeleteCascade(id);
        },
        deleteDepartment: async (_, { id }) => {
            //await Access(adminRole, args.token);
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
            return await HelperJobTitle.GetById(parent.jobTitleId);
        },
        departments: async (parent, args) => {
            return await HelperDepartment.GetListByHelperId(parent.id);
        },
        stats: async (parent, args) => {
            return await Helper.GetStatsById(parent.id);
        },
    },
    HelperJobTitle: {
        name: async (parent, args) => {
            return await Translation.GetByCode(args.lang, parent.nameCode);
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
            return await Translation.GetByCode(args.lang, parent.nameCode);
        },
    },
    Theme: {
        unit: async (parent, args) => {
            return await Unit.GetById(parent.unitId);
        },
        name: async (parent, args) => {
            return await Translation.GetByCode(args.lang, parent.nameCode);
        },
        subThemes: async (parent, args) => {
            return await SubTheme.GetListByTheme(parent.id);
        },
    },
    Unit: {
        name: async (parent, args) => {
            return await Translation.GetByCode(args.lang, parent.nameCode);
        },
        themes: async (parent, args) => {
            return await Theme.GetListByUnit(parent.id);
        },
    },
    TicketStatus: {
        name: async (parent, args) => {
            return await Translation.GetByCode(args.lang, parent.nameCode);
        },
    },
    Department: {
        name: async (parent, args) => {
            return await Translation.GetByCode(args.lang, parent.nameCode);
        },
    },
    Country: {
        name: async (parent, args) => {
            return await Translation.GetByCode(args.lang, parent.nameCode);
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
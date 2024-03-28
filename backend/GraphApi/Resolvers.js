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
import TicketLog from '../Entities/TicketLog.js';
import CountryLangs from '../Entities/CountryLangs.js';
import Langs from '../Entities/Langs.js';
import HelperPermission from '../Entities/HelperPermission.js';
import Errors from '../Utils/Errors.js';

Entity.Pool = Pool;

async function Access(role, token){
    const access = await User.AccessAllow(role, token);
    if(!access.isAllowed) throw new Error(Errors.AccessForbidden);
    return access.user;
}

export const resolvers = {
    Query:{
        login: async (_, { login, password }) => {
            return await User.Login(login, password);
        },
        loginOuter: async (_, args) => {
            return await User.LoginOuter(args.sessionKey);
        },
        translationList: async (_, args) => {
            return await Translation.GetList(args.lang);
        },
        clientQuery: async (_, args, context) => {
            context.user = await Access(User.RoleClient, args.token);
            return {class: 'client'};
        },
        helperQuery: async (_, args, context) => {
            context.user = await Access(User.RoleHelper, args.token);
            return {class: 'helper'};
        },
        adminQuery: async (_, args, context) => {
            context.user = await Access(User.RoleAdmin, args.token);
            return {class: 'admin'};
        },
    },
    ClientQuery: {
        client: async (_, { id }) => {
            return await Client.GetById(id);
        },
        ticket: async (_, { link }, context) => {
            const isHelper = User.ValidateRoleAccess(User.RoleHelper, context.user.role);
            const reqTicket = await Ticket.GetByLink(link);
            const isOwner = reqTicket.initiatorId == context.user.id || reqTicket.recipientId == context.user.id;

            if(!isHelper && !isOwner) throw new Error(Errors.AccessForbidden);

            return await Ticket.GetByLink(link);
        },
        ticketListByClient: async (_, args) => {
            return await Ticket.GetList(args.filters, args.clientId);
        },
        message: async (_, { id }, context) => {
            return await Message.GetById(id, context.user);
        },
        messageList: async (_, { ticketId }, context) => {
            return await Message.GetListByTicket(ticketId, context.user);
        },
        attachment: async (_, { id }) => {
            return await Attachment.GetById(id);
        },
        attachmentList: async (_, { messageId }) => {
            return await Attachment.GetListByMsg(messageId);
        },
        allThemeTree: async (_, args, context) => {
            return await Unit.GetList(context.user);
        },
        countryList: async (_, args) => {
            return await Country.GetList();
        },
        langList: async (_, args) => {
            return await Langs.GetList();
        },
        translationListByType: async (_, args) => {
            return await Translation.GetListByType(args.lang, args.type);
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
            return await Helper.GetStatsList(args.filters);
        },
        clientList: async (_, args) => {
            return await Client.GetList();
        },
        ticketList: async (_, args) => {
            return await Ticket.GetList(args.filters);
        },
        subThemeList: async (_, args, context) => {
            return await SubTheme.GetList(context.user);
        },
        unit: async (_, { id }, context) => {
            return await Unit.GetById(id, context.user);
        },
        theme: async (_, { id }, context) => {
            return await Theme.GetById(id, context.user);
        },
        subTheme: async (_, { id }, context) => {
            return await SubTheme.GetById(id, context.user);
        },
        ticketStatusList: async (_, args) => {
            return await TicketStatus.GetList();
        },
        departmentList: async (_, args) => {
            return await Department.GetList();
        },
    },
    AdminQuery: {
        jobTitleList: async (_, args) => {
            return await HelperJobTitle.GetList();
        },
        translationListFull: async (_, args) => {
            return await Translation.GetListFull();
        },
    },
    Mutation: {
        clientMutation: async (_, args, context) => {
            context.user = await Access(User.RoleClient, args.token);
            return {class: 'client'};
        },
        helperMutation: async (_, args, context) => {
            context.user = await Access(User.RoleHelper, args.token);
            return {class: 'helper'};
        },
        adminMutation: async (_, args, context) => {
            context.user = await Access(User.RoleAdmin, args.token);
            return {class: 'admin'};
        },
    },
    ClientMutation: {
        addClientUser: async (_, args) => {
            return await Client.TransInsert(args.userFields, args.clientFields);
        },
        addTicket: async (_, args) => {
            return await Ticket.TransInsert(args);
        },
        addMessage: async (_, args) => {
            args.fields.type = Message.TypeDefault;
            return await Message.TransInsert(args.fields);
        },
        updateMessage: async (_, args) => {
            return await Message.TransUpdate(args.id, args.fields);
        },
        updateClientUser: async (_, args) => {
            return await Client.TransUpdate(args.id, args.userFields, args.clientFields);
        },
        updateTicketByClient: async (_, args, context) => {
            return await Ticket.TransUpdate(args.id, args.fields, undefined, context.user);
        },
    },
    HelperMutation: {
        addTicketMass: async (_, args) => {
            return await Ticket.TransInsertMass(args);
        },
        updateTicket: async (_, args, context) => {
            return await Ticket.TransUpdate(args.id, args.fields, args.departmentId, context.user);
        },
        splitTicket: async (_, args, context) => {
            return await Ticket.Split(args.id, args.argsList, context.user);
        },
        redirectTicketToMentor: async (_, args, context) => {
            return await Ticket.RedirectToMentor(args.id, args.mentorId, context.user);
        },
        helperObj: async (_, args, context) => {
            await HelperPermission.Validate(context.user.id, HelperPermission.HelperEditField);
            return {class: 'helperObj'};
        },
        themeObj: async (_, args, context) => {
            await HelperPermission.Validate(context.user.id, HelperPermission.ThemeEditField);
            return {class: 'themeObj'};
        },
        translationObj: async (_, args, context) => {
            await HelperPermission.Validate(context.user.id, HelperPermission.TranslationEditField);
            return {class: 'translationObj'};
        },
    },
    HelperObjMutation: {
        addHelperUser: async (_, args) => {
            return await Helper.TransInsert(args.userFields, args.helperFields);
        },
        updateHelperUser: async (_, args) => {
            return await Helper.TransUpdate(args.id, args.userFields, args.helperFields);
        },
    },
    ThemeObjMutation: {
        addSubTheme: async (_, args) => {
            return await SubTheme.TransInsert(args.fields);
        },
        addTheme: async (_, args) => {
            return await Theme.TransInsert(args.fields);
        },
        addUnit: async (_, args) => {
            return await Unit.TransInsert(args.fields);
        },
        updateSubTheme: async (_, args) => {
            return await SubTheme.TransUpdate(args.id, args.fields);
        },
        updateTheme: async (_, args) => {
            return await Theme.TransUpdate(args.id, args.fields);
        },
        updateUnit: async (_, args) => {
            return await Unit.TransUpdate(args.id, args.fields);
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
    },
    TranslationObjMutation: {
        addCountry: async (_, args) => {
            return await Country.TransInsert(args.fields);
        },
        addLang: async (_, args) => {
            return await Langs.TransInsert(args.fields);
        },
        addTranslation: async (_, args) => {
            return await Translation.Insert(args.fields);
        },
        updateCountry: async (_, args) => {
            return await Country.TransUpdate(args.id, args.fields);
        },
        updateLang: async (_, args) => {
            return await Langs.TransUpdate(args.id, args.fields);
        },
        updateTranslation: async (_, args) => {
            return await Translation.Update(args.fields);
        },
        deleteCountry: async (_, { id }) => {
            return await Country.DeleteCascade(id);
        },
        deleteLang: async (_, { id }) => {
            return await Langs.TransDelete(id);
        },
    },
    AdminMutation: {
        addTicketStatus: async (_, args) => {
            return await TicketStatus.TransInsert(args.fields);
        },
        addJobTitle: async (_, args) => {
            return await HelperJobTitle.TransInsert(args.fields);
        },
        addDepartment: async (_, args) => {
            return await Department.TransInsert(args.fields);
        },
        updateDepartment: async (_, args) => {
            return await Department.TransUpdate(args.id, args.fields);
        },
        updateTicketStatus: async (_, args) => {
            return await TicketStatus.TransUpdate(args.id, args.fields);
        },
        updateHelperJobTitle: async (_, args) => {
            return await HelperJobTitle.TransUpdate(args.id, args.fields);
        },
        deleteTicket: async (_, { id }) => {
            return await Ticket.DeleteCascade(id);
        },
        deleteUser: async (_, { id }) => {
            return await User.DeleteCascade(id);
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
        jobTitle: async (parent, args, context) => {
            if(!User.ValidateRoleAccess(User.RoleHelper, context.user.role)) throw new Error(Errors.AccessForbidden);
            return await HelperJobTitle.GetById(parent.jobTitleId);
        },
        departments: async (parent, args, context) => {
            if(!User.ValidateRoleAccess(User.RoleHelper, context.user.role)) throw new Error(Errors.AccessForbidden);
            return await HelperDepartment.GetListByHelperId(parent.id);
        },
        stats: async (parent, args, context) => {
            if(!User.ValidateRoleAccess(User.RoleHelper, context.user.role)) throw new Error(Errors.AccessForbidden);
            return await Helper.GetStatsById(parent.id);
        },
        permissions: async (parent, args, context) => {
            if(!User.ValidateRoleAccess(User.RoleHelper, context.user.role)) throw new Error(Errors.AccessForbidden);
            return await HelperPermission.GetById(parent.id);
        },
    },
    HelperJobTitle: {
        name: async (parent, args) => {
            return await Translation.GetByCode(args.lang, parent.nameCode);
        },
    },
    Ticket: {
        initiator: async (parent, args) => {
            return await User.GetById(parent.initiatorId);
        },
        recipient: async (parent, args) => {
            return await User.GetById(parent.recipientId);
        },
        assistant: async (parent, args, context) => {
            // if(!User.ValidateRoleAccess(User.RoleHelper, context.user.role)) throw new Error(Errors.AccessForbidden);
            return await User.GetById(parent.assistantId);
        },
        messages: async (parent, args, context) => {
            return await Message.GetListByTicket(parent.id, context.user);
        },
        lastMessage: async (parent, args) => {
            return await Ticket.GetLastMsg(parent.id);
        },
        msgStats: async (parent, args) => {
            return await Ticket.GetMsgStats(parent.id);
        },
        subTheme: async (parent, args, context) => {
            return await SubTheme.GetById(parent.subThemeId, context.user);
        },
        status: async (parent, args) => {
            return await TicketStatus.GetById(parent.statusId);
        },
        log: async (parent, args, context) => {
            if(!User.ValidateRoleAccess(User.RoleHelper, context.user.role)) throw new Error(Errors.AccessForbidden);
            return await TicketLog.GetListByTicket(parent.id);
        },
    },
    TicketLog: {
        initiator: async (parent, args) => {
            return await User.GetById(parent.initiatorId);
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
    },
    SubTheme: {
        theme: async (parent, args, context) => {
            return await Theme.GetById(parent.themeId, context.user);
        },
        departments: async (parent, args) => {
            return await ThemeDepartment.GetListBySubThemeId(parent.id);
        },
        name: async (parent, args) => {
            return await Translation.GetByCode(args.lang, parent.nameCode);
        },
    },
    Theme: {
        unit: async (parent, args, context) => {
            return await Unit.GetById(parent.unitId, context.user);
        },
        name: async (parent, args) => {
            return await Translation.GetByCode(args.lang, parent.nameCode);
        },
        subThemes: async (parent, args, context) => {
            return await SubTheme.GetListByTheme(parent.id, context.user);
        },
    },
    Unit: {
        name: async (parent, args) => {
            return await Translation.GetByCode(args.lang, parent.nameCode);
        },
        themes: async (parent, args, context) => {
            return await Theme.GetListByUnit(parent.id, context.user);
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
        langs: async (parent, args) => {
            return await CountryLangs.GetListByCountryId(parent.id);
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
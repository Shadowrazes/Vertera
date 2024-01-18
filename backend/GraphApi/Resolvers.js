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

Entity.Pool = Pool;
const clientRole = 'client';
const helperRole = 'helper';
const adminRole = 'system';

export const resolvers = {
    Query:{
        login: async (_, { login, password }) => {
            return await User.Login(login, password);
        },
        user: async (_, { id }) => {
            //if(!(await User.AccessAllow(clientRole, args.token))) throw new Error('Forbidden');
            return await User.GetById(id);
        },
        userList: async (_, args) => {
            if(!(await User.AccessAllow(helperRole, args.token))) throw new Error('Forbidden');
            return await User.GetList();
        },
        helper: async (_, { id }) => {
            //if(!(await User.AccessAllow(helperRole, args.token))) throw new Error('Forbidden');
            return await Helper.GetById(id);
        },
        helperList: async (_, args) => {
            //if(!(await User.AccessAllow(helperRole, args.token))) throw new Error('Forbidden');
            return await Helper.GetList();
        },
        helperStatList: async (_, args) => {
            //if(!(await User.AccessAllow(helperRole, args.token))) throw new Error('Forbidden');
            return await Helper.GetStatsList(args.orderBy, args.orderDir, args.limit, args.offset);
        },
        client: async (_, { id }) => {
            //if(!(await User.AccessAllow(clientRole, args.token))) throw new Error('Forbidden');
            return await Client.GetById(id);
        },
        clientList: async (_, args) => {
            //if(!(await User.AccessAllow(helperRole, args.token))) throw new Error('Forbidden');
            return await Client.GetList();
        },
        //если есть токен, валидируем, если нет, то проверяем клиента тикета, если аноним, то пускаем
        // если нет, то пошел нахуй
        ticket: async (_, { id }) => {
            return await Ticket.GetById(id);
        },
        ticketList: async (_, args) => {
            //if(!(await User.AccessAllow(helperRole, args.token))) throw new Error('Forbidden');
            return await Ticket.GetList(args.filters);
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
            //if(!(await User.AccessAllow(clientRole, args.token))) throw new Error('Forbidden');
            return await Attachment.GetById(id);
        },
        attachmentList: async (_, { messageId }) => {
            //if(!(await User.AccessAllow(helperRole, args.token))) throw new Error('Forbidden');
            return await Attachment.GetListByMsg(messageId);
        },
        subThemeList: async (_, args) => {
            return await SubTheme.GetList();
        },
        allThemeTree: async (_, args) => {
            return await Unit.GetList();
        },
        departmentList: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Department.GetList();
        },
        jobTitleList: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await HelperJobTitle.GetList();
        },
        countryList: async (_, args) => {
            return await Country.GetList();
        },
        ticketStatusList: async (_, args) => {
            //if(!(await User.AccessAllow(helperRole, args.token))) throw new Error('Forbidden');
            return await TicketStatus.GetList();
        },
        translationList: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Translation.GetList(args.lang);
        },
        translationListByType: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Translation.GetListByType(args.lang, args.type);
        },
    },
    Mutation: {
        addClientUser: async (_, args) => {
            return await Client.TransInsert(args.userFields, args.clientFields);
        },
        addHelperUser: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Helper.TransInsert(args.userFields, args.helperFields);
        },
        addTicket: async (_, args) => {
            return await Ticket.TransInsert(args);
        },
        addMessage: async (_, args) => {
            return await Message.TransInsert(args.fields);
        },
        addTicketStatus: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await TicketStatus.TransInsert(args.fields);
        },
        addCountry: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Country.TransInsert(args.fields);
        },
        addJobTitle: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await HelperJobTitle.TransInsert(args.fields);
        },
        addSubTheme: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await SubTheme.TransInsert(args.fields);
        },
        addTheme: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Theme.TransInsert(args.fields);
        },
        addUnit: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Unit.TransInsert(args.fields);
        },
        addDepartment: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Department.TransInsert(args.fields);
        },
        addTranslation: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Translation.Insert(args.fields);
        },
        updateTicket: async (_, args) => {
            return await Ticket.TransUpdate(args.id, args.fields, args.departmentId);
        },
        updateClientUser: async (_, args) => {
            //if(!(await User.AccessAllow(clientRole, args.token))) throw new Error('Forbidden');
            return await Client.TransUpdate(args.id, args.userFields, args.clientFields);
        },
        updateHelperUser: async (_, args) => {
            //if(!(await User.AccessAllow(helperRole, args.token))) throw new Error('Forbidden');
            return await Helper.TransUpdate(args.id, args.userFields, args.helperFields);
        },
        updateSubTheme: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await SubTheme.TransUpdate(args.id, args.fields);
        },
        updateTheme: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Theme.TransUpdate(args.id, args.fields);
        },
        updateUnit: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Unit.TransUpdate(args.id, args.fields);
        },
        updateDepartment: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Department.TransUpdate(args.id, args.fields);
        },
        updateCountry: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Country.TransUpdate(args.id, args.fields);
        },
        updateTicketStatus: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await TicketStatus.TransUpdate(args.id, args.fields);
        },
        updateHelperJobTitle: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await HelperJobTitle.TransUpdate(args.id, args.fields);
        },
        updateTranslation: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Translation.Update(args.fields);
        },
        updateMessage: async (_, args) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Message.TransUpdate(args.id, args.fields);
        },
        deleteTicket: async (_, { id }) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Ticket.DeleteCascade(id);
        },
        deleteUser: async (_, { id }) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await User.DeleteCascade(id);
        },
        deleteUnit: async (_, { id }) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Unit.DeleteCascade(id);
        },
        deleteTheme: async (_, { id }) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await Theme.DeleteCascade(id);
        },
        deleteSubTheme: async (_, { id }) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await SubTheme.DeleteCascade(id);
        },
        deleteThemeDepartment: async (_, { id }) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
            return await ThemeDepartment.DeleteCascade(id);
        },
        deleteDepartment: async (_, { id }) => {
            //if(!(await User.AccessAllow(adminRole, args.token))) throw new Error('Forbidden');
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
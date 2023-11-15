import Pool from '../DB/Connect.js';
import { GraphQLScalarType, Kind }  from 'graphql';

import Entity from "../Entities/Entity.js";
import UserEntity from "../Entities/User.js";
import HelperEntity from "../Entities/Helper.js";
import ClientEntity from "../Entities/Client.js";
import TicketEntity from "../Entities/Ticket.js";
import MessageEntity from "../Entities/Message.js";
import AttachmentEntity from "../Entities/Attachment.js";
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
            return await ClientEntity.GetById(id);
        },
        clientList: async (_, args) => {
            return await ClientEntity.GetList();
        },
        ticket: async (_, { id }) => {
            return await TicketEntity.GetById(id);
        },
        ticketList: async (_, args) => {
            return await TicketEntity.GetList(args.filters);
        },
        message: async (_, { id }) => {
            return await MessageEntity.GetById(id);
        },
        messageList: async (_, { ticketId }) => {
            return await MessageEntity.GetListByTicket(ticketId);
        },
    },
    Mutation: {
        addClientUser: async (_, args) => {
            return await ClientEntity.TransInsert(args.fields);
        },
        addHelperUser: async (_, args) => {
            return await HelperEntity.TransInsert(args.fields);
        },
        addTicket: async (_, args) => {
            return await TicketEntity.TransInsert(args);
        },
        addMessage: async (_, args) => {
            return await MessageEntity.TransInsert(args.fields);
        },
        updateTicket: async (_, args) => {
            return await TicketEntity.Update(args.id, args.fields);
        },
        updateClientUser: async (_, args) => {
            return await ClientEntity.TransUpdate(args.id, args.fields);
        },
        updateHelperUser: async (_, args) => {
            return await HelperEntity.TransUpdate(args.id, args.fields);
        },
        deleteTicket: async (_, { id }) => {
            return await TicketEntity.DeleteCascade(id);
        },
        deleteUser: async (_, { id }) => {
            return await UserEntity.DeleteCascade(id);
        },
    },
    User: {
        
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
    Attachment: {
        
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
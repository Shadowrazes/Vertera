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
            return await UserEntity.GetList();
        },
        ticket: async (_, { id }) => {
            return await TicketEntity.GetById(id);
        },
        ticketList: async (_, args) => {
            return await TicketEntity.GetList(args.filters);
        },
    },
    Mutation: {
        addClientUser: async (_, args) => {
            return await ClientEntity.Insert(args.fields);
        },
        addHelperUser: async (_, args) => {
            return await HelperEntity.Insert(args.fields);
        },
        addTicket: async (_, args) => {
            return await TicketEntity.Insert(args);
        },
        addMessage: async (_, args) => {
            return await MessageEntity.Insert(args.fields);
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
            return await TicketEntity.GetMessages(parent.id);
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
    },
    Attachment: {
        
    },
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'Дата и время в формате ISO 8601',
        serialize(value) {
          return value.toISOString(); // преобразуем дату в строку в формате ISO 8601
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
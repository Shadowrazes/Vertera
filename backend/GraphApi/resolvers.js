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
            return await UserEntity.Get(id);
        },
        userList: async (_, { id }) => {
            return await UserEntity.GetAll();
        },
        helper: async (_, { id }) => {
            return await HelperEntity.Get(id);
        },
        ticketList: async (_, args) => {
            return await TicketEntity.GetList(args.filters);
        },
    },
    Mutation: {
        addClientUser: async (_, { fullName, country, phone, email }) => {
            return await ClientEntity.Insert(fullName, country, phone, email);
        },
        addHelperUser: async (_, { fullName, country, login, password }) => {
            return await HelperEntity.Insert(fullName, country, login, password);
        },
    },
    User: {
        
    },
    Client: {

    },
    Helper: {
        user: async (parent, args) => {
            return await UserEntity.Get(parent.id);
        },
    },
    Ticket: {
        lastMessage: async (parent, args) => {
            return await TicketEntity.GetLastMsg(parent.id);
        },
        msgStats: async (parent, args) => {
            return await TicketEntity.GetMsgStats(parent.id);
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
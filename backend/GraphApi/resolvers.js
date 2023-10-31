import UserEntity from "../Entities/User.js";
import Pool from '../DB/Connect.js';

UserEntity.pool = Pool;

export const resolvers = {
    Query:{
        user: async (_, { id }) => {
            let res = await UserEntity.Get(id);
            return res[0];
        },
        helper: async (_, { id }) => {
            let res = await UserEntity.GetHelper(id);
            return res[0];
        },
    },
    Mutation: {
        
    },
    User: {
        
    },
    Client: {

    },
    Helper: {
        user: async (parent, args) => {
            let res = await UserEntity.Get(parent.id);
            return res[0];
        },
    },
    Ticket: {
        
    },
    Attachment: {
        
    },
}
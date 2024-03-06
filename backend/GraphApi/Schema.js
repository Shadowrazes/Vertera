import { ObjectTypes } from "./ObjectTypes.js";
import { InputsInsert } from "./InputsInsert.js";
import { InputsUpdate } from "./InputsUpdate.js";
import { InputsSpecific } from "./InputsSpecific.js";
import { Mutations } from "./Mutations.js";
import { Queries } from "./Queries.js";

export const typeDefs = `
    scalar DateTime

    type Query {
        login(login: String!, password: String!): LoginInfo!
        loginOuter(sessionKey: String!): LoginInfo!
        translationList(lang: String!): [Translation]

        clientQuery(token: String!): ClientQuery!
        helperQuery(token: String!): HelperQuery!
        adminQuery(token: String!): AdminQuery!
    }

    ${Queries}

    type Mutation {
        clientMutation(token: String!): ClientMutation!
        helperMutation(token: String!): HelperMutation!
        adminMutation(token: String!): AdminMutation!
    }

    ${Mutations}

    ${ObjectTypes}
    ${InputsInsert}
    ${InputsUpdate}
    ${InputsSpecific}
`;
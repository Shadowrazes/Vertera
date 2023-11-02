// tickets(unit: String, theme: String, subTheme: String, helperId: Int,
//     helperCountries: [String], clientCountries: [String], date: String,
//     reaction: String, words: [String], status: String, after: [String],
//     userId: [String], limit: Int, offset: Int, orderBy: String, orderDir: String
// ): [Ticket]

export const typeDefs = `
    scalar DateTime

    type Query {
        user(id: Int!): User
        userList: [User]
        client(id: Int!): Client
        clientList: [Client]
        helper(id: Int!): Helper
        helperList: [Helper]
        ticket(id: Int!): Ticket
        ticketList(filters: TicketFilter!): [Ticket]
        message(id: Int!): Message
        messageList: [Message]
        attachment(id: Int!): Attachment
        attachmentList: [Attachment]
    }

    type Mutation {
        addUser(id: String!, name: String!, role: String, country: String): Int!
    }

    type User {
        id: Int!
        name: String!
        role: String!
        country: String!
    }

    type Client {
        id: Int!
        phone: String!
        email: String!
        user: User!
    }

    type Helper {
        id: Int!
        login: String!
        password: String!
        user: User
    }

    type Ticket {
        id: Int!
        client: Client!
        helper: Helper!
        status: String!
        date: DateTime!
        unit: String!
        theme: String!
        subTheme: String
        reaction: String
    }

    input TicketFilter{
        unit: [String]
        theme: [String]
        subTheme: [String]
        helperId: [String]
        helperCountries: [String]
        clientCountries: [String]
        date: String
        reaction: String
        status: String
        orderBy: String!
        orderDir: String!
        limit: Int!
        offset: Int!
    }

    type Message {
        id: Int!
        sender: User!
        reciever: User!
        attachment: Attachment
        ticket: Ticket!
        type: String!
        read: Boolean!
        text: String!
        date: DateTime!
    }

    type Attachment {
        id: Int!
        path: String!
        name: String!
    }
`;
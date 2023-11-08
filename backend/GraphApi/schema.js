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
        addClientUser(fields: ClientInsert!): Int!
        addHelperUser(fields: HelperInsert!): Int!
        addTicket(ticketFields: TicketInsert!, messageFields: MessageInsert!): Int!
        addMessage(fields: MessageInsert!): Int!
    }

    type User {
        id: Int!
        fullName: String!
        role: String!
        country: String!
        phone: String!
    }

    type Client {
        id: Int!
        email: String!
        user: User!
    }

    type Helper {
        id: Int!
        login: String!
        password: String!
        department: String!
        jobTitle: String!
        birthday: DateTime!
        startWorkDate: DateTime!
        user: User!
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
        messages: [Message]
        lastMessage: Message!
        msgStats: TicketMsgStats!
    }

    type TicketMsgStats {
        total: Int!
        unread: Int!
    }

    type Message {
        id: Int!
        sender: User!
        reciever: User!
        attachment: Attachment
        ticket: Ticket!
        type: String!
        readed: Boolean!
        text: String!
        date: DateTime!
    }

    type Attachment {
        id: Int!
        path: String!
        name: String!
    }

    input TicketFilter {
        unit: [String]
        theme: [String]
        subTheme: [String]
        helperId: [String]
        helperCountries: [String]
        clientCountries: [String]
        date: String
        reaction: String
        status: [String]
        replyed: Boolean
        orderBy: String!
        orderDir: String!
        limit: Int!
        offset: Int!
    }

    input ClientInsert {
        fullName: String!
        country: String!
        phone: String!
        email: String!
    }

    input HelperInsert {
        fullName: String!
        phone: String!
        country: String!
        login: String!
        password: String!
        department: String!
        jobTitle: String!
        birthday: DateTime!
    }

    input TicketInsert {
        clientId: Int!
        unit: String!
        theme: String!
        subTheme: String
    }

    input MessageInsert {
        senderId: Int!
        recieverId: Int!
        ticketId: Int!
        type: String!
        text: String!
        attachPath: String
        attachName: String
    }
`;
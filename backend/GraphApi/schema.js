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
        messageList(ticketId: Int!): [Message]
        attachment(id: Int!): Attachment
        attachmentList(messageId: Int!): [Attachment]
    }

    type Mutation {
        addClientUser(fields: ClientInsert!): Int!
        addHelperUser(fields: HelperInsert!): Int!
        addTicket(ticketFields: TicketInsert!, messageFields: MessageInsert!): Int!
        addMessage(fields: MessageInsert!): Int!

        updateTicket(id: Int!, fields: TicketUpdate!): UpdateInfo!

        deleteTicket(id: Int): Int!
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
        attachs: [Attachment]
        ticket: Ticket!
        ticketId: Int!
        type: String!
        text: String!
        date: DateTime!
        readed: Boolean!
    }

    type Attachment {
        id: Int!
        path: String!
    }

    type UpdateInfo {
        affected: Int!
        changed: Int!
        warning: Int!
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

    input TicketUpdate {
        helperId: Int
        status: String
        unit: String
        theme: String
        subTheme: String
        reaction: String
    }
`;
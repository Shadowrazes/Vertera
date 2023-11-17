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

        subThemeList: [SubTheme]

        departmentList: [Department]
    }

    type Mutation {
        addClientUser(fields: ClientInsert!): Int!
        addHelperUser(fields: HelperInsert!): Int!
        addTicket(ticketFields: TicketInsert!, messageFields: MessageInsert!): Int!
        addMessage(fields: MessageInsert!): Int!

        updateTicket(id: Int!, fields: TicketUpdate!): UpdateInfo!
        updateClientUser(id: Int!, fields: ClientUpdate!): UpdateInfo!
        updateHelperUser(id: Int!, fields: HelperUpdate!): UpdateInfo!

        deleteTicket(id: Int): Int!
        deleteUser(id: Int) : Int!
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
        jobTitle: String!
        birthday: DateTime!
        departments: [Department]!
        startWorkDate: DateTime!
        user: User!
    }

    type Ticket {
        id: Int!
        client: Client!
        helper: Helper!
        status: String!
        date: DateTime!
        subTheme: SubTheme!
        reaction: String
        messages: [Message]
        lastMessage: Message!
        msgStats: TicketMsgStats!
    }

    type Unit {
        id: Int!
        name: String!
    }

    type Theme {
        id: Int!
        name: String!
        unit: Unit!
    }

    type SubTheme {
        id: Int!
        name: String!
        theme: Theme!
        departments: [Department]!
    }

    type Department {
        id: Int!
        name: String!
        individual: Boolean!
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
        unitId: [Int]
        themeId: [Int]
        subThemeId: [Int]
        helperId: [String]
        helperCountries: [String]
        clientCountries: [String]
        date: DateTime
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
        jobTitle: String!
        birthday: DateTime!
        departmentIds: [Int]!
    }

    input TicketInsert {
        clientId: Int!
        unitId: Int!
        themeId: Int!
        subThemeId: Int
    }

    input MessageInsert {
        senderId: Int!
        recieverId: Int!
        ticketId: Int!
        type: String!
        text: String!
        attachPaths: [String]
    }

    input TicketUpdate {
        helperId: Int
        status: String
        unit: Int
        theme: Int
        subTheme: Int
        reaction: String
    }

    input ClientUpdate {
        fullName: String
        country: String
        phone: String
        email: String
    }

    input HelperUpdate {
        fullName: String
        country: String
        phone: String
        password: String
        jobTitle: String
        birthday: DateTime
        departmentIds: [Int]
    }
`;
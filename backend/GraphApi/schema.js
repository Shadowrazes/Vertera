export const typeDefs = `
    scalar DateTime

    type Query {
        login(login: String!, password: String!): String!

        user(id: Int!): User
        userList(token: String!): [User]

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
        addClientUser(userFields: UserInsert!, clientFields: ClientInsert!): Int!
        addHelperUser(userFields: UserInsert!, helperFields: HelperInsert!): Int!
        addTicket(ticketFields: TicketInsert!, messageFields: MessageInsert!): Int!
        addMessage(fields: MessageInsert!): Int!

        updateTicket(id: Int!, fields: TicketUpdate!, departmentId: Int): UpdateInfo!
        updateClientUser(id: Int!, userFields: UserUpdate!, clientFields: ClientUpdate!): UpdateInfo!
        updateHelperUser(id: Int!, userFields: UserUpdate!, helperFields: HelperUpdate!): UpdateInfo!
        updateSubTheme(id: Int!, fields: SubThemeUpdate!): UpdateInfo!
        updateTheme(id: Int!, fields: ThemeUpdate!): UpdateInfo!
        updateUnit(id: Int!, fields: UnitUpdate!): UpdateInfo!
        updateThemeDepartment(id: Int!, fields: ThemeDepartmentsUpdate!): UpdateInfo!
        updateDepartment(id: Int!, fields: DepartmentUpdate!): UpdateInfo!

        deleteTicket(id: Int): Int!
        deleteUser(id: Int) : Int!
        deleteUnit(id: Int) : Int!
        deleteTheme(id: Int) : Int!
        deleteSubTheme(id: Int) : Int!
        deleteThemeDepartment(id: Int) : Int!
        deleteDepartment(id: Int) : Int!
    }

    type User {
        id: Int!
        fullName: String!
        role: String!
        country: String!
        phone: String
    }

    type Client {
        id: Int!
        email: String!
        user: User!
    }

    type Helper {
        id: Int!
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

    input UserInsert {
        fullName: String!
        country: String!
        login: String
        password: String
        phone: String
    }

    input ClientInsert {
        email: String!
    }

    input HelperInsert {
        jobTitle: String!
        birthday: DateTime!
        departmentIds: [Int]!
    }

    input TicketInsert {
        clientId: Int!
        unitId: Int!
        themeId: Int!
        subThemeId: Int!
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
        unitId: Int
        themeId: Int
        subThemeId: Int
        reaction: String
    }

    input UserUpdate {
        fullName: String
        country: String
        password: String
        phone: String
    }

    input ClientUpdate {
        email: String
    }

    input HelperUpdate {
        jobTitle: String
        birthday: DateTime
        departmentIds: [Int]
    }

    input SubThemeUpdate {
        themeId: Int
        name: String
    }

    input SubThemeUpdate {
        themeId: Int
        name: String
    }

    input ThemeUpdate {
        unitId: Int
        name: String
    }

    input UnitUpdate {
        name: String!
    }

    input ThemeDepartmentsUpdate {
        subThemeId: Int!
        departmentId: Int!
    }

    input DepartmentUpdate {
        name: String!
        individual: Boolean!
    }
`;
export const typeDefs = `
    scalar DateTime

    type Query {
        login(login: String!, password: String!): LoginInfo!

        user(id: Int!): User
        userList(token: String!): [User]

        client(id: Int!): Client
        clientList: [Client]

        helper(id: Int!): Helper
        helperList: [Helper]
        helperStatList(orderBy: String!, orderDir: String!, limit: Int!, offset: Int!): [HelperStatListItem]

        ticket(id: Int!): Ticket
        ticketList(filters: TicketFilter!): TicketList!
        ticketListByClient(clientId: Int!, filters: TicketClientFilter!): TicketList!

        message(id: Int!): Message
        messageList(ticketId: Int!): [Message]

        attachment(id: Int!): Attachment
        attachmentList(messageId: Int!): [Attachment]

        subThemeList: [SubTheme]
        allThemeTree: [Unit]

        departmentList: [Department]

        jobTitleList: [HelperJobTitle]

        countryList: [Country]

        ticketStatusList: [TicketStatus]

        translationList(lang: String!): [Translation]
        translationListByType(lang: String!, type: String!): [Translation]
    }

    type Mutation {
        addClientUser(userFields: UserInsert!, clientFields: ClientInsert!): Int!
        addHelperUser(userFields: UserInsert!, helperFields: HelperInsert!): Int!
        addTicket(ticketFields: TicketInsert!, messageFields: MessageInsert!): TicketInsertInfo!
        addMessage(fields: MessageInsert!): Int!

        addTranslation(fields: TranslationInsert!): String!
        addTicketStatus(fields: TicketStatusInsert!): String!
        addCountry(fields: CountryInsert!): String!
        addJobTitle(fields: HelperJobTitleInsert!): String!
        addSubTheme(fields: SubThemeInsert!): String!
        addTheme(fields: ThemeInsert!): String!
        addUnit(fields: UnitInsert!): String!
        addDepartment(fields: DepartmentInsert!): String!

        updateTicket(id: Int!, fields: TicketUpdate!, departmentId: Int): UpdateInfo!
        updateClientUser(id: Int!, userFields: UserUpdate!, clientFields: ClientUpdate!): UpdateInfo!
        updateHelperUser(id: Int!, userFields: UserUpdate!, helperFields: HelperUpdate!): UpdateInfo!
        updateMessage(id: Int!, fields: MessageUpdate!): UpdateInfo!

        updateTranslation(fields: TranslationUpdate!): UpdateInfo!
        updateSubTheme(id: Int!, fields: SubThemeUpdate!): UpdateInfo!
        updateTheme(id: Int!, fields: ThemeUpdate!): UpdateInfo!
        updateUnit(id: Int!, fields: UnitUpdate!): UpdateInfo!
        updateDepartment(id: Int!, fields: DepartmentUpdate!): UpdateInfo!
        updateCountry(id: Int!, fields: CountryUpdate!): UpdateInfo!
        updateTicketStatus(id: Int!, fields: TicketStatusUpdate!): UpdateInfo!
        updateHelperJobTitle(id: Int!, fields: HelperJobTitleUpdate!): UpdateInfo!

        deleteTicket(id: Int!): Int!
        deleteUser(id: Int!) : Int!
        deleteUnit(id: Int!) : Int!
        deleteTheme(id: Int!) : Int!
        deleteSubTheme(id: Int!) : Int!
        deleteThemeDepartment(id: Int!) : Int!
        deleteDepartment(id: Int!) : Int!
    }

    type LoginInfo {
        token: String!
        userId: Int!
    }

    type User {
        id: Int!
        name: String!
        surname: String!
        patronymic: String
        role: String!
        country: Country!
        phone: String
    }

    type Country {
        id: Int!
        name(lang: String!): Translation!
    }

    type Client {
        id: Int!
        email: String!
        user: User!
    }

    type Helper {
        id: Int!
        jobTitle: HelperJobTitle!
        birthday: DateTime!
        departments: [Department]!
        startWorkDate: DateTime!
        stats: HelperStats!
        user: User!
    }

    type HelperStats {
        totalTickets: Int!
        newTickets: Int!
        inProgressTickets: Int!
        closedTickets: Int!
        avgReplyTime: Float!
        likes: Int!
        dislikes: Int!
        notRated: Int!
        fantasy: Float!
    }

    type HelperStatListItem {
        helper: Helper!
        stats: HelperStats!
    }

    type HelperJobTitle {
        id: Int!
        name(lang: String!): Translation!
    }

    type Ticket {
        id: Int!
        client: Client!
        helper: Helper!
        status: TicketStatus!
        date: DateTime!
        subTheme: SubTheme!
        reaction: String
        messages: [Message]
        lastMessage: Message!
        msgStats: TicketMsgStats!
    }

    type TicketList {
        count: Int!
        array: [Ticket]!
    }

    type TicketStatus {
        id: Int!
        name(lang: String!): Translation!
    }

    type Translation {
        type: String!
        code: String!
        stroke: String
    }

    type Unit {
        id: Int!
        name(lang: String!): Translation!
        themes: [Theme]!
    }

    type Theme {
        id: Int!
        name(lang: String!): Translation!
        subThemes: [SubTheme]!
        unit: Unit!
    }

    type SubTheme {
        id: Int!
        name(lang: String!): Translation!
        theme: Theme!
        departments: [Department]!
    }

    type Department {
        id: Int!
        name(lang: String!): Translation!
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
        name: String!
    }

    type UpdateInfo {
        affected: Int!
        changed: Int!
        warning: Int!
    }

    type TicketInsertInfo {
        id: Int!
        clientId: Int!
        link: String!
    }

    input TicketFilter {
        unitIds: [Int]
        themeIds: [Int]
        subThemeIds: [Int]
        helperIds: [Int]
        helperCountryIds: [Int]
        clientCountryIds: [Int]
        dateAfter: DateTime
        dateBefore: DateTime
        reaction: String
        statusIds: [Int]
        replyed: Boolean
        orderBy: String!
        orderDir: String!
        limit: Int!
        offset: Int!
        lang: String!
    }

    input TicketClientFilter {
        unitIds: [Int]
        themeIds: [Int]
        subThemeIds: [Int]
        dateAfter: DateTime
        dateBefore: DateTime
        reaction: String
        orderBy: String!
        orderDir: String!
        limit: Int!
        offset: Int!
        lang: String!
    }

    input UserInsert {
        name: String!
        surname: String!
        patronymic: String
        countryId: Int!
        login: String
        password: String
        phone: String
    }

    input ClientInsert {
        email: String!
    }

    input HelperInsert {
        jobTitleId: Int!
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

    input SubThemeInsert {
        themeId: Int!
        stroke: String!
        lang: String!
        departmentIds: [Int]!
    }

    input ThemeInsert {
        unitId: Int!
        stroke: String!
        lang: String!
    }

    input UnitInsert {
        stroke: String!
        lang: String!
    }

    input DepartmentInsert {
        stroke: String!
        lang: String!
        individual: Boolean!
    }

    input TicketStatusInsert {
        lang: String!
        stroke: String!
    }

    input HelperJobTitleInsert {
        lang: String!
        stroke: String!
    }

    input CountryInsert {
        lang: String!
        stroke: String!
    }

    input TranslationInsert {
        type: String!
        lang: String!
        stroke: String!
    }

    input TicketUpdate {
        helperId: Int
        statusId: Int
        unitId: Int
        themeId: Int
        subThemeId: Int
        reaction: String
    }

    input MessageUpdate {
        readed: Boolean
    }

    input UserUpdate {
        name: String
        surname: String
        patronymic: String
        countryId: Int
        password: String
        phone: String
    }

    input ClientUpdate {
        email: String
    }

    input HelperUpdate {
        jobTitleId: Int
        birthday: DateTime
        departmentIds: [Int]
    }

    input TranslationUpdate {
        code: String!
        lang: String!
        stroke: String!
    }

    input CountryUpdate {
        stroke: String!
        lang: String!
    }

    input TicketStatusUpdate {
        stroke: String!
        lang: String!
    }

    input HelperJobTitleUpdate {
        stroke: String!
        lang: String!
    }

    input SubThemeUpdate {
        themeId: Int
        stroke: String
        departmentIds: [Int]
        lang: String!
    }

    input ThemeUpdate {
        unitId: Int
        stroke: String
        lang: String!
    }

    input UnitUpdate {
        stroke: String!
        lang: String!
    }

    input DepartmentUpdate {
        stroke: String!
        lang: String!
        individual: Boolean!
    }
`;
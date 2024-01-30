export const InputsSpecific = `
    input TicketFilter {
        unitIds: [Int]
        themeIds: [Int]
        subThemeIds: [Int]
        helperIds: [Int]
        helperCountryIds: [Int]
        clientCountryIds: [Int]
        dateAfter: DateTime
        dateBefore: DateTime
        reaction: Int
        words: String
        outerId: Int
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
        reaction: Int
        orderBy: String!
        orderDir: String!
        limit: Int!
        offset: Int!
        lang: String!
    }

    input HelperStatsFilter {
        orderBy: String!
        orderDir: String!
        limit: Int!
        offset: Int!
        dateAfter: DateTime
        dateBefore: DateTime
    }

    input TicketSplitArgItem {
        ticketFields: TicketInsert!
        messageFields: MessageInsert!
    }
`;
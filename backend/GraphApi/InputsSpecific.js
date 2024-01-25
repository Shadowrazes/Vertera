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
`;
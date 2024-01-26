export const InputsInsert = `
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
        outerId: Int!
        email: String!
    }

    input HelperInsert {
        jobTitleId: Int!
        birthday: DateTime!
        departmentIds: [Int]!
    }

    input TicketInsert {
        title: String!
        clientId: Int!
        unitId: Int!
        themeId: Int!
        subThemeId: Int!
    }

    input MessageInsert {
        senderId: Int!
        recieverId: Int!
        ticketId: Int!
        text: String!
        attachPaths: [String]
    }

    input SubThemeInsert {
        themeId: Int!
        orderNum: Int!
        stroke: String!
        lang: String!
        departmentIds: [Int]!
    }

    input ThemeInsert {
        unitId: Int!
        orderNum: Int!
        stroke: String!
        lang: String!
    }

    input UnitInsert {
        orderNum: Int!
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
`;
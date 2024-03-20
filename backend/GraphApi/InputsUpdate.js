export const InputsUpdate = `
    input TicketUpdate {
        helperId: Int
        assistantId: Int
        statusId: Int
        unitId: Int
        themeId: Int
        subThemeId: Int
        reaction: Int
    }

    input TicketClientUpdate {
        reaction: Int
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
        isActive: Boolean
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
        lang: String!
        code: String
        stroke: String
        langIds: [Int]
    }

    input LangUpdate {
        name: String
        code: String
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
        orderNum: Int
        stroke: String
        departmentIds: [Int]
        lang: String!
    }

    input ThemeUpdate {
        unitId: Int
        orderNum: Int
        stroke: String
        lang: String!
    }

    input UnitUpdate {
        orderNum: Int
        stroke: String
        lang: String!
    }

    input DepartmentUpdate {
        stroke: String!
        lang: String!
        individual: Boolean!
    }
`;
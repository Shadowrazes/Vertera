export const Mutations = `
    type ClientMutation {
        class: String!

        addClientUser(userFields: UserInsert!, clientFields: ClientInsert!): Int!
        addTicket(ticketFields: TicketInsert!, messageFields: MessageInsert!): TicketInsertInfo!
        addMessage(fields: MessageInsert!): Int!

        updateClientUser(id: Int!, userFields: UserUpdate!, clientFields: ClientUpdate!): UpdateInfo!
        updateMessage(id: Int!, fields: MessageUpdate!): UpdateInfo!
        updateTicketByClient(id: Int!, fields: TicketClientUpdate!): UpdateInfo!
    }

    type HelperMutation {
        class: String!
        
        updateTicket(id: Int!, fields: TicketUpdate!, departmentId: Int): UpdateInfo!
        splitTicket(id: Int!, argsList: [TicketSplitArgItem!]!): Int!
    }

    type AdminMutation {
        class: String!

        addHelperUser(userFields: UserInsert!, helperFields: HelperInsert!): Int!
        addTranslation(fields: TranslationInsert!): String!
        addTicketStatus(fields: TicketStatusInsert!): String!
        addCountry(fields: CountryInsert!): String!
        addJobTitle(fields: HelperJobTitleInsert!): String!
        addSubTheme(fields: SubThemeInsert!): String!
        addTheme(fields: ThemeInsert!): String!
        addUnit(fields: UnitInsert!): String!
        addDepartment(fields: DepartmentInsert!): String!

        updateHelperUser(id: Int!, userFields: UserUpdate!, helperFields: HelperUpdate!): UpdateInfo!
        updateTranslation(fields: [TranslationUpdate!]!): UpdateInfo!
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
`;
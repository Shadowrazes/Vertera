export const Mutations = `
    type ClientMutation {
        class: String!

        addClientUser(userFields: UserInsert!, clientFields: ClientInsert!): Int!
        addTicket(ticketFields: TicketInsert!, messageFields: MessageInsert!, notification: Boolean!): TicketInsertInfo!
        addMessage(fields: MessageInsert!): Int!

        updateClientUser(id: Int!, userFields: UserUpdate!, clientFields: ClientUpdate!): UpdateInfo!
        updateMessage(id: Int!, fields: MessageUpdate!): UpdateInfo!
        updateTicketByClient(id: Int!, fields: TicketClientUpdate!): UpdateInfo!
    }

    type HelperMutation {
        class: String!
        
        updateTicket(id: Int!, fields: TicketUpdate!, departmentId: Int): UpdateInfo!
        splitTicket(id: Int!, argsList: [TicketSplitArgItem!]!): Int!

        addTicketMass(ticketFields: TicketInsert!, messageFields: MessageInsert!, notification: Boolean!, idsOuter: Boolean!, ids: [Int]!): [TicketInsertInfo]!
                      
        addHelperUser(userFields: UserInsert!, helperFields: HelperInsert!): Int!
        updateHelperUser(id: Int!, userFields: UserUpdate!, helperFields: HelperUpdate!): UpdateInfo!

        addSubTheme(fields: SubThemeInsert!): String!
        addTheme(fields: ThemeInsert!): String!
        addUnit(fields: UnitInsert!): String!
        updateSubTheme(id: Int!, fields: SubThemeUpdate!): UpdateInfo!
        updateTheme(id: Int!, fields: ThemeUpdate!): UpdateInfo!
        updateUnit(id: Int!, fields: UnitUpdate!): UpdateInfo!
        deleteUnit(id: Int!) : Int!
        deleteTheme(id: Int!) : Int!
        deleteSubTheme(id: Int!) : Int!

        addCountry(fields: CountryInsert!): String!
        addLang(fields: LangInsert!): String!
        addTranslation(fields: TranslationInsert!): String!
        updateCountry(id: Int!, fields: CountryUpdate!): UpdateInfo!
        updateLang(id: Int!, fields: LangUpdate!): UpdateInfo!
        updateTranslation(fields: [TranslationUpdate!]!): UpdateInfo!
        deleteCountry(id: Int!) : Int!
        deleteLang(id: Int!) : Int!
    }

    type AdminMutation {
        class: String!

        addHelperUser(userFields: UserInsert!, helperFields: HelperInsert!): Int!
        addTicketStatus(fields: TicketStatusInsert!): String!
        addJobTitle(fields: HelperJobTitleInsert!): String!
        addDepartment(fields: DepartmentInsert!): String!

        updateDepartment(id: Int!, fields: DepartmentUpdate!): UpdateInfo!
        updateTicketStatus(id: Int!, fields: TicketStatusUpdate!): UpdateInfo!
        updateHelperJobTitle(id: Int!, fields: HelperJobTitleUpdate!): UpdateInfo!

        deleteTicket(id: Int!): Int!
        deleteUser(id: Int!) : Int!
        deleteThemeDepartment(id: Int!) : Int!
        deleteDepartment(id: Int!) : Int!
    }
`;
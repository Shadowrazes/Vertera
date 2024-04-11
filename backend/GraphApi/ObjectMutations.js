export const ObjectMutations = `
    type HelperObjMutation {
        class: String!
                      
        addHelperUser(userFields: UserInsert!, helperFields: HelperInsert!): Int!
        updateHelperUser(id: Int!, userFields: UserUpdate!, helperFields: HelperUpdate!): UpdateInfo!
    }

    type ThemeObjMutation {
        class: String!

        addSubTheme(fields: SubThemeInsert!): String!
        addTheme(fields: ThemeInsert!): String!
        addUnit(fields: UnitInsert!): String!
        updateSubTheme(id: Int!, fields: SubThemeUpdate!): UpdateInfo!
        updateTheme(id: Int!, fields: ThemeUpdate!): UpdateInfo!
        updateUnit(id: Int!, fields: UnitUpdate!): UpdateInfo!

        updateThemeOrders(type: String!, fields: [ThemeOrderUpdateItem]!): [Int]!
    }

    type TranslationObjMutation {
        class: String!

        addCountry(fields: CountryInsert!): String!
        addLang(fields: LangInsert!): String!
        addTranslation(fields: TranslationInsert!): String!
        updateCountry(id: Int!, fields: CountryUpdate!): Int!
        updateLang(id: Int!, fields: LangUpdate!): UpdateInfo!
        updateTranslation(fields: [TranslationUpdate!]!): UpdateInfo!
    }
`;
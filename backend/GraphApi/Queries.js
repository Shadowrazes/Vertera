export const Queries = `
    type ClientQuery {
        class: String!

        client(id: Int!): Client

        ticket(link: String!): Ticket
        ticketListByClient(clientId: Int!, filters: TicketClientFilter!): TicketList!

        message(id: Int!): Message
        messageList(ticketId: Int!): [Message]

        attachment(id: Int!): Attachment
        attachmentList(messageId: Int!): [Attachment]

        allThemeTree: [Unit]

        country(id: Int!): Country
        countryList: [Country]
        langList: [Lang]

        translationListByType(lang: String!, type: String!): [Translation]
    }

    type HelperQuery {
        class: String!

        user(id: Int!): User
        userList(token: String!): [User]

        helperPerms(id: Int!): HelperPermissions!

        clientList: [Client]

        ticketList(filters: TicketFilter!): TicketList!

        helper(id: Int!): Helper
        helperList: [Helper]
        helperStatList(filters: HelperStatsFilter!): [HelperStatListItem]

        subThemeList: [SubTheme]

        unit(id: Int!): Unit
        theme(id: Int!): Theme
        subTheme(id: Int!): SubTheme

        ticketStatusList: [TicketStatus]
        
        departmentList: [Department]

        jobTitleList: [HelperJobTitle]

        translationListFull: [TranslationFull]
    }

    type AdminQuery {
        class: String!
    }
`;
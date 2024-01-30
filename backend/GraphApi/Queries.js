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
        
        countryList: [Country]
    }

    type HelperQuery {
        class: String!

        user(id: Int!): User
        userList(token: String!): [User]

        clientList: [Client]

        ticketList(filters: TicketFilter!): TicketList!

        helper(id: Int!): Helper
        helperList: [Helper]
        helperStatList(orderBy: String!, orderDir: String!, limit: Int!, offset: Int!): [HelperStatListItem]

        subThemeList: [SubTheme]

        unit(id: Int!): Unit
        theme(id: Int!): Theme
        subTheme(id: Int!): SubTheme

        ticketStatusList: [TicketStatus]
        
        departmentList: [Department]
    }

    type AdminQuery {
        class: String!

        jobTitleList: [HelperJobTitle]

        translationList(lang: String!): [Translation]
        translationListByType(lang: String!, type: String!): [Translation]
    }
`;
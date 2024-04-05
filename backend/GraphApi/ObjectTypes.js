export const ObjectTypes = `
    type User {
        id: Int!
        name: String!
        surname: String!
        patronymic: String
        role: String!
        country: Country!
        isActive: Boolean!
        outerId: Int
        email: String
        phone: String
    }

    type Country {
        id: Int!
        code: String!
        name(lang: String!): Translation!
        langs: [Lang]!
    }

    type Lang{
        id: Int!
        name: String!
        code: String!
    }

    type Client {
        id: Int!
        idRef: Int!
        user: User!
    }

    type Helper {
        id: Int!
        jobTitle: HelperJobTitle!
        birthday: DateTime!
        departments: [Department]!
        startWorkDate: DateTime!
        stats: HelperStats!
        permissions: HelperPermissions!
        user: User!
    }

    type HelperPermissions {
        sendMsg: Boolean!
        helperEdit: Boolean!
        themeEdit: Boolean!
        translationEdit: Boolean!
    }

    type HelperStats {
        totalTickets: Int!
        newTickets: Int!
        inProgressTickets: Int!
        onRevisionTickets: Int!
        onExtensionTickets: Int!
        onMentorTickets: Int!
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
        initiator: User!
        recipient: User!
        assistant: User
        status: TicketStatus!
        date: DateTime!
        title: String!
        subTheme: SubTheme!
        reaction: Int
        messages: [Message]
        lastMessage: Message!
        msgStats: TicketMsgStats!
        link: String!
        log: [TicketLog]
    }

    type TicketLog {
        date: DateTime!
        type: String!
        initiator: User!
        info: String!
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

    type TranslationFull{
        id: Int!
        type: String!
        code: String!
        translations: [TranslationFullItem]!
    }

    type TranslationFullItem {
        lang: String!
        stroke: String
    }

    type Unit {
        id: Int!
        name(lang: String!): Translation!
        themes: [Theme]!
        visibility: Int!
        orderNum: Int!
    }

    type Theme {
        id: Int!
        name(lang: String!): Translation!
        subThemes: [SubTheme]!
        unit: Unit!
        visibility: Int!
        orderNum: Int!
    }

    type SubTheme {
        id: Int!
        name(lang: String!): Translation!
        theme: Theme!
        orderNum: Int!
        visibility: Int!
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
        type: String!
        text: String!
        date: DateTime!
        readed: Boolean!
        visibility: Int!
        isActive: Int!
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
        initiatorId: Int!
        link: String!
    }

    type LoginInfo {
        token: String!
        user: User!
    }
`;
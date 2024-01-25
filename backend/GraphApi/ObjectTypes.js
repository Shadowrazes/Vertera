export const ObjectTypes = `
    type LoginInfo {
        token: String!
        userId: Int!
    }

    type User {
        id: Int!
        name: String!
        surname: String!
        patronymic: String
        role: String!
        country: Country!
        isActive: Boolean!
        phone: String
    }

    type Country {
        id: Int!
        name(lang: String!): Translation!
    }

    type Client {
        id: Int!
        email: String!
        user: User!
    }

    type Helper {
        id: Int!
        jobTitle: HelperJobTitle!
        birthday: DateTime!
        departments: [Department]!
        startWorkDate: DateTime!
        stats: HelperStats!
        user: User!
    }

    type HelperStats {
        totalTickets: Int!
        newTickets: Int!
        inProgressTickets: Int!
        onCorrectionTickets: Int!
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
        client: Client!
        helper: Helper!
        status: TicketStatus!
        date: DateTime!
        subTheme: SubTheme!
        reaction: String
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

    type Unit {
        id: Int!
        name(lang: String!): Translation!
        themes: [Theme]!
        orderNum: Int!
    }

    type Theme {
        id: Int!
        name(lang: String!): Translation!
        subThemes: [SubTheme]!
        unit: Unit!
        orderNum: Int!
    }

    type SubTheme {
        id: Int!
        name(lang: String!): Translation!
        theme: Theme!
        orderNum: Int!
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
        ticket: Ticket!
        ticketId: Int!
        type: String!
        text: String!
        date: DateTime!
        readed: Boolean!
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
        clientId: Int!
        link: String!
    }
`;
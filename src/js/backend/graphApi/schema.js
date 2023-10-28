export const typeDefs = gql`
    type Query {
        user(id: Int!): User
        users: [User]
        client(id: Int!): Client
        clients: [Client]
        helper(id: Int!): Helper
        helpers: [Helper]
        ticket(id: Int!): Ticket
        tickets: [Ticket]
        message(id: Int!): Message
        messages: [Message]
        attachment(id: Int!): Attachment
        attachments: [Attachment]
    }

    type Mutation {

    }

    type User {
        id: Int!
        name: String!
        role: String!
        country: String!
    }

    type Client {
        id: Int!
        phone: String!
        email: String!
        user: User!
    }

    type Helper {
        id: Int!
        login: String!
        password: String!
        user: User!
    }

    type Ticket {
        id: Int!
        client: Client!
        helper: Helper!
        date: String!
        section: String!
        theme: String
        score: String
    }

    type Message {
        id: Int!
        sender: User!
        reciever: User!
        attachment: Attachment
        ticket: Ticket!
        type: String!
        read: Boolean!
        text: String!
        date: String!
    }

    type Attachment {
        id: Int!
        path: String!
        name: String!
    }
`;
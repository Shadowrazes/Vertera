import { gql } from "@apollo/client";

export const ADD_STATUS = gql`
  mutation addStatus {
    addTicketStatus(fields: { lang: "ru", stroke: "В ожидании" })
  }
`;

// export const ADD_TICKET = gql`
//   mutation addTicket {
//     addTicket(
//       ticketFields: { clientId: 1, unitId: 1, themeId: 6, subThemeId: 55 }
//       messageFields: {
//         senderId: 1
//         recieverId: 2
//         ticketId: 1
//         type: "common"
//         text: "test"
//         attachPaths: ["test/a", "test/321"]
//       }
//     )
//   }
// `;

export const ADD_TICKET = gql`
  mutation addTicket(
    $clientId: Int!
    $unitId: Int!
    $themeId: Int!
    $subThemeId: Int!
    $senderId: Int!
    $recieverId: Int!
    $ticketId: Int!
    $type: String!
    $text: String!
    $attachPaths: [String]
  ) {
    addTicket(
      ticketFields: {
        clientId: $clientId
        unitId: $unitId
        themeId: $themeId
        subThemeId: $subThemeId
      }
      messageFields: {
        senderId: $senderId
        recieverId: $recieverId
        ticketId: $ticketId
        type: $type
        text: $text
        attachPaths: $attachPaths
      }
    )
  }
`;

export const ADD_MESSAGE = gql`
  mutation ($fields: MessageInsert!) {
    addMessage(fields: $fields)
  }
`;

export const UPDATE_STATUS = gql`
  mutation ($id: Int!, $fields: TicketUpdate!) {
    updateTicket(id: $id, fields: $fields) {
      changed
    }
  }
`;

import { gql } from "@apollo/client";

export const ADD_STATUS = gql`
  mutation addStatus {
    addTicketStatus(fields: { lang: "ru", stroke: "В ожидании" })
  }
`;

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
    ) {
      id
      clientId
      link
    }
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

export const ADD_CLIENT_USER = gql`
  mutation (
    $fullName: String!
    $login: String
    $password: String
    $phone: String
    $email: String!
  ) {
    addClientUser(
      userFields: {
        fullName: $fullName
        countryId: 1
        login: $login
        password: $password
        phone: $phone
      }
      clientFields: { email: $email }
    )
  }
`;

export const ADD_HELPER = gql`
  mutation (
    $fullName: String!
    $phone: String
    $login: String
    $password: String
    $jobTitleId: Int!
    $birthday: DateTime!
    $departmentId: [Int]!
  ) {
    addHelperUser(
      userFields: {
        fullName: $fullName
        phone: $phone
        login: $login
        password: $password
        countryId: 1
      }
      helperFields: {
        jobTitleId: $jobTitleId
        birthday: $birthday
        departmentIds: $departmentId
      }
    )
  }
`;

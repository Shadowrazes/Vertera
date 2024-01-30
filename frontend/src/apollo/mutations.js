import { gql } from "@apollo/client";

export const ADD_STATUS = gql`
  mutation addStatus {
    addTicketStatus(fields: { lang: "ru", stroke: "В ожидании" })
  }
`;

export const ADD_TICKET = gql`
  mutation addTicket(
    $token: String!
    $title: String!
    $clientId: Int!
    $unitId: Int!
    $themeId: Int!
    $subThemeId: Int!
    $senderId: Int!
    $recieverId: Int!
    $ticketId: Int!
    $text: String!
    $attachPaths: [String]
  ) {
    clientMutation(token: $token) {
      addTicket(
        ticketFields: {
          title: $title
          clientId: $clientId
          unitId: $unitId
          themeId: $themeId
          subThemeId: $subThemeId
        }
        messageFields: {
          senderId: $senderId
          recieverId: $recieverId
          ticketId: $ticketId
          text: $text
          attachPaths: $attachPaths
        }
      ) {
        id
        clientId
        link
      }
    }
  }
`;

export const ADD_MESSAGE = gql`
  mutation (
    $senderId: Int!
    $recieverId: Int!
    $ticketId: Int!
    $type: String!
    $text: String!
    $attachPaths: [String]
  ) {
    addMessage(
      fields: {
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

export const UPDATE_STATUS = gql`
  mutation ($id: Int!, $fields: TicketUpdate!) {
    updateTicket(id: $id, fields: $fields) {
      changed
    }
  }
`;

export const ADD_CLIENT_USER = gql`
  mutation (
    $name: String!
    $surname: String!
    $patronymic: String
    $login: String
    $password: String
    $phone: String
    $email: String!
  ) {
    addClientUser(
      userFields: {
        name: $name
        surname: $surname
        patronymic: $patronymic
        countryId: 1
        login: $login
        password: $password
        phone: $phone
      }
      clientFields: { email: $email }
    )
  }
`;

export const ADD_HELPER_USER = gql`
  mutation (
    $name: String!
    $surname: String!
    $patronymic: String
    $phone: String
    $login: String
    $password: String
    $jobTitleId: Int!
    $birthday: DateTime!
    $departmentId: [Int]!
  ) {
    addHelperUser(
      userFields: {
        name: $name
        surname: $surname
        patronymic: $patronymic
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

export const EDIT_HELPER_USER = gql`
  mutation (
    $id: Int!
    $name: String!
    $surname: String!
    $patronymic: String
    $birthday: DateTime!
    $countryId: Int!
    $departmentId: [Int]!
    $jobTitleId: Int!
  ) {
    updateHelperUser(
      id: $id
      userFields: {
        name: $name
        surname: $surname
        patronymic: $patronymic
        countryId: $countryId
      }
      helperFields: {
        jobTitleId: $jobTitleId
        birthday: $birthday
        departmentIds: $departmentId
      }
    ) {
      changed
    }
  }
`;

export const DELETE_USER = gql`
  mutation ($id: Int!) {
    deleteUser(id: $id)
  }
`;

export const ADD_UNIT = gql`
  mutation ($stroke: String!, $lang: String!, $orderNum: Int!) {
    addUnit(fields: { stroke: $stroke, lang: $lang, orderNum: $orderNum })
  }
`;

export const EDIT_UNIT = gql`
  mutation ($id: Int!, $stroke: String!, $lang: String!, $orderNum: Int) {
    updateUnit(
      id: $id
      fields: { stroke: $stroke, lang: $lang, orderNum: $orderNum }
    ) {
      changed
    }
  }
`;

export const DELETE_UNIT = gql`
  mutation ($id: Int!) {
    deleteUnit(id: $id)
  }
`;

export const ADD_THEME = gql`
  mutation ($unitId: Int!, $stroke: String!, $lang: String!, $orderNum: Int!) {
    addTheme(
      fields: {
        unitId: $unitId
        stroke: $stroke
        lang: $lang
        orderNum: $orderNum
      }
    )
  }
`;

export const EDIT_THEME = gql`
  mutation (
    $id: Int!
    $unitId: Int
    $stroke: String
    $lang: String!
    $orderNum: Int
  ) {
    updateTheme(
      id: $id
      fields: {
        unitId: $unitId
        stroke: $stroke
        lang: $lang
        orderNum: $orderNum
      }
    ) {
      changed
    }
  }
`;

export const DELETE_THEME = gql`
  mutation ($id: Int!) {
    deleteTheme(id: $id)
  }
`;

export const ADD_SUBTHEME = gql`
  mutation (
    $themeId: Int!
    $stroke: String!
    $lang: String!
    $departmentIds: [Int]!
    $orderNum: Int!
  ) {
    addSubTheme(
      fields: {
        themeId: $themeId
        stroke: $stroke
        lang: $lang
        departmentIds: $departmentIds
        orderNum: $orderNum
      }
    )
  }
`;

export const EDIT_SUBTHEME = gql`
  mutation (
    $id: Int!
    $themeId: Int
    $stroke: String
    $lang: String!
    $departmentIds: [Int]
    $orderNum: Int
  ) {
    updateSubTheme(
      id: $id
      fields: {
        themeId: $themeId
        stroke: $stroke
        lang: $lang
        departmentIds: $departmentIds
        orderNum: $orderNum
      }
    ) {
      changed
    }
  }
`;

export const DELETE_SUBTHEME = gql`
  mutation ($id: Int!) {
    deleteSubTheme(id: $id)
  }
`;

export const EDIT_TICKET = gql`
  mutation (
    $id: Int!
    $helperId: Int
    $unitId: Int
    $themeId: Int
    $subThtmeId: Int
    $departmentId: Int
  ) {
    updateTicket(
      id: $id
      fields: {
        helperId: $helperId
        unitId: $unitId
        themeId: $themeId
        subThemeId: $subThtmeId
      }
      departmentId: $departmentId
    ) {
      changed
    }
  }
`;

import { gql } from "@apollo/client";

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
    $token: String!
    $senderId: Int!
    $recieverId: Int!
    $ticketId: Int!
    $text: String!
    $attachPaths: [String]
  ) {
    clientMutation(token: $token) {
      addMessage(
        fields: {
          senderId: $senderId
          recieverId: $recieverId
          ticketId: $ticketId
          text: $text
          attachPaths: $attachPaths
        }
      )
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation ($token: String!, $id: Int!, $fields: TicketUpdate!) {
    helperMutation(token: $token) {
      updateTicket(id: $id, fields: $fields) {
        changed
      }
    }
  }
`;

export const UPDATE_STATUS = gql`
  mutation ($token: String!, $id: Int!, $reaction: Int) {
    clientMutation(token: $token) {
      updateTicketByClient(id: $id, fields: { reaction: $reaction }) {
        changed
      }
    }
  }
`;

export const ADD_CLIENT_USER = gql`
  mutation (
    $token: String!
    $name: String!
    $surname: String!
    $patronymic: String
    $login: String
    $password: String
    $phone: String
    $email: String!
  ) {
    clientMutation(token: $token) {
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
  }
`;

export const ADD_HELPER_USER = gql`
  mutation (
    $token: String!
    $name: String!
    $surname: String!
    $patronymic: String
    $phone: String
    $countryId: Int!
    $login: String
    $password: String
    $jobTitleId: Int!
    $birthday: DateTime!
    $departmentId: [Int]!
  ) {
    adminMutation(token: $token) {
      addHelperUser(
        userFields: {
          name: $name
          surname: $surname
          patronymic: $patronymic
          countryId: $countryId
          phone: $phone
          login: $login
          password: $password
        }
        helperFields: {
          jobTitleId: $jobTitleId
          birthday: $birthday
          departmentIds: $departmentId
        }
      )
    }
  }
`;

export const EDIT_HELPER_USER = gql`
  mutation (
    $token: String!
    $id: Int!
    $name: String!
    $surname: String!
    $patronymic: String
    $birthday: DateTime!
    $countryId: Int!
    $departmentId: [Int]!
    $jobTitleId: Int!
  ) {
    adminMutation(token: $token) {
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
  }
`;

export const DISABLE_HELPER_USER = gql`
  mutation ($token: String!, $id: Int!, $isActive: Boolean) {
    adminMutation(token: $token) {
      updateHelperUser(
        id: $id
        userFields: { isActive: $isActive }
        helperFields: {}
      ) {
        changed
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation ($token: String!, $id: Int!) {
    adminMutation(token: $token) {
      deleteUser(id: $id)
    }
  }
`;

export const ADD_UNIT = gql`
  mutation (
    $token: String!
    $stroke: String!
    $lang: String!
    $orderNum: Int!
  ) {
    adminMutation(token: $token) {
      addUnit(fields: { stroke: $stroke, lang: $lang, orderNum: $orderNum })
    }
  }
`;

export const EDIT_UNIT = gql`
  mutation (
    $token: String!
    $id: Int!
    $stroke: String!
    $lang: String!
    $orderNum: Int
  ) {
    adminMutation(token: $token) {
      updateUnit(
        id: $id
        fields: { stroke: $stroke, lang: $lang, orderNum: $orderNum }
      ) {
        changed
      }
    }
  }
`;

export const DELETE_UNIT = gql`
  mutation ($token: String!, $id: Int!) {
    adminMutation(token: $token) {
      deleteUnit(id: $id)
    }
  }
`;

export const ADD_THEME = gql`
  mutation (
    $token: String!
    $unitId: Int!
    $stroke: String!
    $lang: String!
    $orderNum: Int!
  ) {
    adminMutation(token: $token) {
      addTheme(
        fields: {
          unitId: $unitId
          stroke: $stroke
          lang: $lang
          orderNum: $orderNum
        }
      )
    }
  }
`;

export const EDIT_THEME = gql`
  mutation (
    $token: String!
    $id: Int!
    $unitId: Int
    $stroke: String
    $lang: String!
    $orderNum: Int
  ) {
    adminMutation(token: $token) {
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
  }
`;

export const DELETE_THEME = gql`
  mutation ($token: String!, $id: Int!) {
    adminMutation(token: $token) {
      deleteTheme(id: $id)
    }
  }
`;

export const ADD_SUBTHEME = gql`
  mutation (
    $token: String!
    $themeId: Int!
    $stroke: String!
    $lang: String!
    $departmentIds: [Int]!
    $orderNum: Int!
  ) {
    adminMutation(token: $token) {
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
  }
`;

export const EDIT_SUBTHEME = gql`
  mutation (
    $token: String!
    $id: Int!
    $themeId: Int
    $stroke: String
    $lang: String!
    $departmentIds: [Int]
    $orderNum: Int
  ) {
    adminMutation(token: $token) {
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
  }
`;

export const DELETE_SUBTHEME = gql`
  mutation ($token: String!, $id: Int!) {
    adminMutation(token: $token) {
      deleteSubTheme(id: $id)
    }
  }
`;

export const EDIT_TICKET = gql`
  mutation (
    $token: String!
    $id: Int!
    $helperId: Int
    $assistantId: Int
    $unitId: Int
    $themeId: Int
    $subThtmeId: Int
    $departmentId: Int
  ) {
    helperMutation(token: $token) {
      updateTicket(
        id: $id
        fields: {
          helperId: $helperId
          unitId: $unitId
          themeId: $themeId
          subThemeId: $subThtmeId
          assistantId: $assistantId
        }
        departmentId: $departmentId
      ) {
        changed
      }
    }
  }
`;

export const SPLIT_TICKET = gql`
  mutation ($token: String!, $id: Int!, $argsList: [TicketSplitArgItem!]!) {
    helperMutation(token: $token) {
      splitTicket(id: $id, argsList: $argsList)
    }
  }
`;

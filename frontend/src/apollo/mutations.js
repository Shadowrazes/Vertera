import { gql } from "@apollo/client";

export const ADD_TICKET = gql`
  mutation (
    $token: String!
    $title: String!
    $initiatorId: Int!
    $recipientId: Int
    $unitId: Int!
    $themeId: Int!
    $subThemeId: Int!
    $senderId: Int!
    $recieverId: Int!
    $ticketId: Int!
    $text: String!
    $attachPaths: [String]
    $notification: Boolean!
  ) {
    clientMutation(token: $token) {
      addTicket(
        ticketFields: {
          title: $title
          initiatorId: $initiatorId
          recipientId: $recipientId
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
        notification: $notification
      ) {
        id
        initiatorId
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

export const DELETE_MESSAGE = gql`
  mutation ($token: String!, $id: Int!) {
    helperMutation(token: $token) {
      deleteMessage(id: $id)
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

export const UPDATE_REACTION = gql`
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
    helperMutation(token: $token) {
      helperObj {
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
    helperMutation(token: $token) {
      helperObj {
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
  }
`;

export const DISABLE_HELPER_USER = gql`
  mutation ($token: String!, $id: Int!, $isActive: Boolean) {
    helperMutation(token: $token) {
      helperObj {
        updateHelperUser(
          id: $id
          userFields: { isActive: $isActive }
          helperFields: {}
        ) {
          changed
        }
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
    $visibility: Int!
    $orderNum: Int!
  ) {
    helperMutation(token: $token) {
      themeObj {
        addUnit(
          fields: {
            stroke: $stroke
            lang: $lang
            visibility: $visibility
            orderNum: $orderNum
          }
        )
      }
    }
  }
`;

export const EDIT_UNIT = gql`
  mutation (
    $token: String!
    $id: Int!
    $stroke: String!
    $lang: String!
    $visibility: Int!
    $orderNum: Int
  ) {
    helperMutation(token: $token) {
      themeObj {
        updateUnit(
          id: $id
          fields: {
            stroke: $stroke
            lang: $lang
            visibility: $visibility
            orderNum: $orderNum
          }
        ) {
          changed
        }
      }
    }
  }
`;

export const ADD_THEME = gql`
  mutation (
    $token: String!
    $unitId: Int!
    $stroke: String!
    $lang: String!
    $visibility: Int!
    $orderNum: Int!
  ) {
    helperMutation(token: $token) {
      themeObj {
        addTheme(
          fields: {
            unitId: $unitId
            stroke: $stroke
            lang: $lang
            visibility: $visibility
            orderNum: $orderNum
          }
        )
      }
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
    $visibility: Int!
    $orderNum: Int
  ) {
    helperMutation(token: $token) {
      themeObj {
        updateTheme(
          id: $id
          fields: {
            unitId: $unitId
            stroke: $stroke
            lang: $lang
            visibility: $visibility
            orderNum: $orderNum
          }
        ) {
          changed
        }
      }
    }
  }
`;

export const DELETE_THEME = gql`
  mutation ($token: String!, $id: Int!) {
    helperMutation(token: $token) {
      themeObj {
        updateTheme(id: $id, fields: { visibility: 3, lang: "ru" }) {
          changed
        }
      }
    }
  }
`;

export const ACTIVATE_THEME = gql`
  mutation ($token: String!, $id: Int!) {
    helperMutation(token: $token) {
      themeObj {
        updateTheme(id: $id, fields: { visibility: 1, lang: "ru" }) {
          changed
        }
      }
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
    $visibility: Int!
    $orderNum: Int!
  ) {
    helperMutation(token: $token) {
      themeObj {
        addSubTheme(
          fields: {
            themeId: $themeId
            stroke: $stroke
            lang: $lang
            departmentIds: $departmentIds
            visibility: $visibility
            orderNum: $orderNum
          }
        )
      }
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
    $visibility: Int!
    $orderNum: Int
  ) {
    helperMutation(token: $token) {
      themeObj {
        updateSubTheme(
          id: $id
          fields: {
            themeId: $themeId
            stroke: $stroke
            lang: $lang
            departmentIds: $departmentIds
            visibility: $visibility
            orderNum: $orderNum
          }
        ) {
          changed
        }
      }
    }
  }
`;

export const DELETE_SUBTHEME = gql`
  mutation ($token: String!, $id: Int!) {
    helperMutation(token: $token) {
      themeObj {
        updateSubTheme(id: $id, fields: { visibility: 3, lang: "ru" }) {
          changed
        }
      }
    }
  }
`;

export const ACTIVATE_SUBTHEME = gql`
  mutation ($token: String!, $id: Int!) {
    helperMutation(token: $token) {
      themeObj {
        updateSubTheme(id: $id, fields: { visibility: 1, lang: "ru" }) {
          changed
        }
      }
    }
  }
`;

export const ADD_DEPARTMENT = gql`
  mutation ($token: String!, $stroke: String!) {
    adminMutation(token: $token) {
      addDepartment(fields: { stroke: $stroke, lang: "ru" })
    }
  }
`;

export const EDIT_DEPARTMENT = gql`
  mutation ($token: String!, $id: Int!, $stroke: String!) {
    adminMutation(token: $token) {
      updateDepartment(id: $id, fields: { stroke: $stroke, lang: "ru" }) {
        changed
      }
    }
  }
`;

export const DELETE_DEPARTMENT = gql`
  mutation ($token: String!, $id: Int!) {
    adminMutation(token: $token) {
      deleteDepartment(id: $id)
    }
  }
`;

export const EDIT_TICKET = gql`
  mutation (
    $token: String!
    $id: Int!
    $recipientId: Int
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
          recipientId: $recipientId
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

export const UPDATE_TRANSLATION = gql`
  mutation ($token: String!, $translationUpdate: [TranslationUpdate!]!) {
    helperMutation(token: $token) {
      translationObj {
        updateTranslation(fields: $translationUpdate) {
          changed
        }
      }
    }
  }
`;

export const CURATOR_ADD_TICKET = gql`
  mutation (
    $token: String!
    $title: String!
    $initiatorId: Int!
    $unitId: Int!
    $themeId: Int!
    $subThemeId: Int!
    $senderId: Int!
    $recieverId: Int!
    $ticketId: Int!
    $text: String!
    $notification: Boolean!
    $idsOuter: Boolean!
    $ids: [Int]!
  ) {
    helperMutation(token: $token) {
      addTicketMass(
        ticketFields: {
          title: $title
          initiatorId: $initiatorId
          unitId: $unitId
          themeId: $themeId
          subThemeId: $subThemeId
        }
        messageFields: {
          senderId: $senderId
          recieverId: $recieverId
          ticketId: $ticketId
          text: $text
        }
        notification: $notification
        idsOuter: $idsOuter
        ids: $ids
      )
    }
  }
`;

export const SEND_TO_MENTOR = gql`
  mutation ($token: String!, $id: Int!, $mentorId: Int!) {
    helperMutation(token: $token) {
      redirectTicketToMentor(id: $id, mentorId: $mentorId)
    }
  }
`;

export const MENTOR_LEAVE = gql`
  mutation ($token: String!, $id: Int!) {
    clientMutation(token: $token) {
      updateTicketByClient(id: $id, fields: { assistantId: -1 }) {
        changed
      }
    }
  }
`;

export const ADD_LANG = gql`
  mutation ($token: String!, $code: String!, $name: String!) {
    helperMutation(token: $token) {
      translationObj {
        addLang(fields: { code: $code, name: $name })
      }
    }
  }
`;

export const EDIT_LANG = gql`
  mutation ($token: String!, $id: Int!, $code: String, $name: String) {
    helperMutation(token: $token) {
      translationObj {
        updateLang(id: $id, fields: { code: $code, name: $name }) {
          changed
        }
      }
    }
  }
`;

export const DELETE_LANG = gql`
  mutation ($token: String!, $id: Int!) {
    helperMutation(token: $token) {
      translationObj {
        updateLang(id: $id, fields: { isActive: false }) {
          changed
        }
      }
    }
  }
`;

export const ADD_COUNTRY = gql`
  mutation (
    $token: String!
    $code: String!
    $stroke: String!
    $langIds: [Int]!
  ) {
    helperMutation(token: $token) {
      translationObj {
        addCountry(
          fields: {
            code: $code
            stroke: $stroke
            langIds: $langIds
            lang: "ru"
          }
        )
      }
    }
  }
`;

export const EDIT_COUNTRY = gql`
  mutation (
    $token: String!
    $id: Int!
    $code: String
    $stroke: String
    $langIds: [Int]
  ) {
    helperMutation(token: $token) {
      translationObj {
        updateCountry(
          id: $id
          fields: {
            code: $code
            stroke: $stroke
            langIds: $langIds
            lang: "ru"
          }
        )
      }
    }
  }
`;

export const DELETE_COUNTRY = gql`
  mutation ($token: String!, $id: Int!) {
    helperMutation(token: $token) {
      translationObj {
        updateCountry(id: $id, fields: { isActive: false, lang: "ru" })
      }
    }
  }
`;

export const UPDATE_CURATOR_PERMS = gql`
  mutation (
    $token: String!
    $id: Int!
    $sendMsg: Boolean!
    $helperEdit: Boolean!
    $themeEdit: Boolean!
    $translationEdit: Boolean!
  ) {
    adminMutation(token: $token) {
      updateHelperPerms(
        id: $id
        fields: {
          sendMsg: $sendMsg
          helperEdit: $helperEdit
          themeEdit: $themeEdit
          translationEdit: $translationEdit
        }
      ) {
        changed
      }
    }
  }
`;

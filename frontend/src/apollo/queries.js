import { gql } from "@apollo/client";

export const TABLE_TICKETS = gql`
  query ($token: String!, $filters: TicketFilter!, $lang: String!) {
    helperQuery(token: $token) {
      ticketList(filters: $filters) {
        count
        array {
          id
          link
          title
          initiator {
            id
          }
          recipient {
            id
            name
            surname
            patronymic
          }
          subTheme {
            name(lang: $lang) {
              stroke
            }
            theme {
              name(lang: $lang) {
                stroke
              }
              unit {
                name(lang: $lang) {
                  stroke
                }
              }
            }
          }
          date
          subTheme {
            theme {
              name(lang: $lang) {
                stroke
              }
            }
          }
          lastMessage {
            sender {
              name
              surname
              patronymic
            }
            date
          }
          messages {
            text
          }
          status {
            name(lang: "ru") {
              stroke
            }
          }
        }
      }
    }
  }
`;

export const TABLE_TICKETS_USER = gql`
  query (
    $token: String!
    $clientId: Int!
    $filters: TicketClientFilter!
    $lang: String!
  ) {
    clientQuery(token: $token) {
      ticketListByClient(clientId: $clientId, filters: $filters) {
        count
        array {
          id
          link
          title
          initiator {
            id
          }
          recipient {
            id
            name
            surname
            patronymic
          }
          subTheme {
            name(lang: $lang) {
              stroke
            }
            theme {
              name(lang: $lang) {
                stroke
              }
              unit {
                name(lang: $lang) {
                  stroke
                }
              }
            }
          }
          date
          subTheme {
            theme {
              name(lang: $lang) {
                stroke
              }
            }
          }
          lastMessage {
            sender {
              name
              surname
              patronymic
            }
            date
          }
          messages {
            text
          }
          status {
            name(lang: $lang) {
              stroke
            }
          }
        }
      }
    }
  }
`;

export const MESSAGES_CHAT = gql`
  query ($token: String!, $link: String!) {
    clientQuery(token: $token) {
      ticket(link: $link) {
        id
        title
        log {
          date
          type
          initiator {
            id
            name
            surname
            patronymic
            role
          }
          info
        }
        recipient {
          id
          name
          surname
          patronymic
        }
        assistant {
          id
          name
          surname
          patronymic
        }
        reaction
        initiator {
          id
          name
          surname
          patronymic
        }
        messages {
          id
          text
          attachs {
            id
            path
            name
          }
          sender {
            id
            name
            surname
            patronymic
            role
          }
          date
        }
        status {
          id
          name(lang: "ru") {
            stroke
          }
        }
        subTheme {
          id
          name(lang: "ru") {
            stroke
          }
          departments {
            id
            name(lang: "ru") {
              stroke
            }
          }
          theme {
            id
            name(lang: "ru") {
              stroke
            }
            unit {
              id
              name(lang: "ru") {
                stroke
              }
            }
          }
        }
      }
    }
  }
`;

export const MESSAGES_CHAT_CLIENT = gql`
  query ($token: String!, $link: String!) {
    clientQuery(token: $token) {
      ticket(link: $link) {
        id
        title
        recipient {
          id
          name
          surname
          patronymic
        }
        assistant {
          id
          name
          surname
          patronymic
        }
        reaction
        initiator {
          id
          name
          surname
          patronymic
        }
        messages {
          id
          text
          attachs {
            id
            path
            name
          }
          sender {
            id
            name
            surname
            patronymic
            role
          }
          date
        }
        status {
          id
          name(lang: "ru") {
            stroke
          }
        }
        subTheme {
          id
          name(lang: "ru") {
            stroke
          }
          departments {
            id
            name(lang: "ru") {
              stroke
            }
          }
          theme {
            id
            name(lang: "ru") {
              stroke
            }
            unit {
              id
              name(lang: "ru") {
                stroke
              }
            }
          }
        }
      }
    }
  }
`;

export const LOGIN = gql`
  query ($login: String!, $password: String!) {
    login(login: $login, password: $password) {
      token
      user {
        id
        name
        surname
        role
      }
    }
  }
`;

export const LOGIN_OUTER = gql`
  query ($sessionKey: String!) {
    loginOuter(sessionKey: $sessionKey) {
      token
      user {
        id
        name
        surname
        patronymic
        role
      }
    }
  }
`;

export const TRANSLATE = gql`
  query ($lang: String!) {
    translationList(lang: $lang) {
      type
      code
      stroke
    }
  }
`;

export const USER = gql`
  query ($token: String!, $id: Int!) {
    helperQuery(token: $token) {
      user(id: $id) {
        name
        surname
        patronymic
        role
      }
    }
  }
`;

export const THEME_LIST = gql`
  query ($token: String!) {
    clientQuery(token: $token) {
      allThemeTree {
        id
        name(lang: "ru") {
          stroke
        }
        orderNum
        themes {
          id
          name(lang: "ru") {
            stroke
          }
          orderNum
          subThemes {
            id
            name(lang: "ru") {
              stroke
            }
            orderNum
            departments {
              id
              name(lang: "ru") {
                stroke
              }
            }
          }
        }
      }
    }
  }
`;

export const DEPARTMENTS_LIST = gql`
  query ($token: String!) {
    helperQuery(token: $token) {
      departmentList {
        id
        name(lang: "ru") {
          stroke
        }
      }
    }
  }
`;

export const ATTACHEMNTS_LIST = gql`
  query ($token: String!, $messageId: Int!) {
    clientQuery(token: $token) {
      attachmentList(messageId: $messageId) {
        id
        path
      }
    }
  }
`;

export const CURATORS_LIST = gql`
  query ($token: String!) {
    helperQuery(token: $token) {
      helperList {
        id
        jobTitle {
          id
          name(lang: "ru") {
            stroke
          }
        }
        birthday
        startWorkDate
        user {
          id
          name
          surname
          patronymic
        }
        departments {
          id
          name(lang: "ru") {
            stroke
          }
        }
      }
    }
  }
`;

export const JOB_TITLE_LIST = gql`
  query ($token: String!, $lang: String!) {
    adminQuery(token: $token) {
      jobTitleList {
        id
        name(lang: $lang) {
          stroke
        }
      }
    }
  }
`;

export const HELPER = gql`
  query ($token: String!, $id: Int!) {
    helperQuery(token: $token) {
      helper(id: $id) {
        id
        jobTitle {
          id
          name(lang: "ru") {
            stroke
          }
        }
        departments {
          id
          name(lang: "ru") {
            stroke
          }
        }
        birthday
        startWorkDate
        user {
          id
          name
          surname
          patronymic
          country {
            id
            name(lang: "ru") {
              stroke
            }
          }
        }
      }
    }
  }
`;

export const COUNTRY_LIST = gql`
  query ($token: String!) {
    clientQuery(token: $token) {
      countryList {
        id
        code
        name(lang: "ru") {
          stroke
        }
        langs {
          id
          code
          name
        }
      }
    }
  }
`;

export const LANGUAGE_LIST = gql`
  query ($token: String!) {
    clientQuery(token: $token) {
      langList {
        id
        code
        name
      }
    }
  }
`;

export const UNIT = gql`
  query ($token: String!, $id: Int!) {
    helperQuery(token: $token) {
      unit(id: $id) {
        name(lang: "ru") {
          stroke
        }
        orderNum
      }
    }
  }
`;

export const THEME = gql`
  query ($token: String!, $id: Int!) {
    helperQuery(token: $token) {
      theme(id: $id) {
        name(lang: "ru") {
          stroke
        }
        orderNum
        unit {
          id
          name(lang: "ru") {
            stroke
          }
        }
      }
    }
  }
`;

export const SUBTHEME = gql`
  query ($token: String!, $id: Int!) {
    helperQuery(token: $token) {
      subTheme(id: $id) {
        name(lang: "ru") {
          stroke
        }
        orderNum
        theme {
          id
          name(lang: "ru") {
            stroke
          }
          unit {
            id
            name(lang: "ru") {
              stroke
            }
          }
        }
        departments {
          id
          name(lang: "ru") {
            stroke
          }
        }
      }
    }
  }
`;

export const STATS = gql`
  query ($token: String!, $filters: HelperStatsFilter!) {
    helperQuery(token: $token) {
      helperStatList(filters: $filters) {
        helper {
          id
          user {
            name
            surname
            patronymic
          }
        }
        stats {
          totalTickets
          newTickets
          inProgressTickets
          closedTickets
          avgReplyTime
          likes
          dislikes
          notRated
          fantasy
        }
      }
    }
  }
`;

export const STATUS_LIST = gql`
  query ($token: String!) {
    helperQuery(token: $token) {
      ticketStatusList {
        id
        name(lang: "ru") {
          stroke
        }
      }
    }
  }
`;

export const TRANSLATION_LIST = gql`
  query ($token: String!) {
    adminQuery(token: $token) {
      translationListFull {
        id
        code
        translations {
          lang
          stroke
        }
      }
    }
  }
`;

import { gql } from "@apollo/client";

export const TABLE_TICKETS = gql`
  query ($filters: TicketFilter!) {
    ticketList(filters: $filters) {
      count
      array {
        id
        client {
          id
        }
        helper {
          id
        }
        subTheme {
          theme {
            unit {
              name(lang: "ru") {
                stroke
              }
            }
          }
        }
        date
        subTheme {
          theme {
            name(lang: "ru") {
              stroke
            }
          }
        }
        lastMessage {
          sender {
            fullName
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
`;

export const TABLE_TICKETS_USER = gql`
  query ($clientId: Int!, $filters: TicketClientFilter!) {
    ticketListByClient(clientId: $clientId, filters: $filters) {
      count
      array {
        id
        client {
          id
        }
        helper {
          id
        }
        subTheme {
          theme {
            unit {
              name(lang: "ru") {
                stroke
              }
            }
          }
        }
        date
        subTheme {
          theme {
            name(lang: "ru") {
              stroke
            }
          }
        }
        lastMessage {
          sender {
            fullName
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
`;

// export const TICKETS_AMOUNT = gql`
//   query {
//     ticketListCount
//   }
// `;

export const MESSAGES_CHAT = gql`
  query ($id: Int!) {
    ticket(id: $id) {
      id
      reaction
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
    }
  }
`;

export const LOGIN = gql`
  query ($login: String!, $password: String!) {
    login(login: $login, password: $password) {
      token
      userId
    }
  }
`;

export const THEME_LIST = gql`
  query {
    allThemeTree {
      id
      name(lang: "ru") {
        stroke
      }
      themes {
        id
        name(lang: "ru") {
          stroke
        }
        subThemes {
          id
          name(lang: "ru") {
            stroke
          }
        }
      }
    }
  }
`;

export const DEPARTMENTS_LIST = gql`
  query {
    departmentList {
      id
      name(lang: "ru") {
        stroke
      }
    }
  }
`;

export const ATTACHEMNTS_LIST = gql`
  query ($messageId: Int!) {
    attachmentList(messageId: $messageId) {
      id
      path
    }
  }
`;

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
`;

export const MESSAGES_CHAT = gql`
  query ($id: Int!) {
    ticket(id: $id) {
      id
      helper {
        id
        user {
          name
          surname
          patronymic
        }
      }
      reaction
      client {
        user {
          name
          surname
          patronymic
        }
        email
      }
      helper {
        user {
          name
          surname
          patronymic
        }
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
`;

export const LOGIN = gql`
  query ($login: String!, $password: String!) {
    login(login: $login, password: $password) {
      token
      userId
    }
  }
`;

export const USER = gql`
  query ($id: Int!) {
    user(id: $id) {
      name
      surname
      patronymic
      role
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

export const CURATORS_LIST = gql`
  query {
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
`;

export const JOB_TITLE_LIST = gql`
  query {
    jobTitleList {
      id
      name(lang: "ru") {
        stroke
      }
    }
  }
`;

export const HELPER = gql`
  query ($id: Int!) {
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
`;

export const COUNTRY_LIST = gql`
  query {
    countryList {
      id
      name(lang: "ru") {
        stroke
      }
    }
  }
`;

export const UNIT = gql`
  query ($id: Int!) {
    unit(id: $id) {
      name(lang: "ru") {
        stroke
      }
    }
  }
`;

export const THEME = gql`
  query ($id: Int!) {
    theme(id: $id) {
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
`;

export const SUBTHEME = gql`
  query ($id: Int!) {
    subTheme(id: $id) {
      name(lang: "ru") {
        stroke
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
      departments {
        id
        name(lang: "ru") {
          stroke
        }
      }
    }
  }
`;

export const STATS = gql`
  query {
    helperStatList(orderBy: "id", orderDir: "", limit: 50, offset: 0) {
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
`;

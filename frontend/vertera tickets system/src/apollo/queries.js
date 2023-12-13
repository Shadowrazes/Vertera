import { gql } from "@apollo/client";

export const TABLE_TICKETS = gql`
  query ($filters: TicketFilter!) {
    ticketList(filters: $filters) {
      id
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
`;

export const TICKETS_AMOUNT = gql`
  query {
    ticketListCount
  }
`;

export const MESSAGES_CHAT = gql`
  query ($id: Int!) {
    ticket(id: $id) {
      id
      messages {
        id
        text
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
    subThemeList {
      id
      name(lang: "ru") {
        stroke
      }
      theme {
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

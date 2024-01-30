import { gql } from "@apollo/client";

export const TABLE_TICKETS = gql`
  query ($filters: TicketFilter!) {
    helperQuery(token: "123") {
      ticketList(filters: $filters) {
        count
        array {
          id
          link
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
  }
`;

export const TABLE_TICKETS_USER = gql`
  query ($clientId: Int!, $filters: TicketClientFilter!) {
    clientQuery(token: "123") {
      ticketListByClient(clientId: $clientId, filters: $filters) {
        count
        array {
          id
          link
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
  }
`;

export const MESSAGES_CHAT = gql`
  query ($link: String!) {
    clientQuery(token: "123") {
      ticket(link: $link) {
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
          id
          user {
            name
            surname
            patronymic
          }
          email
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
      userId
    }
  }
`;

export const USER = gql`
  query ($id: Int!) {
    helperQuery(token: "123") {
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
  query {
    clientQuery(token: "123") {
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
  query {
    adminQuery(token: "123") {
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
  query ($messageId: Int!) {
    clientQuery(token: "123") {
      attachmentList(messageId: $messageId) {
        id
        path
      }
    }
  }
`;

export const CURATORS_LIST = gql`
  query {
    helperQuery(token: "123") {
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
  query {
    adminQuery(token: "123") {
      jobTitleList {
        id
        name(lang: "ru") {
          stroke
        }
      }
    }
  }
`;

export const HELPER = gql`
  query ($id: Int!) {
    helperQuery(token: "123") {
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
  query {
    adminQuery(token: "123") {
      countryList {
        id
        name(lang: "ru") {
          stroke
        }
      }
    }
  }
`;

export const UNIT = gql`
  query ($id: Int!) {
    helperQuery(token: "123") {
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
  query ($id: Int!) {
    helperQuery(token: "123") {
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
  query ($id: Int!) {
    helperQuery(token: "123") {
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
  query {
    helperQuery(token: "123") {
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
  }
`;

export const STATUS_LIST = gql`
  query {
    helperQuery(token: "123") {
      ticketStatusList {
        id
        name(lang: "ru") {
          stroke
        }
      }
    }
  }
`;

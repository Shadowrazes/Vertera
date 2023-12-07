import { gql } from "@apollo/client";

const TABLE_TICKETS = gql`
  query TableData {
    ticketList(
      filters: {
        limit: 9999
        offset: 0
        orderBy: "lastMsgDate"
        orderDir: "ASC"
      }
    ) {
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

export default TABLE_TICKETS;

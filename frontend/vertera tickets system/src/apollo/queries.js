import { gql } from "@apollo/client";

export const TABLE_TICKETS = gql`
  query TableData($filters: TicketFilter!) {
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
        text
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

export default TABLE_TICKETS;

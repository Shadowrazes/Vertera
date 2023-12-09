import { gql } from "@apollo/client";
import { execute } from "graphql";

export const ADD_STATUS = gql`
  mutation addStatus {
    addTicketStatus(fields: { lang: "ru", stroke: "В ожидании" })
  }
`;

export const ADD_TICKET = gql`
  mutation addTicket {
    addTicket(
      ticketFields: { clientId: 1, unitId: 1, themeId: 6, subThemeId: 55 }
      messageFields: {
        senderId: 1
        recieverId: 2
        ticketId: 1
        type: "common"
        text: "test"
        attachPaths: ["test/a", "test/321"]
      }
    )
  }
`;

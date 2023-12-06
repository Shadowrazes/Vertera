import { gql } from "@apollo/client";

const TABLE_TICKETS = gql`
  query {
    ticket(id: 4) {
      id
    }
  }
`;

export default TABLE_TICKETS;

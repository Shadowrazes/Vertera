import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  url: "http://localhost:4444/graphql",
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      query TicketBy($id: ID!) {
        ticket(id: $id) {
          id
          date
        }
      }
    `,
    variables: { id: "4" },
  })
  .then((result) => console.log(result));

export default client;

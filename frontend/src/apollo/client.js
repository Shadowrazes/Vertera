import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  
  uri: import.meta.env.DEV ? "http://localhost:4444/graphql" : "https://vertera-ticket.yasanyabeats.ru:4444/graphql",
  cache: new InMemoryCache(),
});

export default client;

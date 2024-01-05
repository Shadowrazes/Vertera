import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  
  uri: import.meta.env.DEV ? "http://localhost:4444/graphql" : "http://185.182.111.231:4444/graphql",
  cache: new InMemoryCache(),
});

export default client;

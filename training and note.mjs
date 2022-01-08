import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";

async function startApolloServer(typeDefs, resolvers) {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

// 1. typeDef ini anggap sebagai skema DB yang dibuat dengan aturan, contoh disini skema "hello" dengan aturan yaitu berbentuk string
// 2. aturan disini dapat berupa scalar type atau object
// 3. penggunaan scalar disini berarti data tersebut boleh scalar type ataupun kosong (null), jika tidak mau ada data null maka gunakan ! diakhir scalar
const typeDef = gql`
  type Query {
    hello: String!
    numberOfAnimals: Int
    price: Float
    isCool: Boolean
  }
`

// 4. resolver disini adalah data yang akan dikirimkan saat skema diminta, anggap ini sebagai data yang disimpan didalam skema
const resolver = {
  Query: {
    hello: () => {
      return 'dunia'
    },
    numberOfAnimals: () => {
      return 45
    },
    price: () => {
      return 499.99
    },
    isCool: () => false
  }
}

startApolloServer(typeDef, resolver)
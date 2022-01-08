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

// 1. butuh array dengan scalar? we got you. tambahin aja buka tutup kurung kotak ([]) dan tambahkan scalar type nya
/*
2. butuh untuk menghilangkan kemungkinan data kosong (null) dalam array? tambah tanda seru ! setelah scalar typenya
data dalam array tidak kosong bukan berarti array tidak boleh kosong juga, tambah ! diakhir array untuk menghilangkan kemungkinan array null
*/
const typeDef = gql`
  type Query {
    hello: [String!]
  }
`

const resolver = {
  Query: {
    hello: () => {
      return ['dunia', 'milik', 'kita']
    },
  }
}

startApolloServer(typeDef, resolver)
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";

import { typeDef } from "./schema.mjs";
import { products, categories } from "./db.mjs";
import { Query } from "./resolvers/Query.mjs";
import { Product } from "./resolvers/Product.mjs";
import { Category } from "./resolvers/Category.mjs";

async function startApolloServer(typeDefs, resolvers) {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: {
      products,
      categories
    }
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

/**
 * 1. sebelumnya kita melakukan import pada tiap resolver yang membutuhkan akses ke db, tentu makin banyak resolver yang dibuat akan membuat import menjadi melelahkan
 * ingat resolver memiliki 3 parameter yaitu parent, args, dan context? untuk mengurangi proses import disini kita dapat menggunakan parameter context
 * parameter tersebut dapat diberikan pada variable baru bernama context yang dapat kita definisikan langsung pada variable server diatas atau dibuat terpisah dibawah kemudian kita passing ke variable server diatas
 * setelah didefinisikan, pada tiap resolver kita tinggal melakukan destruktur context dan siap digunakan (misal pada resolver Category kita membutuhkan akses ke db data products, kita tinggal lakukan const {products} = context dan kita sudah bisa melakukan akses ke data products)
 */
const resolver = {
  Query,
  Product,
  Category,
};

startApolloServer(typeDef, resolver);

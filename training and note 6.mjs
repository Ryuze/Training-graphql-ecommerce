import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";

import { typeDef } from "./schema.mjs";
import { Query } from "./resolvers/Query.mjs";
import { Product } from "./resolvers/Product.mjs";
import { Category } from "./resolvers/Category.mjs";

/**
 * 2. kemudian data yang disimpan bisa dipindahkan ke file nya sendiri misalnya db.js / db.mjs
 */
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

/**
 * 1. selanjutnya kita sadar, semakin banyak fungsi yang kita tambahkan maka akan semakin tidak terbaca file ini
 * yang bisa dilakukan adalah memisahkan beberapa fungsi dan data ke file nya masing-masing
 * yang pertama adalah typeDef ini, kita bisa pindahkan ke file lain dengan nama misalnya schema.js / schema.mjs jika menggunakan ES6
 */
/**
 * 3. berikutnya adalah resolver, best practicenya tiap resolver baru yang dibuat memiliki filenya sendiri karena resolver ini seperti query rule pada mysql, sangat mudah menjadi panjang dengan cepat tergantung kompleksitasnya
 * jadi dibuat folder resolvers dengan isinya bernama sama dengan nama resolvernya
 * kemudian define resolver yang akan digunakan didalam variable resolver dibawah
 * karena resolver berada di file nya masing-masing, import schema yang harus dilakukan saat ini dilakukan pada resolver yang membutuhkan (ada cara yang lebih baik nantinya)
 */
const resolver = {
  Query,
  Product,
  Category,
};

startApolloServer(typeDef, resolver);

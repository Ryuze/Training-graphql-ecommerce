import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";

import { typeDef } from "./schema.mjs";
import { products, categories, reviews } from "./db.mjs";
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
      categories,
      reviews
    }
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

/**
 * 1. berikutnya client mau tiap product ada review dan score bintang nya, ga ada hal baru disini, hanya tinggal menambah data db reviews lalu tambahkan schema dan resolver lalu asosiasikan dengan product
 */
/**
 * 2. pada schema saat membuat relasi antara review dengan product, perlu dipikir, apakah perlu saat kita mengambil suatu review maka product yang berelasi dapat kita ambil juga?
 * tentu mungkin tidak, yang kita mau adalah saat mengambil suatu product, kita juga mengambil review tentang product tersebut dan tidak perlu sebaliknya
 * karena itu untuk relasi kita hanya membuat antara product dengan review (one to many) dan tidak perlu membuat review dengan product
 */
/**
 * 3. kemudian untuk resolver, kira-kira dengan ketentuan tersebut apa kita perllu membuat resolver sendiri untuk reviews? tentu tidak, karena disini reviews hanya bisa diambil melalui product
 * lalu dimana pasang resolvernya? tentu di resolver Product
 * untuk note, pada resolver penggunaan fungsi .find() dan .filter() berasal dari js bukan bawaan graphql atau apolloserver, jika menggunakan bahasa lain harap cek / gunakan fungsi lain
 */
const resolver = {
  Query,
  Product,
  Category,
};

startApolloServer(typeDef, resolver);

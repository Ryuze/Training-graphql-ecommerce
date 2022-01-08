import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";

import { typeDef } from "./schema.mjs";
import { db } from "./db.mjs";
import { Query } from "./resolvers/Query.mjs";
import { Mutation } from "./resolvers/Mutation.mjs";
import { Product } from "./resolvers/Product.mjs";
import { Category } from "./resolvers/Category.mjs";

async function startApolloServer(typeDefs, resolvers) {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: { db },
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

/**
 * 1. terakhir adalah update, alur logikanya adalah cari berdasarkan id kemudian reset dan reassign kembali dengan data yang baru
 * kasusnya disini adalah update category, pertama adalah tambahkan Mutation updateCategory dengan parameter adalah id dan input data yang baru kemudian return category yang baru tersebut di schema
 * pada resolver mutation, yang pertama dilakukan adalah mencari index dari category yang akan diubah menggunakan fungsi .findIndex(), kemudian lakukan perubahan data hanya pada db.categories[index] itu saja
 * disini untuk simplisitas kita menggunakan destructure array menggunakan ..., cara kerjanya adalah pada destructure pertama kita memasukkan semua isi dari db.categories[index] kedalam data yang akan diubah, kemudian kita tiban lagi dengan data destructure dari input
 * setelah proses selesai maka lakukan return data yang telah diubah tersebut
 */
/**
 * 2. sebagai tantangan, buat update juga pada product dan review
 * perlu diingat dalam pencarian index jika index tidak ditemukan menggunakan .findIndex() maka hasil yang akan di return adalah -1, dan ini adalah masalah karena jika di pass ke db.products[-1] maka akan menghasilkan error dan ini perlu diatasi dengan condition / error catch
 * untuk update ini pada semua mutation benar-benar sama persis, hanya perlu mengubah context nya saja
 */
const resolver = {
  Query,
  Mutation,
  Product,
  Category,
};

startApolloServer(typeDef, resolver);

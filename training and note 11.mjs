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
 * 1. berikutnya adalah mutation delete, dengan logika yang sama seperti menambah data sebelumnya, yang kita lakukan adalah menambah schema, menambah fungsi resolver mutation dan selesai
 * misalnya disini kita akan menghapus sebuah category, sebut fungsinya adalah deleteCategory dengan parameter adalah id category berbentuk scalar sehingga kita tidak perlu membuat input, dan yang akan di return adalah boolean (bagusnya return message seperti 200 success atau 404 not found tapi itu diluar scope)
 * mungkin ini akan sedikit lebih komplex dari yang dipikirkan, karena category memiliki relasi dengan product, dan product berelasi dengan reviews, jika category dihapus apa yang akan terjadi dengan product beserta reviewsnya?
 * ada 2 pilihan, melakukannya secara cascade sehingga jika category dihapus maka product beserta reviews yang berelasi akan ikut terhapus, atau sebelum dihapus dilakukan perubahan pada categoryId semua product yang berelasi menjadi null sehingga product tidak akan terhapus setelah category dihapus
 * dan client ingin pilihan kedua, untuk menghapus data berdasarkan id cukup mudah, tinggal simpan ulang semua data kecuali data yang ingin dihapus
 */
/**
 * 2. dan entah kenapa jika kita menggunakan cara filter selain id yang dimasukkan dan reassign ke categories data tidak dapat berubah, solusinya disini adalah melakukan refactor total bagian context yang digunakan
 * pada db.js semula export {products, categories, reviews} harus dijadikan const db = {products, categories, reviews} kemudian export {db} agar categories dapat di reasign saat mutation deleteCategory dijalankan
 * tentu perubahan pada db ini mengharuskan perubahan total pada semua resolver yang digunakan semua products menjadi db.products dsb
 */
/**
 * 3. logika deleteCategory yang kita lakukan adalah pertama melakukan reassign pada db.categories, data yang di reassign adalah seluruh data categories kecuali id category yang akan dihapus
 * kemudian dengan id category yang masih ada di variable id, gunakan sebagai alat pencari categoryId pada seluruh product yang ada, pada proses ini kita melakukan reassign kembali pada seluruh product menggunakan .map() dengan ketentuan jika ditemukan categoryId sama dengan id maka ubah nilai categoryId menjadi null
 * pastikan juga schema category pada type Product tidak memiliki tanda seru / menerima nilai null untuk menghindari error
 */
/**
 * 4. sebagai tantangan, gunakan logika yang sekiranya hampir sama yaitu menghapus data product dan review
 * untuk product disini kita ingin jika product dihapus maka review yang berelasi dengan product tersebut ikut hilang, karena itu untuk logic pertama sama persis pada deleteCategory yaitu reassign semua product selain product yang akan dihapus. tetapi pada logic kedua yaitu menghapus review yang berelasi dilakukan hal yang sama yaitu filter dan reassign review selain review yang memiliki relasi dengan product yang dihapus
 * untuk review lebih mudah karena review berelasi dengan product dan tidak akan mengganggu siapa-siapa meski dihilangkan, jadi cukup dengan melakukan reassign review selain review yang akan dihapus dan selesai
 */
const resolver = {
  Query,
  Mutation,
  Product,
  Category,
};

startApolloServer(typeDef, resolver);

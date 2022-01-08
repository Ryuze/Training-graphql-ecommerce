import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";

import { typeDef } from "./schema.mjs";
import { products, categories, reviews } from "./db.mjs";
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
 * 1. berikutnya adalah mutation, selama ini kita menggunakan graphql untuk mengambil data dari db, tapi bagaimana jika kita ingin mengubah isi dari db tersebut?
 * mutation dapat digunakan dalam hal itu, query yang digunakan untuk menjalankan mutation juga berbeda. jika sebelumnya untuk meminta data kita menggunakan object query, pada mutation kita menggunakan object mutation
 * untuk melakukan proses mutaion, yang pertama dilakukan adalah menambahkan typeDef Mutation kedalam schema
 * didalam object Mutation, kita bisa bebas menambahkan perintah apa yang ingin kita jalankan didalam Mutaion ini, sebagai contoh kita tambahkan mutation untuk menambah category dengan nama addCategory
 * kemudian setelah fungsi tersebut, kita meminta apa yang akan di return setelah fungsi dijalankan, misalkan addCategory: Category!, berarti setelah kita menjalankan addCategory, graphql akan mengirimkan respon berupa object Category yang telah kita tambahkan sebelumnya
 * karena disini kita melakukan mutation, tentu perlu adanya parameter untuk memberitahu server data apa yang kita tambahkan. deklarasi parameter dapat dilakukan secara inline (seperti pada query product(id: ID)) atau seperti filter yang sebelumnya dilakukan dengan menggunakan typeDef input (dan ini sangat disarankan)
 */
/**
 * 2. setelah typeDef Mutation lengkap dengan parameter dan inputnya dibuat, berikutnya adalah membuat resolver. buat resolver terpisah untuk Mutation addCategory
 * sama seperti kita resolve data dari db, kita perlu nama resolver, nama fungsi dengan parameter parent args context, dan fungsi yang dijalankan
 * disini kita menambah kategori baru kedalam db, kategori sendiri memiliki nilai id dan name yang harus diisi, id sendiri dapat di auto generate saat fungsi addCategory dijalankan sehingga disini kita membutuhkan user untuk memberikan parameter name saja untuk menambahkan kategori baru
 * untuk melakukan auto generate id bisa dilakukan dengan se kreatif mungkin, atau menggunakan teknik no brain dengan menggunakan package uuid dari npm, dan disini kita menggunakan uuid
 * alur logika untuk mutation add data cukup mudah tergantung kebutuhan, untuk addCategory sendiri disini kita hanya perlu melakukan destructure pada input args dan categories context, kemudian deklarasikan newCategories yang berisi id adalah auto generate uuid dan name adalah input.name, kemudian lakukan push newCategory kedalam categories, terakhir lakukan return berupa newCategory yang ditambahkan
 * setelah resolver dibuat kemudian di server kita import mutation resolver dan tambahkan resolver Mutation ke variable resolver dibawah
 * perlu diingat penambahan data kedalam db ini bersifat sementara karena tidak disimpan ke file db.js tetapi ke memory server (volatile memory), jadi jika server dimatikan maka semua perubahan yang dilakukan akan hilang
 */
/**
 * 3. sebagai tantangan, lakukan mutasi yang sama pada product dan review
 * untuk product dapat digunakan kode sama persis dengan category sebelumnya, hanya mungkin jadi beban pikiran untuk bagian categoryId apakah harus dilakukan pengecekan dahulu apakah categoryId terdaftar atau tidak sebelum product ditambah.
 * untuk review juga akan terasa sedikit masalah, karena review memiliki productId yaitu foreign key dari product id, bagaimana cara memastikan review masuk tepat pada product nya, tidak mau kan ada kejadian review masuk ke product yang tidak tepat
 * untuk latihan saja disini kita anggap user memasukkan data secara tepat pada product yang tepat, perfect world scenario
 * jika mengikuti perfect world scenario, maka untuk mutation product dan review benar-benar sama persis dengan product
 * khusus untuk review, jadi kepikiran karena review ada didalam product maka kita bisa gunakan parameter parent untuk mengambil product id nya.
 */
/**
 * 4. ingat semua perubahan db yang dilakukan saat ini hanya tersimpan di memory sebagai volatile memory dan hilang saat server restart? untuk membuat data tersimpan pada server side file (persisted queries) apollo server menyediakan fitur automatic persisted queries https://www.apollographql.com/docs/apollo-server/performance/apq/
 * tentu di latihan ini tidak akan digunakan fitur tersebut karena bukan scope nya jadi gunakan jika dibutuhkan nanti pada project lain
 * dan fitur ini tidak terbatan pada apolloserver, banyak server graphql lain yang punya fitur ini jadi jika tidak menggunakan apollo bisa cari dahulu fitur ini
 */
const resolver = {
  Query,
  Mutation,
  Product,
  Category,
};

startApolloServer(typeDef, resolver);

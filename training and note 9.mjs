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
 * 1. berikutnya client ingin jika products sedang on sale, maka tampilkan semua produknya. konsepnya sama seperti mengambil data satu product dengan menggunakan parameter ID
 * tapi cara perlakuan kodenya berbeda karena ID menggunakan scalar type sedangkan disini kita akan menggunakan parameter filter dengan data type nya adalah object. kenapa object? karena untuk antisipasi kedepannya jika ingin melakukan implementasi filter tambahan misalnya jika rating 4 dan sedang on sale maka tampilkan, dsb
 */
/**
 * 2. pertama tambahkan parameter pada query products sebut saja filter yang merupakan sebuah object
 * kemudian tambahkan typeDef baru dengan keyword input, bukan type. typeDef input ini digunakan jika ingin melakukan pass complex object data kedalam schema untuk melakukan mutasi nantinya
 * pada input dapat diberi nama bebas tapi sebaiknya berhubungan dengan dimana input ini digunakan, sebagai contoh karena ini digunakan pada query products di parameter filter maka diberi nama ProductsFilterInput
 * kemudian isi object ProductsFilterInput dengan filter yang digunakan, yaitu onSale dengan rule nya adalah Boolean
 * lalu kembali ke query products, pada parameter filter buat untuk mengarah ke ProductsFilterInput sehingga menjadi filter: ProductsFilterInput
 */
/**
 * 3. buka resolver Query, filter ini akan tertangkap di bagian args karena itu untuk melakukan filtering kita perlu mengambil parameter filter tersebut terlebih dahulu dari args
 * tinggal buat logic filtering pada query products
 * coba lakukan filter onSale pada query products, tentu bisa dilakukan. sekarang misalnya client ingin filter onSale tapi pada saat dia mencari products berdasar category, bagaimana caranya?
 */
/**
 * 4. cukup mudah dilakukan, semudah copy paste logic yang digunakan pada query products tadi ke resolver Category query products
 * pertama copy saja parameter pada schema Query products ke Category products
 * kemudian buat logic yang sama seperti query products sebelumnya, yang membedakan adalah pertama kita filter dahulu semua products berdasarkan categoryId, kemudian lakukan filter kedua jika onSale bernilai true
 */
/**
 * 5. sebagai tantangan, sekarang client ingin melakukan filter selain onSale sebelumnya yaitu berdasarkan rating
 * hasil: ok, agak sedikit tricky. disini kita lakukan implementasi pada query products saja terlebih dahulu
 * alur logika yang seharusnya terjadi adalah lakukan cek apakah avgRating bernilai true, jika ya maka lakukan math floor untuk berjaga-jaga jika nilai bersifat float
 * lakukan cek kembali apakah nilai avgRating bernilai antara 1 dan 5, jika ya maka lakukan filter pada variable filteredProducts dengan ketentuan jika rating product tersebut diatas avgRating maka ambil data tersebut
 * didalam proses filter tersebut yang kita lakukan adalah pertama mendapatkan review yang berelasi dengan product terkait terlebih dahulu
 * kemudian menghitung rating dari review yang telah diambil dan disimpan sebagai variable productRatingReviews menggunakan fungsi .reduce() dan membagi hasil reduce dengan panjang array dari reviews
 * kemudian melakukan cek jika productRatingReviews lebih besar atau sama dengan avgRating maka return product tersebut
 * berikutnya pada category, kode yang digunakan sama persis dengan query products, hanya mengubah variable filteredProducts menjadi filteredCategoryProducts
 */
const resolver = {
  Query,
  Product,
  Category,
};

startApolloServer(typeDef, resolver);

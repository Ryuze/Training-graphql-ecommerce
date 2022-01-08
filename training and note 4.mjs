import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";

const products = [
  {
    id: "53a0724c-a416-4cac-ae45-bfaedce1f147",
    categoryId: "c01b1ff4-f894-4ef2-b27a-22aacc2fca70",
    name: "Steel Pot",
    description: "Silver steel pot that is perfect for cooking",
    quantity: 230,
    price: 42.44,
    image: "img-1",
    onSale: false,
  },
  {
    id: "c2af9adc-d0b8-4d44-871f-cef66f86f7f6",
    categoryId: "c01b1ff4-f894-4ef2-b27a-22aacc2fca70",
    name: "Salad Bowl",
    description: "Round wooden bowl perfect for tossing and making salads",
    quantity: 33,
    price: 53.5,
    image: "img-2",
    onSale: false,
  },
  {
    id: "2c931e7e-510f-49e5-aed6-d6b44087e5a1",
    categoryId: "c01b1ff4-f894-4ef2-b27a-22aacc2fca70",
    name: "Spoon",
    description: "Small and delicate spoon",
    quantity: 4266,
    price: 1.33,
    image: "img-3",
    onSale: true,
  },
  {
    id: "404daf2a-9b97-4b99-b9af-614d07f818d7",
    categoryId: "34115aac-0ff5-4859-8f43-10e8db23602b",
    name: "Shovel",
    description: "Grey rounded shovel for digging",
    quantity: 753,
    price: 332,
    image: "img-4",
    onSale: false,
  },
  {
    id: "6379c436-9fad-4b3f-a427-2d7241f5c1b1",
    categoryId: "34115aac-0ff5-4859-8f43-10e8db23602b",
    name: "Fertilizer",
    description: "Nitrogen based fertitlizer",
    quantity: 53453,
    price: 23.11,
    image: "img-5",
    onSale: true,
  },
  {
    id: "f01bcdec-6783-464e-8f9e-8416830f7569",
    categoryId: "d914aec0-25b2-4103-9ed8-225d39018d1d",
    name: "Basketball",
    description: "Outdoor or indoor basketball",
    quantity: 128,
    price: 59.99,
    image: "img-6",
    onSale: true,
  },
  {
    id: "a4824a31-5c83-42af-8c1b-6e2461aae1ef",
    categoryId: "d914aec0-25b2-4103-9ed8-225d39018d1d",
    name: "Golf Clubs",
    description: "Good for golfing",
    quantity: 3,
    price: 427.44,
    image: "img-7",
    onSale: false,
  },
  {
    id: "b553085a-a7e0-4c9b-8a12-f971919c3683",
    categoryId: "d914aec0-25b2-4103-9ed8-225d39018d1d",
    name: "Baseball Gloves",
    description: "Professional catcher gloves",
    quantity: 745,
    price: 77.0,
    image: "img-8",
    onSale: true,
  },
  {
    id: "47bf3941-9c8b-42c0-9c72-7f3985492a5b",
    categoryId: "d914aec0-25b2-4103-9ed8-225d39018d1d",
    name: "Soccer Ball",
    description: "Round ball",
    quantity: 734,
    price: 93.44,
    image: "img-9",
    onSale: false,
  },
];

const categories = [
  {
    id: "c01b1ff4-f894-4ef2-b27a-22aacc2fca70",
    name: "Kitchen",
  },
  {
    id: "34115aac-0ff5-4859-8f43-10e8db23602b",
    name: "Garden",
  },
  {
    id: "d914aec0-25b2-4103-9ed8-225d39018d1d",
    name: "Sports",
  },
];

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
 * 1. lanjut membuat kategori untuk product, pertama tambahkan type category pada typeDef. ingat typeDef adalah tempat mendefinisikan struktur skema data yang kita gunakan
 * dan apapun struktur skema yang kita buat, semua harus masuk ke type Query agar dapat digunakan, jika tidak maka query tidak dapat dijalankan, struktur memang terbentuk tapi tidak dapat digunakan
 */

/**
 * 4. berikutnya adalah merelasikan struktur skema category dengan product, pertama masukkan products (plural karena product dalam satu kategori bisa lebih dari 1) ke Category
 * setelah dimasukkan, muncul pertanyaan, karena pada dasarnya tiap ada query baru kita akan resolve di query resolver, karena product terkait didalam category ada didalam Category, kita resolve nya dimana?
 */
const typeDef = gql`
  type Query {
    hello: String
    products: [Product!]!
    product(id: ID!): Product
    categories: [Category!]!
    category(id: ID!): Category
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    quantity: Int!
    price: Float!
    image: String!
    onSale: Boolean!
  }

  type Category {
    id: ID!
    name: String!
    products: [Product!]!
  }
`;

/**
 * 2. setelah mendefinikan typeDef baru tentu berikutnya mendefinisikan resolvernya, apa yang harus dikirimkan jika typeDef tersebut diminta
 */
/**
 * 3. berikutnya sama seperti pencarian satu product, disini diinginkan jika product termasuk dalam satu kategori maka tampilkan semua product tersebut
 * tapi pertama coba dulu samakan dengan pencarian product
 * karena ini js, ingat js punya fitur destruktur jadi tidak perlu lagi const id = args.id, cukup const { id } = args sudah bisa mengambil variable id dari dalam object args
 */
/**
 * 5. sama saja seperti query resolver, hanya disini kita buat resolver baru sebut saja Category (karena product yang diambil berdasarkan category yang dimiliki)
 * kemudian tambahkan products didalamnya dan mulai proses resolve
 * sama seperti pada mysql dimana kita butuh foreign key untuk menyatakan relasi, di graphql juga perlu "foreign key" tersebut, tambahkan foreign key  pada semua product yang ada
 * konsep relasinya adalah kita ingin menampilkan semua product yang memiliki kategori yang sama, dan sudah kita tetapkan juga bahwa "products" ada didalam "Category"
 * disini, Category adalah parent dan products adalah child nya
 * kita menggunakan args untuk untuk mencari satu category, kemudian untuk mencari product yang berelasi kita menggunakan parameter parent untuk mendapat id dari category yang kemudian dapat digunakan untuk mencari product dengan category tersebut
 * untuk menampilkan data product yang berelasi dengan category kita menggunakan fungsi .filter()
 * code yang digunakan sama saja saat melakukan pencarian, hanya berbeda fungsi yang digunakan saja
 */
const resolver = {
  Query: {
    hello: () => {
      return "Dunia!";
    },
    products: () => {
      return products;
    },
    product: (parent, args, context) => {
      const { id } = args;
      return products.find((product) => product.id === id);
    },
    categories: () => {
      return categories;
    },
    category: (parent, args, context) => {
      const { id } = args;
      return categories.find((category) => category.id === id);
    },
  },
  Category: {
    products: (parent, args, context) => {
      const { id } = parent;
      return products.filter((product) => product.categoryId === id);
    },
  },
};

startApolloServer(typeDef, resolver);

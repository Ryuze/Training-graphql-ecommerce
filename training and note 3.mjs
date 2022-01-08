import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";

const products = [
  {
    id: "53a0724c-a416-4cac-ae45-bfaedce1f147",
    name: "Steel Pot",
    description: "Silver steel pot that is perfect for cooking",
    quantity: 230,
    price: 42.44,
    image: "img-1",
    onSale: false,
  },
  {
    id: "c2af9adc-d0b8-4d44-871f-cef66f86f7f6",
    name: "Salad Bowl",
    description: "Round wooden bowl perfect for tossing and making salads",
    quantity: 33,
    price: 53.5,
    image: "img-2",
    onSale: false,
  },
  {
    id: "2c931e7e-510f-49e5-aed6-d6b44087e5a1",
    name: "Spoon",
    description: "Small and delicate spoon",
    quantity: 4266,
    price: 1.33,
    image: "img-3",
    onSale: true,
  },
  {
    id: "404daf2a-9b97-4b99-b9af-614d07f818d7",
    name: "Shovel",
    description: "Grey rounded shovel for digging",
    quantity: 753,
    price: 332,
    image: "img-4",
    onSale: false,
  },
  {
    id: "6379c436-9fad-4b3f-a427-2d7241f5c1b1",
    name: "Fertilizer",
    description: "Nitrogen based fertitlizer",
    quantity: 53453,
    price: 23.11,
    image: "img-5",
    onSale: true,
  },
  {
    id: "f01bcdec-6783-464e-8f9e-8416830f7569",
    name: "Basketball",
    description: "Outdoor or indoor basketball",
    quantity: 128,
    price: 59.99,
    image: "img-6",
    onSale: true,
  },
  {
    id: "a4824a31-5c83-42af-8c1b-6e2461aae1ef",
    name: "Golf Clubs",
    description: "Good for golfing",
    quantity: 3,
    price: 427.44,
    image: "img-7",
    onSale: false,
  },
  {
    id: "b553085a-a7e0-4c9b-8a12-f971919c3683",
    name: "Baseball Gloves",
    description: "Professional catcher gloves",
    quantity: 745,
    price: 77.0,
    image: "img-8",
    onSale: true,
  },
  {
    id: "47bf3941-9c8b-42c0-9c72-7f3985492a5b",
    name: "Soccer Ball",
    description: "Round ball",
    quantity: 734,
    price: 93.44,
    image: "img-9",
    onSale: false,
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

// 1. Disini dideklarasikan tipe object baru yaitu Product. cara mendapatkan data dalam objek tersebut dengan menyertakannya kedalam skema dalam query
/*
3. products ini bekerja dengan menampilkan seluruh isi object Product, bagaimana jika hanya ingin menampilkan salah satu isi object dari Product saja?
caranya adalah pertama deklarasikan skema satuan yaitu product (tanpa plural) yang menampilkan isi object Product
kemudian setelah deklarasi skema product, berikan tambahan jika dibutuhkan satu unique identifier untuk menjalankan skema product tersebut, apa lagi data yang unik selain id
dilihat id dapat diberi rule berupa skalar, tapi lebih baik jika digunakan ID dari pada String, sama saja hanya agar tidak bingung
*/
const typeDef = gql`
  type Query {
    hello: String
    products: [Product!]!
    product(id: ID!): Product
  }

  type Product {
    name: String!
    description: String!
    quantity: Int!
    price: Float!
    image: String!
    onSale: Boolean!
  }
`;

/*
2. products disini me-return object didalam Product dengan ketentuan yang berlaku didalam object tersebut
berbeda dengan skema pada hello, karena products berisi object Product maka dibutuhkan properti tambahan yaitu apa yang mau diminta
*/
/**
 * 4. resolver yang digunakan pada skema product tentu akan sangat berbeda dari sebelumnya, karena harus melakukan cek terlebih dahulu sebelum data yang dicari dikirimkan
 * resolver sendiri memiliki 3 parameter yang dapat digunakan, parent, args, dan context. untuk saat ini fokus ke args karena args ini adalah object yang berisi semua parameter yang kita suplai
 * intinya sama seperti logika pencarian pada umumnya, anggap ini metode pencarian pada js
 * lihat pada resolver product, konsepnya adalah pertama dapatkan id dari args yang kita berikan, kemudian gunakan pencarian pada skema yang ingin digunakan (disini data dicari dari skema products) dengan fungsi bawaan .find()
 * didalam .find() diberikan anon function dengan parameter bernama product, disini akan dilakukan loop sebanyak data yang ada, dan tiap object data akan disimpan sementara pada parameter product
 * jika product.id sama dengan productId maka const product akan diisi dengan variable sementara product tersebut dan proses berhenti
 * jika ternyata ada 2 atau lebih item yang memiliki id sama, maka item paling pertama yang akan diambil
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
      const productId = args.id;

      const product = products.find((product) => product.id === productId);

      if (!product) {
        return null;
      }

      return product;
    },
  },
};

startApolloServer(typeDef, resolver);

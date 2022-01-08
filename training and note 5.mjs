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
 * 1. ok, sebelumnya kita berhasil mendapatkan products yang memiliki relasi dengan category, bagaimana jika dilakukan sebaliknya?
 * kasusnya disini adalah kita ingin mendapat category id dan category name dari satu product, cara yang digunakan sama seperti saat kita melakukan relasi antara category dengan product
 * pertama tambahkan category kedalam skema Product, jika sebelumnya di Category kita meminta array (one to many), di Product kita meminta hanya satu string saja (one to one)
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
    category: Category
  }

  type Category {
    id: ID!
    name: String!
    products: [Product!]!
  }
`;

/**
 * 2. tentu setelah ditambahkan kedalam skema berikutnya yang dilakukan adalah memberikan resolvernya
 * sama seperti resolver Category sebelumnya, karena didalam object Product ada object lainnya yaitu Category maka kita buat resolver baru sebut saja Product dengan code sama seperti pada Category sebelumnya
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
  Product: {
    category: (parent, args, context) => {
      const { categoryId } = parent;
      return categories.find((category) => category.id === categoryId);
    },
  },
};

startApolloServer(typeDef, resolver);

import { v4 as uuidv4 } from "uuid";

export const Mutation = {
  addCategory: (parent, args, context) => {
    const { input } = args;
    const { db } = context;
    const newCategory = {
      id: uuidv4(),
      name: input.name,
    };

    db.categories.push(newCategory);
    return newCategory;
  },
  addProduct: (parent, args, context) => {
    const { input } = args;
    const { name, description, quantity, price, image, onSale, categoryId } =
      input;
    const { db } = context;

    const newProduct = {
      id: uuidv4(),
      categoryId: categoryId,
      name: name,
      description: description,
      quantity: quantity,
      price: price,
      image: image,
      onSale: onSale,
    };

    db.products.push(newProduct);
    return newProduct;
  },
  addReview: (parent, args, context) => {
    const { input } = args;
    const { date, title, comment, rating, productId } = input;
    const { db } = context;

    const newReview = {
      id: uuidv4(),
      date: date,
      title: title,
      comment: comment,
      rating: rating,
      productId: productId,
    };

    db.reviews.push(newReview);
    return newReview;
  },
  deleteCategory: (parent, args, context) => {
    const { id } = args;
    let { db } = context;

    db.categories = db.categories.filter((category) => category.id !== id);
    db.products = db.products.map((product) => {
      if (product.categoryId === id) {
        return {
          ...product,
          categoryId: null,
        };
      }
      return product;
    });

    return true;
  },
  deleteProduct: (parent, args, context) => {
    const { id } = args;
    let { db } = context;

    db.products = db.products.filter((product) => product.id !== id);
    db.reviews = db.reviews.filter((review) => review.productId !== id);

    return true;
  },
  deleteReview: (parent, args, context) => {
    const { id } = args;
    let { db } = context;

    db.reviews = db.reviews.filter((review) => review.id !== id);

    return true;
  },
  updateCategory: (parent, args, context) => {
    const { id, input } = args;
    let { db } = context;

    const index = db.categories.findIndex((category) => category.id === id);
    
    if (index === -1) {
        return null
    }

    db.categories[index] = {
      ...db.categories[index],
      ...input,
    };

    return db.categories[index];
  },
  updateProduct: (parent, args, context) => {
    const { id, input } = args;
    let { db } = context;

    const index = db.products.findIndex((product) => product.id === id);

    if (index === -1) {
        return null
    }

    db.products[index] = {
      ...db.products[index],
      ...input,
    };

    return db.products[index];
  },
  updateReview: (parent, args, context) => {
    const { id, input } = args;
    let { db } = context;

    const index = db.reviews.findIndex((review) => review.id === id);

    if (index === -1) {
        return null
    }
    
    db.reviews[index] = {
      ...db.reviews[index],
      ...input,
    };

    return db.reviews[index];
  },
};

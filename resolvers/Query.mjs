export const Query = {
  hello: (parent, args, context) => {
    return "Dunia!";
  },
  products: (parent, args, context) => {
    const { db } = context;
    const { filter } = args;
    let filteredProducts = db.products;

    if (filter) {
      const { onSale, avgRating } = filter;
      if (onSale) {
        filteredProducts = filteredProducts.filter(
          (product) => product.onSale === onSale
        );
      }

      if (avgRating) {
        const rating = Math.abs(Math.floor(avgRating));
        if (rating >= 1 && rating <= 5) {
          filteredProducts = filteredProducts.filter((product) => {
            let productRatingReviews = db.reviews.filter(
              (review) => review.productId === product.id
            );
            productRatingReviews =
              productRatingReviews.reduce((accumulator, item) => {
                return accumulator + item.rating;
              }, 0) / productRatingReviews.length;

            return productRatingReviews >= rating
          });
        }
      }
    }

    return filteredProducts;
  },
  product: (parent, args, context) => {
    const { id } = args;
    const { db } = context;
    return db.products.find((product) => product.id === id);
  },
  categories: (parent, args, context) => {
    const { db } = context;
    return db.categories;
  },
  category: (parent, args, context) => {
    const { id } = args;
    const { db } = context;
    return db.categories.find((category) => category.id === id);
  },
};

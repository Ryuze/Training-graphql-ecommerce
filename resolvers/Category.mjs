export const Category = {
  products: (parent, args, context) => {
    const { id } = parent;
    const { db } = context;
    const { filter } = args;

    let filteredCategoryProducts = db.products.filter(
      (product) => product.categoryId === id
    );

    if (filter) {
      const { onSale, avgRating } = filter;
      if (onSale) {
        filteredCategoryProducts = filteredCategoryProducts.filter(
          (product) => product.onSale === onSale
        );
      }

      if (avgRating) {
        const rating = Math.abs(Math.floor(avgRating));
        if (rating >= 1 && rating <= 5) {
          filteredCategoryProducts = filteredCategoryProducts.filter((product) => {
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

    return filteredCategoryProducts;
  },
};

import { createAdminApiClient } from "@shopify/admin-api-client";

import * as dotenv from "dotenv";
dotenv.config();

// Easily change the number of items per page
const ITEMS_PER_PAGE = 100;

const client = createAdminApiClient({
  storeDomain: process.env.SHOPIFY_DOMAIN,
  apiVersion: "2024-04",
  accessToken: process.env.SHOPIFY_ADMIN_TOKEN,
});

// Fetch products by keyword
export const fetchProductsByKeyword = async (keyword) => {
  const products = [];
  let currentCursor = "";

  while (1) {
    // If there is a cursor, we will use it to fetch the next page
    const afterQuery = currentCursor ? `, after: "${currentCursor}"` : "";

    // Construct the query
    const operation = `
        query ProductsQuery {
            products(query: "${keyword}", first: ${ITEMS_PER_PAGE}${afterQuery}) {
                edges {
                    node {
                        id
                        title
                    }
                }
                pageInfo {
                  endCursor
                  hasNextPage
                }
            }
        }
    `;

    // Execute the query
    const { data, errors } = await client.request(operation);

    // If there are errors, we will log them and throw an error
    if (errors) {
      console.error(errors);
      throw new Error(errors.message);
    }

    // Add the products to the products array
    products.push(...data.products.edges.map((edge) => edge.node));

    // If there are no more pages, we will break the loop
    if (!data.products.pageInfo.hasNextPage) {
      break;
    }

    // Update the cursor
    currentCursor = data.products.pageInfo.endCursor;
  }

  return products;
};

// Fetch product variants for the given product ids
export const fetchProductVariantsByProductIds = async (productIds) => {
  const productVariants = [];
  let currentCursor = "";

  while (1) {
    // If there is a cursor, we will use it to fetch the next page
    const afterQuery = currentCursor ? `, after: "${currentCursor}"` : "";

    // Construct the query
    const operation = `
        query ProductVariantsQuery {
            productVariants(query: "product_ids:${productIds.join(
              ","
            )}", first: ${ITEMS_PER_PAGE}${afterQuery}) {
                edges {
                    node {
                        id
                        displayName
                        price
                        product {
                          id
                          title
                        }
                        title
                    }
                }
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
        }`;

    // Execute the query
    const { data, errors } = await client.request(operation);

    // If there are errors, we will log them and throw an error
    if (errors) {
      console.error(errors);
      throw new Error(errors.message);
    }

    // Add the product variants to the productVariants array
    productVariants.push(
      ...data.productVariants.edges.map((edge) => edge.node)
    );

    // If there are no more pages, we will break the loop
    if (!data.productVariants.pageInfo.hasNextPage) {
      break;
    }

    // Update the cursor
    currentCursor = data.productVariants.pageInfo.endCursor;
  }

  // Return the product variants
  return productVariants;
};

export const fetchShopInformation = async () => {
  const operation = `
    query {
      shop {
        name
        currencyCode
      }
    }
  `;

  const { data, errors } = await client.request(operation);

  if (errors) {
    console.error(errors);
    throw new Error(errors.message);
  }

  return data.shop;
};

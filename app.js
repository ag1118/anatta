import { Command } from "commander";
import {
  fetchProductsByKeyword,
  fetchProductVariantsByProductIds,
  fetchShopInformation,
} from "./shopify-admin-api.js";
import { formatMoney } from "./currency.js";

const program = new Command();

program
  .name("Anatta Shopify Product CLI")
  .description("CLI to get product information from Shopify API")
  .version("0.0.1")
  .option(
    "-n, --name <name>",
    "Optional product name to search for the products",
    ""
  );

program.parse();

const options = program.opts();
const { name } = options;

(async () => {
  try {
    const shop = await fetchShopInformation();

    const products = await fetchProductsByKeyword(name);

    const productIds = products.map((product) => product.id.split("/").pop());

    const productVariants = await fetchProductVariantsByProductIds(productIds);

    // Sort product variants by price
    productVariants.sort((a, b) => a.price - b.price);

    for (const productVariant of productVariants) {
      console.log(
        `${productVariant.product.title} - Variant ${
          productVariant.title
        } - Price ${formatMoney(productVariant.price, shop.currencyCode)}`
      );
    }
  } catch (error) {
    console.error(error);
  }
})();

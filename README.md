# Anatta Shopify Product CLI

## Prerequisites

Node.js >= 18

## Installation

```bash
npm run install
```

Fill in the shopify domain, and admin access token in `.env` file.

## Run the script

- Help
  ```bash
  node app.js --help
  ```
- Get all variants
  ```bash
  node app.js
  ```
- Get variants by product name
  ```
  node app.js --name shirt
  ```

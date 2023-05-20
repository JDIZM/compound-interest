module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true
  },
  extends: [
    // By extending from a plugin config, we can get recommended rules without having to add them manually.
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:@typescript-eslint/recommended",
    // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
    // Make sure it's always the last config, so it gets the chance to override other configs.
    "eslint-config-prettier",
    "prettier"
  ],
  settings: {
    // Tells eslint how to resolve imports
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
        extensions: [".ts", ".js", ".jsx", ".tsx", ".json"]
      },
      node: {
        paths: ["./src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    }
  },
  rules: {
    // Add your own rules here to override ones from the extended configs.
    "@typescript-eslint/no-explicit-any": "warn"
  },
  overrides: [
    {
      files: ["**/__mocks__/*", "**/*.{test,tests}.{ts,tsx}"], // Feels unnecessary to enforce these rules in tests
      rules: {
        "@typescript-eslint/no-unused-vars": 0,
        "@typescript-eslint/no-explicit-any": 0
      }
    }
  ]
};

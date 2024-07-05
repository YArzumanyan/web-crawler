module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  plugins: ["prettier"],
  parserOptions: { sourceType: "module" },
  rules: {
    "prettier/prettier": "error"
  },
};

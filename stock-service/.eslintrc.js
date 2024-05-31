module.exports = {
  env: {
      browser: true,
      es2021: true,
      jest: true
  },
  extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier"
  ],
  overrides: [
      {
          env: {
              node: true
          },
          files: [".eslintrc.{js,cjs}"],
          parserOptions: {
              sourceType: "script"
          }
      }
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  rules: {"@typescript-eslint/typescript-estree/unsupported-features": "off"}
}

// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/recommended',
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    'generator-star-spacing': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-unused-vars": ["warn", { "args": "none" }],
    "no-empty": "warn",
    "no-console": "warn",
    "object-curly-spacing": ["error", "always"],
    "no-lonely-if": ["error"],
    "space-in-parens": ["error", "never"],
    "eqeqeq": ["error", "always"],
    "space-before-blocks": ["error", "always"]
  }
}

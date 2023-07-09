module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
        "order/properties-alphabetical-order": 0,
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "no-undef": "off",
        "@typescript-eslint/no-unused-vars": 'error',
        "@typescript-eslint/no-unused-vars": "off",
        " @typescript-eslint/no-var-requires": "off",
        "react/no-unescaped-entities": "off",
        "no-dupe-keys": "off",
        "@typescript-eslint/no-var-requires": "off",
    },
    "settings": {
        "react": {
          "version": "18.2.0"
        }
      }
           
}

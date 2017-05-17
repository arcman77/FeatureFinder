module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "rules": {
        "comma-dangle": 0,
        "valid-jsdoc": 0,
        "eqeqeq": 0,
        "dot-notation": 0,
        "spaced-comment": 0,
        "no-var": 0,
        "import/no-mutable-exports": 0,
        "indent": ["error", 4],
        "space-before-function-paren": 0,
        "import/no-named-as-default": 0,
        "import/no-named-as-default-member": 0,
        "no-bitwise": 0,
        "object-shorthand": 0,
        "no-console": 0,
        "no-param-reassign": [2, { "props": false }],
        "quote-props": 0,
        "consistent-return": 0,
        "guard-for-in": 0,
        "no-plusplus": 0
    },
    "env": {
        "browser": true,
        "jquery": true
    },
    "globals": {
        "Vue": true,
        "videojs": true
    }
};

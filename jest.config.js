module.exports = {
  "roots": ["."],
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!xbr-js)/'
  ]
};

const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  productionSourceMap: false, // fix security issue
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin(),
    ],
  },
};

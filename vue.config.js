const LicensePlugin = require('webpack-license-plugin');

module.exports = {
  publicPath: './',
  configureWebpack: {
    plugins: [
      new LicensePlugin(),
    ],
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "ぴくせるすけゐらぁ",
        appId: "net.nononotyaya.pixel-scaler",
        win: {
          icon: 'public/favicon.ico',
          target: [
            {
              target: 'portable',
              arch: ['x64'],
            }
          ],
        },
        mac: {
          icon: 'public/logo.png',
          target: 'zip',
        },
      }
    }
  }
};

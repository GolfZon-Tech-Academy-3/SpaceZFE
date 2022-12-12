const { defineConfig } = require('@vue/cli-service')
var fs = require('fs');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: 'https://spacez3.shop/',
  }
})


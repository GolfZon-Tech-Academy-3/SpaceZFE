const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    // proxy: "https://spacez3.shop/",
    // https: {
    //   key: fs.readFileSync("../ssl/domain.com.key"),
    //   cert: fs.readFileSync("../ssl/domain.com.crt"),
    //   ca: fs.readFileSync("../ssl/rootca.crt"),
    // },
  },
});

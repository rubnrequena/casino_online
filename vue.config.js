const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  publicPath: "",
  transpileDependencies: ["vuetify"],
  runtimeCompiler: true,
  productionSourceMap: false,
};

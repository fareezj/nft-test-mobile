const defaultAssetExts =
  require("metro-config/src/defaults/defaults").assetExts;
module.exports = {
  resolver: {
    sourceExts: ["js", "jsx", "json", "ts", "tsx", "cjs"],
    assetExts: ["glb", "gltf", "png", "jpg", "xjpg", "xpng"],
  },
};

const fs = require("fs");

const cache = {};
const cachePath = __dirname + "/cache.json";

// Call back APIs which automatically write and read into a .json file - example implementation
const beforeCacheAccess = async (cacheContext) => {
  cacheContext.tokenCache.deserialize(await fs.readFile(cachePath, "utf-8"));
};

const afterCacheAccess = async (cacheContext) => {
  if (cacheContext.cacheHasChanged) {
    await fs.writeFile(cachePath, cacheContext.tokenCache.serialize());
  }
};

const cachePlugin = {
  beforeCacheAccess,
  afterCacheAccess,
};

module.exports = cachePlugin;

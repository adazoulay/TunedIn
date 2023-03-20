const fetch = require("node-fetch");
const { inspect } = require("util");

const getMetadata = async (url, type) => {
  const { parseBuffer } = await import("music-metadata");
  try {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const metadata = await parseBuffer(buffer, type);
    return metadata;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = { getMetadata };

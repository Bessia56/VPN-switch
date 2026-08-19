const fs = require("fs");
const YAML = require("yaml");

const file = fs.readFileSync("./config.yaml", "utf8");

const config = YAML.parse(file);

module.exports = config;
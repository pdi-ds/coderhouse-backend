const Container = require("./class");
const data = require("./data");

const products = new Container("./data.txt");
products.save(data);
products.getById(2);
products.getAll();
products.deleteById(2);
products.deleteAll();

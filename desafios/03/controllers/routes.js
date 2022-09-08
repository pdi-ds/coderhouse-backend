const Container = require("../class/container");
const file = new Container("./database/data.txt");
const getProductsFromDB = file.getAll();
const getProducts = async (req, res) => {
  const result = await getProductsFromDB;
  res.json(result);
};
const getProductRandom = async (req, res) => {
  const result = await getProductsFromDB;
  const randomProduct = result[Math.floor(Math.random() * result.length)];
  res.json(randomProduct);
};
const getStartPage = (req, res) => {
  res.send(
    "/products to see all products, /randomProduct to see a random product."
  );
};

module.exports = { getProducts, getProductRandom, getStartPage };

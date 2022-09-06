const fs = require("fs");

class Container {
  constructor(file) {
    this.file = file;
  }
  async save(object) {
    try {
      for (let i = 0; i < object.length; i++) {
        object[i].id = 1 + i;
      }
      console.log(`${object.length} products have been saved`);
      await fs.promises.writeFile(this.file, JSON.stringify(object));
    } catch (error) {
      throw new Error(error, "An error occurred saving the product");
    }
  }
  async getById(id) {
    try {
      const content = await this.getAll();
      let idFound = content.find((prod) => prod.id === id);
      console.log(idFound);
    } catch (error) {
      throw new Error(error, "An error occurred while getting the object ID");
    }
  }
  async getAll() {
    try {
      let content = await fs.promises.readFile(this.file, "utf-8");
      console.log(content);
      return JSON.parse(content);
    } catch (error) {
      throw new Error(error, "An error occurred while getting all objects");
    }
  }
  async deleteById(id) {
    try {
      const content = await this.getAll();
      const deleted = content.filter((producto) => producto.id !== id);
      await fs.promises.writeFile(this.file, JSON.stringify(deleted, null, 4));
      console.log("Removed");
    } catch (error) {
      throw new Error(
        error,
        "An error has occurred when deleting the product by ID"
      );
    }
  }
  async deleteAll() {
    try {
      await fs.promises.writeFile(this.file, []);
      console.log("All objects have been removed");
    } catch (error) {
      throw new Error(error, "An error occurred while deleting all objects");
    }
  }
}

module.exports = Container;

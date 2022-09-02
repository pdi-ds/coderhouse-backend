class User {
  first_name = "";
  last_name = "";
  books = [];
  pets = [];
  constructor(first_name, last_name, books, pets) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.books = books;
    this.pets = pets;
  }
  getFullName() {
    return `${this.first_name} ${this.last_name}`;
  }
  addPet(pet) {
    this.pets.push(pet);
  }
  countPets() {
    return this.pets.length;
  }
  addBook(book) {
    this.books.push(book);
  }
  getBooksNames() {
    return this.books.map((book) => book.name);
  }
}
const user = new User(
  "Derek",
  "Robinson",
  [
    {
      name: "Grid Systems in Graphic Design",
      author: "Josef Müller-Brockmann",
    },
  ],
  ["Cat"]
);
user.addPet("Dog");
user.addBook({ name: "Interaction of color", author: "Josef Albers" });
["getFullName", "countPets", "getBooksNames"].forEach((method) =>
  console.log(`${method} ->`, user[method]())
);

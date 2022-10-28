```
use ecommerce
db.createCollection('products')
db.createCollection('messages')
```

```
db.products.insertMany([
    { name : 'Producto 1',  price : 5000, thumbnail : 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png' },
    { name : 'Producto 2',  price : 300,  thumbnail : 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png' },
    { name : 'Producto 3',  price : 2700, thumbnail : 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png' },
    { name : 'Producto 4',  price : 1350, thumbnail : 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png' },
    { name : 'Producto 5',  price : 3475, thumbnail : 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png' },
    { name : 'Producto 6',  price : 4560, thumbnail : 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png' },
    { name : 'Producto 7',  price : 1450, thumbnail : 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png' },
    { name : 'Producto 8',  price : 2870, thumbnail : 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png' },
    { name : 'Producto 9',  price : 135,  thumbnail : 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png' },
    { name : 'Producto 10', price : 2585, thumbnail : 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png' }
])
```

```
db.messages.insertMany([
    { from : 'email@domain.com', message : 'Mensaje 1',  date : Timestamp() },
    { from : 'email@domain.com', message : 'Mensaje 2',  date : Timestamp() },
    { from : 'email@domain.com', message : 'Mensaje 3',  date : Timestamp() },
    { from : 'email@domain.com', message : 'Mensaje 4',  date : Timestamp() },
    { from : 'email@domain.com', message : 'Mensaje 5',  date : Timestamp() },
    { from : 'email@domain.com', message : 'Mensaje 6',  date : Timestamp() },
    { from : 'email@domain.com', message : 'Mensaje 7',  date : Timestamp() },
    { from : 'email@domain.com', message : 'Mensaje 8',  date : Timestamp() },
    { from : 'email@domain.com', message : 'Mensaje 9',  date : Timestamp() },
    { from : 'email@domain.com', message : 'Mensaje 10', date : Timestamp() }
  ])
```

```
db.products.find()
db.messages.find()
```

```
db.products.countDocuments()
db.messages.countDocuments()
```

```
db.products.insertOne({ name : 'Producto 11',  price : 5000, thumbnail : 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png' })
```

```
db.products.find({ price : { $lt : 1000 } })
```

```
db.products.find({ price : { $gt : 1000,  $lt : 3000 } })
```

```
db.products.find({ price : { $gt : 3000 } })
```

```
db.products.find({}, { name : 1, _id : 0 }).sort({ price : 1 }).skip(2).limit(1)
```

```
db.products.updateMany({}, { $set : { stock : 100 } })
```

```
db.products.updateMany({ price : { $gt : 4000 } }, { $set : { stock : 0 } })
```

```
db.products.deleteMany({ price : { $lt : 1000 } })
```

```
db.createUser({ user : 'pepe', pwd : 'asd456', roles : [{ role : 'read', db : 'ecommerce' }] })
```

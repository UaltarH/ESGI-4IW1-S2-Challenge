const Roles = [
    {
        id: 1,
        name: "admin",
        description: "Administrator",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        name: "user",
        description: "Regular User",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

const Users = [
    {
        id: 1,
        username: "admin",
        email: "admin@admin.admin",
        password: "admin",
        birthdate: new Date(),
        address: "1 rue de l'admin",
        zipcode: "12345",
        city: "Adminville",
        country: "France",
        phone: "0123456789",
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 2,
        username: "user1",
        email: "user1@user.user",
        password: "user1",
        birthdate: new Date(),
        address: "1 rue de l'user",
        zipcode: "54321",
        city: "Userville",
        country: "France",
        phone: "9876543210",
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 3,
        username: "user2",
        email: "user2@user.user",
        password: "user2",
        birthdate: new Date(),
        address: "2 rue de l'user",
        zipcode: "54321",
        city: "Userville",
        country: "France",
        phone: "0111111111",
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const Products = [
    {
        productId: 0,
        name: "Produit A",
        description: "Description du produit A",
        price: 10.00,
        stock: 50,
        categoryId: 1,
        brandId: 1,
    },
    {
        productId: 1,
        name: "Produit B",
        description: "Description du produit B",
        price: 20.00,
        stock: 30,
        categoryId: 2,
        brandId: 2,
    },
    {
        productId: 2,
        name: "Produit C",
        description: "Description du produit C",
        price: 15.00,
        stock: 20,
        categoryId: 3,
        brandId: 3,
    },
    {
        productId: 3,
        name: "Produit D",
        description: "Description du produit D",
        price: 25.00,
        stock: 10,
        categoryId: 4,
        brandId: 1,
    },
    {
        productId: 4,
        name: "Produit E",
        description: "Description du produit E",
        price: 30.00,
        stock: 5,
        categoryId: 5,
        brandId: 2,
    },
];

module.exports = {Roles, Users, Products};

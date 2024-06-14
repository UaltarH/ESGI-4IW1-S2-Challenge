export const Roles = [
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

export const Users = [
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


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
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 2,
        username: "user1",
        email: "user1@user.user",
        password: "user1",
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 3,
        username: "user2",
        email: "user2@user.user",
        password: "user2",
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];


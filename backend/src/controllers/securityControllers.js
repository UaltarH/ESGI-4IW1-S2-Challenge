import {Roles, Users} from "../mock/data.js";

export class SecurityController {
    static getRoles(_request, response) {
        response.json({
            success: true,
            message: "All Roles",
            data: Roles
        });
    }
    static getUsers(_request, response) {
        response.json({
            success: true,
            message: "All Users",
            data: Users
        });
    }
    static getUser(request, response) {
        const {id} = request.params;
        const user = Users.find(user => user.id === parseInt(id));
        if (user) {
            response.json({
                success: true,
                message: `User with id ${id}`,
                data: user
            });
        } else {
            response.status(404).json({
                success: false,
                message: `User with id ${id} not found`,
                data: null
            });
        }
    }
    static deleteUser(request, response) {
        const {id} = request.params;
        const user = Users.find(user => user.id === parseInt(id));
        if (user) {
            response.json({
                success: true,
                message: `User with id ${id} deleted`,
                data: user
            });
        } else {
            response.status(404).json({
                success: false,
                message: `User with id ${id} not found`,
                data: null
            });
        }
    }
    static register(request, response) {
        console.log(request);
        const data = request.body;
        // request body format
        // {
        //     "success": true,
        //     "message": "User registered",
        //     "data": {
        //     "name": "Test",
        //         "firstname": "Test",
        //         "email": "test@test.com",
        //         "password": "azer1234AZER!",
        //         "passwordConfirmation": "azer1234AZER!",
        //         "birthdate": "2006-01-01",
        //         "address": "1 rue de la paix
        //         "zipcode": "75008",
        //         "city": "Paris",
        //         "country": "France",
        //         "phone": "0123456788"
        //     }
        // }
        const user = {
            id: Users.length + 1,
            username: data["name"] + " " + data["firstname"],
            email: data["email"],
            password: data["password"],
            birthdate: data["birthdate"],
            address: data["address"],
            zipcode: data["zipcode"],
            city: data["city"],
            country: data["country"],
            phone: data["phone"],
            roleId: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        Users.push(user);
        response.json({
            success: true,
            message: `User ${data["name"]} ${data["firstname"]} registered`,
            data: user
        });
    }
}
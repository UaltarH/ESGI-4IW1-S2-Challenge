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
}
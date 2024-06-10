import {Roles} from "../mock/data.js";

export class SecurityController {
    static getRoles(_request, response) {
        response.json({
            success: true,
            message: "All Roles",
            data: Roles
        });
    }
}
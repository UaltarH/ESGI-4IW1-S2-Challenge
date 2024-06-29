const {Roles, Users} = require("../mock/data.js");

class SecurityController {
    static mockGetRoles(_request, response) {
        response.json({
            success: true,
            message: "All Roles",
            data: Roles
        });
    }
    static async getUsers(_request, response) {
        response.json(Users);
    }
    static async getUser(request, response) {
        const {id} = request.params;
        const user = Users.find(user => user.id === parseInt(id));
        if (user) {
            response.json({
                success: true,
                message: `User with id ${id}`,
                data: user
            });
        } else response.sendStatus(404);
    }
    static mockDeleteUser(request, response) {
        const {id} = request.params;
        const user = Users.find(user => user.id === parseInt(id));
        if (user) response.status(204); // 204 : No Content
        else response.status(404);
    }
    // TODO : encoder l'email en urlencoded eg : email+groupe1@gmail.com, filter les données, filtrer role de l'utilisateur
    static async mockCreate(request, response, next) {
        console.log(request);
        try {
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
            // TODO : remove success, si jamais on veut envoyer un lien pour la page suivante ou précédente, utiliser la norme HATEOAS
            // note : error 422 : erreur de validation
            response.status(201).json({
                message: `User ${data["name"]} ${data["firstname"]} registered`,
                data: user
            });
        } catch (e) {
            next(e);
        }
    }
}
module.exports = {SecurityController};
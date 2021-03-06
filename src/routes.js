/*
GET: buscar informações do backend, como listas.
POST: Criar informações no backend, como o cadastro.
PUT: Modificar informações, como alterar o endereço.
DELETE: Deletar informações, como excluír usuário.

netstat -ano | findstr :<PORT>

requisição: Retorna um status:
200 - Deu tudo certo
400 - Erro do cliente
500 - Erro de servidor
*/
const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");
const UserValidator = require("./validators/UserValidator");

const auth = require("./middlewares/authentication");

const SessionController = require("./controllers/SessionController");

//Session
routes.post("/login", SessionController.signIn);

//User
routes.get(
  "/user",
  UserValidator.getById,
  auth.authenticateToken,
  UserController.profile
);
routes.post("/user", UserValidator.create, UserController.create);
routes.put(
  "/user",
  UserValidator.update,
  auth.authenticateToken,
  UserController.update
);
routes.delete(
  "/user/:user_id",
  UserValidator.delete,
  auth.authenticateToken,
  UserController.delete
);

routes.post("/forgotPassword", UserValidator.forgot, UserController.forgot);

module.exports = routes;

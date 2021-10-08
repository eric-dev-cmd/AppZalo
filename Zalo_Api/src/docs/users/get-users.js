module.exports = {
  get: {
    tags: ["User CRUD operations"],
    description: "Get users",
    operationId: "getUsers",
    summary: "Returns the list of all the users",
    parameters: [],
    responses: {
      200: {
        description: "Users were obtained",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UserModel",
            },
          },
        },
      },
    },
  },
};

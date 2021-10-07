module.exports = {
  delete: {
    tags: ["User CRUD operations"],
    description: "Deleting a user",
    operationId: "deleteUser",
    summary: "Remove the user by id",
    parameters: [
      {
        name: "id",
        in: "path",
        schema: {
          $ref: "#/components/schemas/_id",
        },
        required: true,
        description: "Deleting a done user",
      },
    ],
    responses: {
      200: {
        description: "User deleted successfully",
      },
      404: {
        description: "User not found",
      },
      500: {
        description: "Server error",
      },
    },
  },
};

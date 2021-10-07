module.exports = {
  put: {
    tags: ["User CRUD operations"],
    description: "Update user",
    operationId: "updateUser",
    summary: "update the user by id",
    parameters: [
      {
        name: "id",
        in: "path",
        schema: {
          $ref: "#/components/schemas/_id",
        },
        required: true,
        description: "Id of user to be updated",
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UserModel",
          },
        },
      },
    },

    responses: {
      200: {
        description: "Todo updated successfully",
      },
      404: {
        description: "Todo not found",
      },
      500: {
        description: "Server error",
      },
    },
  },
};

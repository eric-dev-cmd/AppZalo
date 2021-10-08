module.exports = {
  post: {
    tags: ["User CRUD operations"],
    description: "Create user",
    operationId: "createUser",
    summary: "Create a new user",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UserInput",
          },
        },
      },
    },
    responses: {
      201: {
        description: "User created successfully",
      },
      500: {
        description: "Server error",
      },
    },
  },
};

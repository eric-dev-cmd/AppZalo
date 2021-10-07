module.exports = {
  components: {
    schemas: {
      _id: {
        type: "string",
        description: "An id of a user",
      },
      UserModel: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "id of user",
            example: "6149357c7b66e0761551e2f8",
          },
          local: {
            type: "object",
            properties: {
              phone: {
                type: "string",
                description: "phone of user",
                example: "0987059059",
              },
              password: {
                type: "string",
                description: "password of user",
                example: "1",
              },
            },
          },
          userName: {
            type: "string",
            description: "name of user",
            example: "Cat Luynh",
          },
          gender: {
            type: "string",
            description: "gender of user",
            example: "female",
          },
          birthday: {
            type: "string",
            description: "birthday of user",
            example: "22/10/1999",
          },
          gender: {
            type: "string",
            description: "gender of user",
            example: "female",
          },
          address: {
            type: "string",
            description: "gender of user",
            example: "HCM",
          },
          avatar: {
            type: "string",
            description: "avatar of user",
            example: "avatar.default.jpg",
          },
          role: {
            type: "string",
            description: "role of user",
            example: "user or admin",
          },
          createdAt: {
            type: "Number",
            description: "Created time",
            example: 1632187772199,
          },
          deletedAt: {
            type: "Number",
            description: "Deleted time",
            example: null,
          },
          updatedAt: {
            type: "Number",
            description: "Updated time",
            example: 1633545106509,
          },
        },
      },
      NotificationModel: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id of notification",
            example: "615875e62505811ab9f41d73",
          },
          senderId: {
            type: "string",
            description: "id by senderId",
            example: "6149357c7b66e0761551e2f8",
          },
          receiverId: {
            type: "string",
            description: "id by receiverId",
            example: "614935a17b66e0761551e2fc",
          },
          type: {
            type: "string",
            description: "type of notification",
            example: "add_contact",
          },
          content: {
            type: "string",
            description: "content of notification",
            example: "null",
          },
          isRead: {
            type: "boolean",
            description: "isRead of notification",
            example: false,
          },
          createdAt: {
            type: "Number",
            description: "Created time",
            example: 1633187302503,
          },
        },
      },
      MessageModel: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "id of message",
              example: "61546e4aa5fdd7de622d7f1a",
            },
            senderId: {
              type: "string",
              description: "id of senderId",
              example: "6149357c7b66e0761551e2f8",
            },
            receiverId: {
              type: "string",
              description: "id of receiverId",
              example: "614935927b66e0761551e2fa",
            },
            chatType: {
              type: "string",
              description: "chat type of message",
              example: "personal || group",
            },
            messageType: {
              type: "string",
              description: "Type of message",
              example: "text || image || file",
            },
            text: {
              type: "string",
              description: "How are you?",
              example: false,
            },
            file: {
              type: "object",
              properties: {
                data: {
                  type: "string",
                  description: "data of file",
                  example: "Content data",
                },
                contentType: {
                  type: "string",
                  description: "content type of file",
                  example: "Hehe",
                },
                fileName: {
                  type: "string",
                  description: "name of file",
                  example: "admin.zip",
                },
              },
            },

            createdAt: {
              type: "Number",
              description: "Created time ",
              example: 1633271895818,
            },
            deletedAt: {
              type: "Number",
              description: "Deleted time",
              example: null,
            },
            updatedAt: {
              type: "Number",
              description: "Updated time",
              example: null,
            },
          },
        },
      },
      ContactModel: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id of contact",
            example: "615690257d76060a19f77132",
          },
          senderId: {
            type: "string",
            description: "id of senderId",
            example: "6149357c7b66e0761551e2f8",
          },
          receiverId: {
            type: "string",
            description: "id of receiverId",
            example: "614935927b66e0761551e2fa",
          },
          status: {
            type: "boolean",
            description: "status of contact",
            example: true,
          },
          createdAt: {
            type: "Number",
            description: "Created time ",
            example: 1633062949006,
          },
          deletedAt: {
            type: "Number",
            description: "Deleted time",
            example: null,
          },
          updatedAt: {
            type: "Number",
            example: 1633063178910,
            description: "Updated time",
          },
        },
      },
      ChatGroupModel: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id of chat group",
            example: "6153dd18547a45f2702130a5",
          },
          name: {
            type: "string",
            description: "name of chat group",
            example: "Nhóm 28: App Chat Zalo",
          },
          userAmount: {
            type: "Number",
            description: "number of participants",
            example: "614935927b66e0761551e2fa",
          },
          userId: {
            type: "string",
            description: "id of senderId",
            example: "6149357c7b66e0761551e2f8",
          },
          messageAmount: {
            type: "Number",
            description: "total message",
            example: 78,
          },
          members: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Member",
            },
          },
          createdAt: {
            type: "Number",
            description: "Created time ",
            example: 1633062949006,
          },
          deletedAt: {
            type: "Number",
            description: "Deleted time",
            example: null,
          },
          updatedAt: {
            type: "Number",
            example: 1633063178910,
            description: "Updated time",
          },
        },
      },
      Member: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            description: "id of user member",
            example: "6149357c7b66e0761551e2f8",
          },
          _id: {
            type: "string",
            description: "id of member",
            example: "6153de4061c685158f44d3a8",
          },
        },
      },
      UserInput: {
        type: "object",
        properties: {
          local: {
            type: "object",
            properties: {
              phone: {
                type: "string",
                description: "phone of user",
                example: "0987059059",
              },
              password: {
                type: "string",
                description: "password of user",
                example: "1",
              },
            },
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
          internal_code: {
            type: "string",
          },
        },
      },
    },
  },
};

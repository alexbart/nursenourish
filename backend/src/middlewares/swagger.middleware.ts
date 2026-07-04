import swaggerUi from "swagger-ui-express";

const specs = {
  openapi: "3.0.0",
  info: {
    title: "NurseNourish API",
    version: "1.0.0",
    description: "E-commerce API for nutritional supplements",
  },
  servers: [
    { url: "http://localhost:5000/api/v1", description: "Development" },
  ],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register customer",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "firstName", "lastName"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  phone: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/auth/login": {
      post: {
        summary: "Login",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "OK" } },
      },
    },
    "/products": {
      get: {
        summary: "List products",
        tags: ["Products"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "featured", in: "query", schema: { type: "boolean" } },
        ],
        responses: { "200": { description: "OK" } },
      },
    },
    "/products/{slug}": {
      get: {
        summary: "Get product by slug",
        tags: ["Products"],
        parameters: [
          { name: "slug", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "OK" } },
      },
    },
    "/categories": {
      get: {
        summary: "List categories",
        tags: ["Categories"],
        responses: { "200": { description: "OK" } },
      },
    },
    "/orders": {
      post: {
        summary: "Create order",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["items", "subtotal"],
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        productId: { type: "string" },
                        name: { type: "string" },
                        price: { type: "number" },
                        quantity: { type: "integer" },
                      },
                    },
                  },
                  subtotal: { type: "number" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/payments/initialize": {
      post: {
        summary: "Initialize Paystack payment",
        tags: ["Payments"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId", "email", "amount"],
                properties: {
                  orderId: { type: "string" },
                  email: { type: "string" },
                  amount: { type: "number" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "OK" } },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export function swaggerMiddleware() {
  return swaggerUi.serve;
}
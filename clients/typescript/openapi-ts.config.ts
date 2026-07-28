import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../../contracts/openapi/v1/openapi.yaml",
  output: process.env.BBA_CLIENT_OUTPUT ?? "src/generated",
  plugins: ["@hey-api/typescript", "@hey-api/sdk", "@hey-api/client-fetch"]
});

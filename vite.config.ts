import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Development proxy, routes to load balancer for OpenAI
      "/api/openai": {
        target: "https://34.31.43.150",
        changeOrigin: true,
        rewrite: (path) => "/v1/chat/completions", // Default to OpenAI endpoint
        secure: false,
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });
            req.on("end", () => {
              try {
                const parsedBody = JSON.parse(body);

                if (parsedBody.provider === "openai") {
                  proxyReq.path = "/v1/chat/completions";
                  proxyReq.setHeader("Host", "api.openai.com");
                  proxyReq.setHeader(
                    "Authorization",
                    `Bearer ${parsedBody.apiKey}`
                  );
                } else if (parsedBody.provider === "anthropic") {
                  proxyReq.path = "/v1/messages";
                  proxyReq.setHeader("Host", "api.anthropic.com");
                  proxyReq.setHeader(
                    "Authorization",
                    `Bearer ${parsedBody.apiKey}`
                  );
                  proxyReq.setHeader("anthropic-version", "2023-06-01");
                }

                const payloadString = JSON.stringify(parsedBody.payload);
                proxyReq.setHeader(
                  "Content-Length",
                  Buffer.byteLength(payloadString)
                );
                proxyReq.write(payloadString);
              } catch (error) {
                console.error("Error parsing request body:", error);
              }
            });
          });

          proxy.on("error", (err, req, res) => {
            console.log("proxy error", err);
          });
        },
      },
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

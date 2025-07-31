import https from "https";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { provider, payload, apiKey } = req.body;
  const loadBalancerIP = "34.31.43.150";

  try {
    let path, hostname, headers;

    if (provider === "openai") {
      path = "/v1/chat/completions";
      hostname = "api.openai.com";
      headers = {
        Host: hostname,
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        domain: "ai-rd",
        "module-id": "knowledge-base",
        "app-id": "knowledge-base-chat-bot-v1",
      };
    } else if (provider === "anthropic") {
      path = "/v1/messages";
      hostname = "api.anthropic.com";
      headers = {
        Host: hostname,
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        domain: "ai-rd",
        "module-id": "knowledge-base",
        "app-id": "knowledge-base-chat-bot-v1",
      };
    } else {
      return res.status(400).json({ error: "Unsupported provider" });
    }

    const data = JSON.stringify(payload);
    headers["Content-Length"] = Buffer.byteLength(data);

    const options = {
      hostname: loadBalancerIP,
      port: 443,
      path: path,
      method: "POST",
      headers: headers,
      rejectUnauthorized: false, // for testing
      timeout: 30000,
    };

    const apiResponse = await new Promise((resolve, reject) => {
      const req = https.request(options, (apiRes) => {
        let body = "";

        // streaming response
        if (
          apiRes.headers["content-type"]?.includes("text/stream") ||
          apiRes.headers["content-type"]?.includes("text/event-stream")
        ) {
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");

          apiRes.on("data", (chunk) => {
            res.write(chunk);
          });

          apiRes.on("end", () => {
            res.end();
            resolve({ streaming: true });
          });
        } else {
          // JSON response
          apiRes.on("data", (chunk) => {
            body += chunk;
          });

          apiRes.on("end", () => {
            try {
              const parsedBody = JSON.parse(body);
              resolve({
                statusCode: apiRes.statusCode,
                headers: apiRes.headers,
                body: parsedBody,
              });
            } catch (parseError) {
              reject(
                new Error(`Failed to parse response: ${parseError.message}`)
              );
            }
          });
        }
      });

      req.on("error", (error) => {
        console.error("Request error:", error);
        reject(error);
      });

      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      req.write(data);
      req.end();
    });

    // If it was a streaming response, we're already done
    if (apiResponse.streaming) {
      return;
    }

    // Handle non streaming response
    if (apiResponse.statusCode >= 400) {
      console.error("API error:", apiResponse.body);
      return res.status(apiResponse.statusCode).json({
        error: `${provider} API error: ${apiResponse.statusCode}`,
        details: apiResponse.body,
      });
    }

    res.status(200).json(apiResponse.body);
  } catch (error) {
    console.error("=== DETAILED ERROR ===");
    console.error("Error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error errno:", error.errno);
    console.error("Error syscall:", error.syscall);

    res.status(500).json({
      error: "Internal server error",
      details: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      timestamp: new Date().toISOString(),
    });
  }
}

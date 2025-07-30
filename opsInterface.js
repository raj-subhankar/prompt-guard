export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST method for actual requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Proxying request to relay server...");

    // Forward the request to your relay server
    const response = await fetch(
      "https://agentops-dev-648180604668.us-central1.run.app/opsInterface",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    console.log("Relay server response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Relay server error:", errorText);
      return res.status(response.status).json({
        error: `Relay server error: ${response.status}`,
        details: errorText,
      });
    }

    // Check if it's a streaming response
    const contentType = response.headers.get("content-type");
    if (
      contentType?.includes("text/stream") ||
      contentType?.includes("text/event-stream")
    ) {
      // Handle streaming response
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const reader = response.body?.getReader();
      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
        } finally {
          reader.releaseLock();
        }
      }
      res.end();
    } else {
      // Handle regular JSON response
      const data = await response.json();
      res.status(200).json(data);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}

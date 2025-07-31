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
    let targetURL, headers;

    if (provider === "openai") {
      targetURL = `https://${loadBalancerIP}/v1/chat/completions`;
      headers = {
        Host: "api.openai.com",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };
    } else if (provider === "anthropic") {
      targetURL = `https://${loadBalancerIP}/v1/messages`;
      headers = {
        Host: "api.anthropic.com",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      };
    } else {
      return res.status(400).json({ error: "Unsupported provider" });
    }

    const response = await fetch(targetURL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `${provider} API error: ${response.status}`,
        details: errorText,
      });
    }

    // Handle streaming response
    const contentType = response.headers.get("content-type");
    if (
      contentType?.includes("text/stream") ||
      contentType?.includes("text/event-stream")
    ) {
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
      const data = await response.json();
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(`${provider} API call failed:`, error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}

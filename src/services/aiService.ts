import { AIModel, ApiKeys, ChatMessage } from "@/types";

export class AIService {
  private apiKeys: ApiKeys;

  constructor(apiKeys: ApiKeys) {
    this.apiKeys = apiKeys;
  }

  async sendMessage(
    messages: ChatMessage[],
    model: AIModel,
    onStream?: (chunk: string) => void
  ): Promise<string> {
    const provider = model.provider;

    if (provider === "openai") {
      return this.sendOpenAIMessage(messages, model, onStream);
    } else if (provider === "anthropic") {
      return this.sendAnthropicMessage(messages, model, onStream);
    }

    throw new Error(`Provider ${provider} not supported yet`);
  }

  private async sendOpenAIMessage(
    messages: ChatMessage[],
    model: AIModel,
    onStream?: (chunk: string) => void
  ): Promise<string> {
    if (!this.apiKeys.openai) {
      throw new Error("OpenAI API key not provided");
    }

    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const url = "/api/opsInterface";

    const requestHeaders = {
      "Content-Type": "application/json",
    };

    const openAIRequestPayload = {
      model: model.id,
      messages: formattedMessages,
      stream: !!onStream,
      temperature: 0.7,
      max_tokens: 2000,
    };

    const requestBody = {
      operation: "forward_ai_request",
      payload: {
        destination: "https://api.openai.com/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKeys.openai}`,
          "module-id": "SETTLEMENT",
          OpsInterfaceOriginalURL:
            "https://agentops-dev-648180604668.us-central1.run.app/opsInterface",
        },
        payload: openAIRequestPayload,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("error", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });

        if (response.status === 405) {
          throw new Error(
            "Method not allowed - server may not handle OPTIONS preflight requests properly"
          );
        }

        let error;
        try {
          error = JSON.parse(errorText);
        } catch (e) {
          error = {
            error: {
              message: `Relay API error: ${response.status} - ${errorText}`,
            },
          };
        }
        throw new Error(
          error.error?.message || `Relay API error: ${response.status}`
        );
      }

      if (onStream) {
        return this.handleOpenAIStream(response, onStream);
      } else {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || data.content || "";
      }
    } catch (error) {
      console.error("Fetch failed", error);

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          "CORS error: Cannot connect to relay server from browser. This works with curl but is blocked by browser CORS policy. You need to add CORS headers to your server or use a proxy."
        );
      }

      throw error;
    }
  }

  private async handleOpenAIStream(
    response: Response,
    onStream: (chunk: string) => void
  ): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) {
      console.error("No response body");
      throw new Error("No response body");
    }

    let fullResponse = "";
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              return fullResponse;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || "";
              if (content) {
                fullResponse += content;
                onStream(content);
              }
            } catch (e) {
              console.warn("Failed to parse", data, e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error reading stream:", error);
    } finally {
      reader.releaseLock();
    }

    return fullResponse;
  }

  private async sendAnthropicMessage(
    messages: ChatMessage[],
    model: AIModel,
    onStream?: (chunk: string) => void
  ): Promise<string> {
    if (!this.apiKeys.anthropic) {
      throw new Error("Anthropic API key not provided");
    }

    // Convert messages format for Anthropic
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKeys.anthropic}`,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model.id,
        messages: formattedMessages,
        max_tokens: 2000,
        stream: !!onStream,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message || `Anthropic API error: ${response.status}`
      );
    }

    if (onStream) {
      return this.handleAnthropicStream(response, onStream);
    } else {
      const data = await response.json();
      return data.content[0]?.text || "";
    }
  }

  private async handleAnthropicStream(
    response: Response,
    onStream: (chunk: string) => void
  ): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    let fullResponse = "";
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") return fullResponse;

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta") {
                const content = parsed.delta?.text || "";
                if (content) {
                  fullResponse += content;
                  onStream(content);
                }
              }
            } catch (e) {
              // Ignore parsing errors for malformed chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return fullResponse;
  }
}

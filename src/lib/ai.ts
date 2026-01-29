
import { AI_PROMPTS } from "@/config/ai-prompts";

export async function callDeepSeek(messages: { role: string; content: string }[], temperature = 0.7, jsonMode = false) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiBase = process.env.DEEPSEEK_API_BASE || "https://api.deepseek.com/v1";

  if (!apiKey || apiKey === "your_api_key_here") {
    console.warn("DEEPSEEK_API_KEY is not configured, falling back to mock mode.");
    return null;
  }

  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        temperature,
        max_tokens: 1000,
        response_format: jsonMode ? { type: "json_object" } : undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`DeepSeek API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Failed to call DeepSeek API:", error);
    throw error;
  }
}

export async function analyzeMood(content: string) {
  const result = await callDeepSeek([
    { role: "system", content: AI_PROMPTS.MOOD_ANALYSIS.SYSTEM },
    { role: "user", content: AI_PROMPTS.MOOD_ANALYSIS.USER(content) }
  ], 0.3);

  return result?.trim() || "感悟";
}

export async function refineText(content: string) {
  const result = await callDeepSeek([
    { role: "system", content: AI_PROMPTS.REFINE_TEXT.SYSTEM },
    { role: "user", content: AI_PROMPTS.REFINE_TEXT.USER(content) }
  ], 0.8, true);

  if (!result) return [];
  
  try {
    const parsed = JSON.parse(result);
    return Array.isArray(parsed) ? parsed : (parsed.suggestions || []);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return [];
  }
}

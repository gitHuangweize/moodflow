
export async function callDeepSeek(messages: { role: string; content: string }[], temperature = 0.7) {
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
  const prompt = `分析以下用户输入的内容，从“感悟、治愈、迷茫、喜悦、孤独”中选择一个最贴切的词作为情绪标签。只返回这一个词，不要有任何解释：\n\n${content}`;
  
  const result = await callDeepSeek([
    { role: "system", content: "你是一个情绪分析专家，擅长从文字中精准捕捉情感色彩。" },
    { role: "user", content: prompt }
  ], 0.3);

  return result?.trim() || "感悟";
}

export async function refineText(content: string) {
  const prompt = `请将以下文字润色得更具文学感、富有诗意且简短。保持原意，但让表达更优美：\n\n${content}`;
  
  const result = await callDeepSeek([
    { role: "system", content: "你是一个文学素养极高的诗人，擅长精炼且富有张力的表达。" },
    { role: "user", content: prompt }
  ], 0.8);

  return result?.trim() || content;
}

export const AI_PROMPTS = {
  MOOD_ANALYSIS: {
    SYSTEM: "你是一个情绪分析专家，擅长从文字中精准捕捉情感色彩。",
    USER: (content: string) => `分析以下用户输入的内容，从“感悟、治愈、迷茫、喜悦、孤独”中选择一个最贴切的词作为情绪标签。只返回这一个词，不要有任何解释：\n\n${content}`
  },
  REFINE_TEXT: {
    SYSTEM: "你是一个心情修饰大师，擅长将普通的情绪表达转化为富有质感和生命力的文字。",
    USER: (content: string) => `任务：将原意重塑为 5 种风格：诗意（意境感）、简练（利落）、治愈（温暖）、忧郁（感伤）、现代（质感）。

约束：
- 严禁大白话，严禁使用“我觉得、很好”等平庸词汇。
- 保持原意核心，但用更有质感的词汇重塑。
- 必须返回 JSON 格式的数组，每个对象包含 style 和 content 字段。

格式要求：
必须返回如下格式的 JSON 数组：
[
  {"style": "诗意", "content": "..."},
  {"style": "简练", "content": "..."},
  {"style": "治愈", "content": "..."},
  {"style": "忧郁", "content": "..."},
  {"style": "现代", "content": "..."}
]

原文字：\n\n${content}`
  }
};

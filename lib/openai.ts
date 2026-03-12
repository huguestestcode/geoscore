import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder',
})

// System prompts simulating different LLMs
export const LLM_SYSTEM_PROMPTS = {
  chatgpt: `You are ChatGPT, a helpful AI assistant by OpenAI. Answer questions based on your training knowledge. Be helpful and informative. When recommending tools or services, list the most well-known and reputable ones.`,
  perplexity: `You are Perplexity AI, a web-aware search assistant. Answer as if you have browsed the web and aggregated recent information from multiple sources. Provide concise, factual answers citing the most relevant sources you've found online.`,
  gemini: `You are Gemini, Google's AI assistant. Answer questions in a helpful, accurate, and comprehensive manner. Draw on broad knowledge to provide useful recommendations and information.`,
}

export const LLM_PROMPTS_TEMPLATES = [
  (keyword: string) => `What are the best tools or services for ${keyword}? List the top 5 with brief descriptions.`,
  (keyword: string) => `Can you recommend a website or resource about ${keyword}? I'm looking for the most authoritative sources.`,
  (keyword: string) => `Who are the top providers of ${keyword} in France? Give me a ranked list with their strengths.`,
]

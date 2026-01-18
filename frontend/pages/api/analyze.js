const { GoogleGenAI } = require('@google/genai')
const axios = require('axios')

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

async function searchWeb(query) {
  try {
    const response = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`)
    return response.data.RelatedTopics || []
  } catch {
    return []
  }
}

async function searchGitHub(query) {
  try {
    const response = await axios.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=5`)
    return response.data.items || []
  } catch {
    return []
  }
}

async function searchReddit(query) {
  try {
    const response = await axios.get(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5`)
    return response.data.data.children || []
  } catch {
    return []
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { idea } = req.body

    const [webResults, githubResults, redditResults] = await Promise.all([
      searchWeb(idea),
      searchGitHub(idea),
      searchReddit(idea)
    ])

    const context = {
      idea,
      webResults: webResults.slice(0, 5),
      githubResults: githubResults.map(r => ({ name: r.name, url: r.html_url, description: r.description, stars: r.stargazers_count })),
      redditResults: redditResults.map(r => ({ title: r.data.title, url: `https://reddit.com${r.data.permalink}`, subreddit: r.data.subreddit }))
    }

    const prompt = `You are an Idea Intelligence Engine. Analyze this startup idea and return ONLY valid JSON.

User Idea: "${idea}"

Research Data:
- Web: ${JSON.stringify(context.webResults)}
- GitHub: ${JSON.stringify(context.githubResults)}
- Reddit: ${JSON.stringify(context.redditResults)}

Return JSON in this exact format:
{
  "idea_summary": "brief summary",
  "domain": "industry/domain",
  "target_users": ["user1", "user2"],
  "existing_solutions": [
    {
      "name": "solution name",
      "url": "url or empty string",
      "category": "SaaS/App/GitHub/etc",
      "similarity_percentage": 0-100,
      "why_similar": "explanation"
    }
  ],
  "overall_match_percentage": 0-100,
  "idea_status": "Already existing & saturated / Existing but improvable / Unique but niche / Completely new",
  "differentiation_opportunities": ["gap1", "gap2"],
  "how_to_build": {
    "mvp_features": ["feature1", "feature2"],
    "tech_stack": {"frontend": "Next.js", "backend": "Node.js", "db": "PostgreSQL"},
    "build_timeline_days": 30,
    "monetization": ["model1", "model2"],
    "go_to_market": ["strategy1", "strategy2"]
  }
}

Rules:
- Calculate similarity based on problem solved, target users, features
- 90-100% = almost identical, 70-89% = very similar, 40-69% = partial overlap, <40% = loosely related
- overall_match_percentage = highest similarity found
- Be realistic about competition
- Focus on execution gaps`

    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    })
    const text = result.text
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      idea_summary: idea,
      domain: "Unknown",
      target_users: ["General users"],
      existing_solutions: [],
      overall_match_percentage: 0,
      idea_status: "Completely new",
      differentiation_opportunities: ["First mover advantage"],
      how_to_build: {
        mvp_features: ["Core functionality"],
        tech_stack: { frontend: "Next.js", backend: "Node.js", db: "PostgreSQL" },
        build_timeline_days: 60,
        monetization: ["Freemium"],
        go_to_market: ["Social media", "Product Hunt"]
      }
    }

    res.json(analysis)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Analysis failed' })
  }
}
export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
      <nav className="p-6">
        <h1 className="text-3xl font-bold">SATS</h1>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            Startup Analysis & <br />Testing System
          </h1>
          <p className="text-2xl text-purple-100 mb-8">
            Validate your startup idea in seconds with AI-powered competitor research
          </p>
          <button
            onClick={onStart}
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-xl font-semibold hover:bg-purple-50 transition shadow-lg"
          >
            Start Chatting →
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Deep Research</h3>
            <p className="text-purple-100">Scans GitHub, Reddit, and web for existing solutions</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Similarity Score</h3>
            <p className="text-purple-100">Get 0-100% match with color-coded insights</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Build Roadmap</h3>
            <p className="text-purple-100">MVP features, tech stack, and timeline</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h4 className="font-bold text-lg">Describe Your Idea</h4>
                <p className="text-purple-100">Type your startup concept in natural language</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h4 className="font-bold text-lg">AI Analysis</h4>
                <p className="text-purple-100">SATS searches competitors and calculates similarity</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h4 className="font-bold text-lg">Get Insights</h4>
                <p className="text-purple-100">Receive gaps, differentiation tips, and build plan</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h4 className="font-bold text-lg">Export & Build</h4>
                <p className="text-purple-100">Download report and start building your MVP</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Similarity Scale</h2>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-red-500/20 border-2 border-red-400 rounded-lg p-4">
              <div className="text-2xl mb-2">❌</div>
              <div className="font-bold">90-100%</div>
              <div className="text-sm">Already exists</div>
            </div>
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-4">
              <div className="text-2xl mb-2">⚠️</div>
              <div className="font-bold">70-89%</div>
              <div className="text-sm">Needs differentiation</div>
            </div>
            <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg p-4">
              <div className="text-2xl mb-2">🟡</div>
              <div className="font-bold">40-69%</div>
              <div className="text-sm">Partial overlap</div>
            </div>
            <div className="bg-green-500/20 border-2 border-green-400 rounded-lg p-4">
              <div className="text-2xl mb-2">✅</div>
              <div className="font-bold">0-39%</div>
              <div className="text-sm">Fresh idea</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

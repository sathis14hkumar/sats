import { useState, useEffect } from 'react'
import axios from 'axios'
import Landing from '../components/Landing'

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [idea, setIdea] = useState('')
  const [sessions, setSessions] = useState([])
  const [currentSession, setCurrentSession] = useState(0)
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(null)

  useEffect(() => {
    // Clear on mount
    localStorage.removeItem('sats_sessions')
  }, [])

  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(null)
    if (menuOpen !== null) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [menuOpen])

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('sats_sessions', JSON.stringify(sessions))
    }
  }, [sessions])

  const startNewChat = () => {
    let newSessions = [[], ...sessions]
    if (newSessions.length > 10) {
      newSessions = newSessions.slice(0, 10)
    }
    setSessions(newSessions)
    setCurrentSession(0)
    setShowChat(true)
  }

  const deleteChat = (idx) => {
    const newSessions = sessions.filter((_, i) => i !== idx)
    setSessions(newSessions)
    if (currentSession === idx) {
      setCurrentSession(0)
    } else if (currentSession > idx) {
      setCurrentSession(currentSession - 1)
    }
    setMenuOpen(null)
    if (newSessions.length === 0) {
      setShowChat(false)
    }
  }

  const exportChat = (idx) => {
    const messages = sessions[idx] || []
    let html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #7c3aed; }
            .message { margin: 20px 0; padding: 15px; border-radius: 8px; }
            .user { background: #ede9fe; }
            .assistant { background: #f3f4f6; }
            .label { font-weight: bold; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <h1>SATS - Idea Analysis Report</h1>
          <p>Chat ${idx + 1} - ${new Date().toLocaleString()}</p>
    `
    messages.forEach(msg => {
      if (msg.role === 'user') {
        html += `<div class="message user"><div class="label">USER:</div><div>${msg.content}</div></div>`
      } else if (msg.role === 'assistant') {
        html += `<div class="message assistant"><div class="label">ANALYSIS:</div>`
        html += `<p><strong>Summary:</strong> ${msg.content.idea_summary}</p>`
        html += `<p><strong>Domain:</strong> ${msg.content.domain}</p>`
        html += `<p><strong>Match:</strong> ${msg.content.overall_match_percentage}%</p>`
        html += `<p><strong>Status:</strong> ${msg.content.idea_status}</p>`
        html += `</div>`
      }
    })
    html += '</body></html>'
    
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sats-chat-${idx + 1}.html`
    a.click()
    setMenuOpen(null)
  }

  const goHome = () => {
    setShowChat(false)
  }

  const analyzeIdea = async () => {
    if (!idea.trim()) return
    
    const newMessage = { role: 'user', content: idea }
    const updatedSessions = [...sessions]
    updatedSessions[currentSession] = [...updatedSessions[currentSession], newMessage]
    setSessions(updatedSessions)
    setLoading(true)
    setIdea('')

    try {
      const { data } = await axios.post('/api/analyze', { idea })
      updatedSessions[currentSession] = [...updatedSessions[currentSession], { role: 'assistant', content: data }]
      setSessions([...updatedSessions])
    } catch (error) {
      updatedSessions[currentSession] = [...updatedSessions[currentSession], { role: 'error', content: 'Analysis failed' }]
      setSessions([...updatedSessions])
    }
    setLoading(false)
  }

  const exportToPDF = () => {
    const messages = sessions[currentSession] || []
    let html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #7c3aed; }
            .message { margin: 20px 0; padding: 15px; border-radius: 8px; }
            .user { background: #ede9fe; }
            .assistant { background: #f3f4f6; }
            .label { font-weight: bold; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <h1>SATS - Idea Analysis Report</h1>
          <p>${new Date().toLocaleString()}</p>
    `
    messages.forEach(msg => {
      if (msg.role === 'user') {
        html += `<div class="message user"><div class="label">USER:</div><div>${msg.content}</div></div>`
      } else if (msg.role === 'assistant') {
        html += `<div class="message assistant"><div class="label">ANALYSIS:</div>`
        html += `<p><strong>Summary:</strong> ${msg.content.idea_summary}</p>`
        html += `<p><strong>Domain:</strong> ${msg.content.domain}</p>`
        html += `<p><strong>Match:</strong> ${msg.content.overall_match_percentage}%</p>`
        html += `<p><strong>Status:</strong> ${msg.content.idea_status}</p>`
        html += `</div>`
      }
    })
    html += '</body></html>'
    
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sats-analysis-${Date.now()}.html`
    a.click()
  }

  const getSimilarityColor = (pct) => {
    if (pct >= 90) return 'text-red-600'
    if (pct >= 70) return 'text-orange-600'
    if (pct >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getSimilarityLabel = (pct) => {
    if (pct >= 90) return '❌ Idea already exists'
    if (pct >= 70) return '⚠️ Needs differentiation'
    if (pct >= 40) return '🟡 Partial overlap'
    return '✅ Fresh idea'
  }

  if (!showChat) {
    return <Landing onStart={startNewChat} />
  }

  const currentMessages = sessions[currentSession] || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex">
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <button onClick={startNewChat} className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">+ New Chat</button>
        </div>
        <div className="flex-1 overflow-y-auto p-2" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {sessions.map((session, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-700 relative ${
                currentSession === idx ? 'bg-gray-700' : 'bg-gray-800'
              }`}
            >
              <div onClick={() => setCurrentSession(idx)}>
                <div className="text-sm font-semibold truncate pr-8">
                  {session[0]?.content || `Chat ${idx + 1}`}
                </div>
                <div className="text-xs text-gray-400">{session.length} messages</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpen(menuOpen === idx ? null : idx)
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                ⋮
              </button>
              {menuOpen === idx && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-3 top-10 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10"
                >
                  <button
                    onClick={() => exportChat(idx)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 rounded-t-lg"
                  >
                    📥 Export
                  </button>
                  <button
                    onClick={() => deleteChat(idx)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-red-400 rounded-b-lg"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-700">
          <button onClick={goHome} className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">🏠 Home</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col" style={{ height: '100vh' }}>
        <header className="bg-white shadow-sm p-4 flex justify-between items-center flex-shrink-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">SATS</h1>
          <button onClick={exportToPDF} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Export</button>
        </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {currentMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'user' ? (
              <div className="bg-purple-600 text-white rounded-lg p-4 max-w-2xl">{msg.content}</div>
            ) : msg.role === 'error' ? (
              <div className="bg-red-100 text-red-800 rounded-lg p-4 max-w-4xl">{msg.content}</div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 max-w-4xl w-full">
                <h2 className="text-xl font-bold mb-4">{msg.content.idea_summary}</h2>
                
                <div className="mb-4">
                  <span className="font-semibold">Domain:</span> {msg.content.domain}
                  <br />
                  <span className="font-semibold">Target Users:</span> {msg.content.target_users.join(', ')}
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2">Overall Match: 
                    <span className={`ml-2 ${getSimilarityColor(msg.content.overall_match_percentage)}`}>
                      {msg.content.overall_match_percentage}% {getSimilarityLabel(msg.content.overall_match_percentage)}
                    </span>
                  </h3>
                  <div className="bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                      className={`h-4 rounded-full ${msg.content.overall_match_percentage >= 70 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${msg.content.overall_match_percentage}%` }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2">Status: {msg.content.idea_status}</h3>
                </div>

                {msg.content.existing_solutions.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Existing Solutions:</h3>
                    {msg.content.existing_solutions.map((sol, idx) => (
                      <div key={idx} className="border-l-4 border-blue-500 pl-4 mb-3">
                        <div className="font-semibold">{sol.name}</div>
                        <div className="text-sm text-gray-600">{sol.category}</div>
                        {sol.url && <a href={sol.url} target="_blank" className="text-blue-600 text-sm">{sol.url}</a>}
                        <div className={`text-sm font-semibold ${getSimilarityColor(sol.similarity_percentage)}`}>
                          Similarity: {sol.similarity_percentage}%
                        </div>
                        <div className="text-sm text-gray-700">{sol.why_similar}</div>
                      </div>
                    ))}
                  </div>
                )}

                {msg.content.differentiation_opportunities.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Differentiation Opportunities:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {msg.content.differentiation_opportunities.map((opp, idx) => (
                        <li key={idx} className="text-gray-700">{opp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {msg.content.how_to_build && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">How to Build:</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold">MVP Features:</span>
                        <ul className="list-disc pl-5">
                          {msg.content.how_to_build.mvp_features.map((f, idx) => (
                            <li key={idx}>{f}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold">Timeline:</span> {msg.content.how_to_build.build_timeline_days} days
                      </div>
                      <div>
                        <span className="font-semibold">Monetization:</span> {msg.content.how_to_build.monetization.join(', ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg shadow p-4">Analyzing your idea...</div>
          </div>
        )}
      </div>

      <div className="bg-white border-t p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && analyzeIdea()}
            placeholder="Describe your startup idea..."
            className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={analyzeIdea}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
          >
            Analyze
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">⚠️ Refresh returns to home page</p>
      </div>
      </div>
    </div>
  )
}

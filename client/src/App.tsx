import { useState } from 'react'
import { Chat } from './components/Chat'
import './styles/Chat.css'
import './App.css'

function App() {
  const [isConversationStarted, setIsConversationStarted] = useState(false)
  const [chatKey, setChatKey] = useState(0)

  const startNewChat = () => {
    setIsConversationStarted(true)
    setChatKey(prev => prev + 1) // Force a remount of the Chat component
  }

  return (
    <div className="app">
      <header>
        <h1>Hive Notes Assistant</h1>
        <p>
          Ask questions about the hives at the Tashjian Bee & Pollinator Discovery Center.
          The Hive Notes Assistant will use notes from the beekeeper's hive inspections
          to answer your queries.
        </p>
        <br />
        <p>
          The Hive Notes Assistant currently has access to notes from the <strong>2025</strong> beekeeping season.
          You can ask about specific hives using their IDs. As of May 12, 2025, the hive IDs are
          (from left to right when facing the hives from inside the building):  
          <strong> E8, D2, A1, B4, D8, B6, A5</strong>.
        </p>
        <br />
        <p>
          <em>Please note:</em> The Hive Notes Assistant is experimental and may make mistakes.
        </p>
      </header>

      {!isConversationStarted ? (
        <div className="welcome-screen">
          <button onClick={startNewChat} className="start-chat-button">
            Start a New Conversation
          </button>
        </div>
      ) : (
        <Chat key={chatKey.toString()} onNewChat={startNewChat} />
      )}
    </div>
  )
}

export default App

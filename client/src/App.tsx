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

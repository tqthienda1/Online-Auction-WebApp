import React, { useState } from 'react'
import { FiX, FiSend } from 'react-icons/fi'

function ChatModal({ isOpen, onClose, counterpartyName = "Buyer", counterpartyImage = null }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'counterparty', text: 'Thank you for your purchase!', timestamp: '10:30 AM' },
    { id: 2, sender: 'you', text: 'Great! I will transfer the payment shortly.', timestamp: '10:32 AM' },
  ])
  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'you',
        senderName: 'John Collector',
        text: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages([...messages, newMessage])
      setInputText('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Transparent overlay - barely visible so content shows */}
      <div className="absolute inset-0 bg-transparent" onClick={onClose}></div>

      {/* Right-side panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col rounded-l-lg">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-playfair font-semibold text-gray-900">Chat</h3>
            <p className="text-sm text-gray-500">Seller & Buyer Communication</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
            aria-label="Close chat"
          >
            <FiX size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs ${
                  msg.sender === 'you'
                    ? 'bg-orange-500 text-white rounded-3xl rounded-tr-none'
                    : 'bg-gray-300 text-gray-900 rounded-3xl rounded-tl-none'
                } px-4 py-3`}
              >
                {msg.sender === 'counterparty' && (
                  <p className="font-semibold text-sm mb-1">{msg.senderName}</p>
                )}
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 flex gap-2 bg-white">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={handleSend}
            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition flex items-center justify-center w-10 h-10"
            aria-label="Send message"
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatModal

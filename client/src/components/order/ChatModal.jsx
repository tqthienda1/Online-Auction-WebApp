import React, { useState } from 'react'
import { FiX, FiSend } from 'react-icons/fi'

function ChatModal({ isOpen, onClose, counterpartyName = "Buyer", counterpartyImage = null }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'counterparty', text: 'Hi, when will the item be shipped?', timestamp: '10:30 AM' },
    { id: 2, sender: 'you', text: 'I will ship it tomorrow', timestamp: '10:32 AM' },
    { id: 3, sender: 'counterparty', text: 'Great, thanks!', timestamp: '10:35 AM' },
  ])
  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'you',
        text: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages([...messages, newMessage])
      setInputText('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FBBC04] to-yellow-500 p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
              {counterpartyImage ? (
                <img src={counterpartyImage} alt={counterpartyName} className="w-full h-full rounded-full object-cover" />
              ) : (
                counterpartyName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{counterpartyName}</h3>
              <p className="text-xs text-gray-700">Active now</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-yellow-600 rounded-full transition"
            aria-label="Close chat"
          >
            <FiX size={20} className="text-gray-900" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === 'you'
                    ? 'bg-[#FBBC04] text-gray-900 rounded-br-none'
                    : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBC04]"
          />
          <button
            onClick={handleSend}
            className="bg-[#FBBC04] hover:bg-yellow-500 text-gray-900 p-2 rounded-lg transition flex items-center justify-center"
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

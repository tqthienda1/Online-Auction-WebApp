import React, { useState, useEffect } from 'react'
import { FiX, FiSend } from 'react-icons/fi'
import { http as axios } from '../../lib/utils'
import { supabase } from '../../lib/supabaseClient'

function ChatModal({ isOpen, onClose, productID, counterpartyName = "Seller", counterpartyImage = null, meID = null, order }) {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentUserID, setCurrentUserID] = useState(null)

  // Fetch messages and get current user ID via supabase auth
  useEffect(() => {
    if (meID) {
      setCurrentUserID(meID)
    }

    const init = async () => {
      try {
        // Only try supabase lookup if meID not provided
        if (!meID) {
          const { data, error } = await supabase.auth.getUser()
          if (!error && data?.user) setCurrentUserID(data.user.id)
          else {
            const { data: sessionData } = await supabase.auth.getSession()
            const userId = sessionData?.session?.user?.id
            if (userId) setCurrentUserID(userId)
          }
        }
      } catch (err) {
        console.error('Failed to get supabase user:', err)
      }

      fetchMessages()
    }

    init()
  }, [isOpen, productID])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get(`/chat/products/${productID}/messages`)
      setMessages(res.data)
    } catch (err) {
      console.error('Failed to fetch messages:', err)
      setError('Could not load messages')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    setInputText('')


    if (!inputText.trim() || !productID) return

    try {
      setError(null)
      const res = await axios.post(`/chat/products/${productID}/messages`, {
        content: inputText,
        order
      })
      
      // Add new message to local state
      setMessages([...messages, res.data])
    } catch (err) {
      console.error('Failed to send message:', err)
      setError(err?.response?.data?.message || 'Failed to send message')
    } 
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Transparent overlay */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose}></div>

      {/* Right-side panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col rounded-l-lg">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-playfair font-semibold text-gray-900">Chat</h3>
            <p className="text-sm text-gray-500">with {counterpartyName}</p>
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
          {loading && <p className="text-center text-gray-500 text-sm">Loading messages...</p>}
          {error && <p className="text-center text-red-500 text-sm">{error}</p>}
          {messages.length === 0 && !loading && (
            <p className="text-center text-gray-400 text-sm">No messages yet</p>
          )}
          {messages.map((msg) => {
  const senderIdCandidate =
    msg.senderID ??
    msg.senderId ??
    msg.sender_id ??
    msg.sender?.id ??
    msg.sender ??
    msg.userId ??
    msg.user_id ??
    msg.from

  const isCurrentUser =
    currentUserID && senderIdCandidate && String(senderIdCandidate) === String(currentUserID)

  return (
    <div
      key={msg.id}
      // isCurrentUser = true (mình gửi) -> justify-end (bên phải)
      // isCurrentUser = false (người khác) -> justify-start (bên trái)
      className={`flex w-full mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[75%] px-4 py-2 shadow-sm ${
          isCurrentUser
            ? 'bg-[#FBBC04] text-white rounded-2xl rounded-tr-none' // Bong bóng Vàng bên phải
            : 'bg-gray-200 text-gray-800 rounded-2xl rounded-tl-none' // Bong bóng Xám bên trái
        }`}
      >
        <p className="text-sm">{msg.content}</p>
        <p className={`text-[10px] mt-1 opacity-70 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
})}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 flex gap-2 bg-white">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBC04] disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !inputText.trim()}
            className="bg-[#FBBC04] hover:bg-[#e0a800] text-white p-2 rounded-full transition flex items-center justify-center w-10 h-10 disabled:opacity-50"
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

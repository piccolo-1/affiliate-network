'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  Plus,
  Search,
  User,
  Clock,
  ArrowLeft
} from 'lucide-react';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState(null);
  const [newMessage, setNewMessage] = useState({
    recipientId: '',
    subject: '',
    content: '',
  });
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [convsRes, managersRes] = await Promise.all([
        fetch('/api/messages'),
        fetch('/api/managers'),
      ]);

      const convsData = await convsRes.json();
      const managersData = await managersRes.json();

      setConversations(convsData.conversations || []);
      setManagers(managersData.managers || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openConversation = async (conversationId) => {
    try {
      const res = await fetch(`/api/messages/${conversationId}`);
      const data = await res.json();
      setConversationMessages(data);
      setSelectedConversation(conversationId);

      // Update unread count locally
      setConversations(prev =>
        prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c)
      );
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const sendNewMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.recipientId || !newMessage.subject || !newMessage.content) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });

      if (res.ok) {
        const data = await res.json();
        setConversations(prev => [data.conversation, ...prev]);
        setShowNewMessage(false);
        setNewMessage({ recipientId: '', subject: '', content: '' });
        openConversation(data.conversation.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: replyContent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConversationMessages(prev => ({
          ...prev,
          conversation: {
            ...prev.conversation,
            messages: [...prev.conversation.messages, data.message],
          },
        }));
        setReplyContent('');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gaming-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-gray-400">Communicate with your affiliate managers</p>
          </div>
          <button
            onClick={() => setShowNewMessage(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Message
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 glass rounded-xl overflow-hidden flex">
          {/* Conversations List */}
          <div className={`w-full md:w-80 border-r border-white/10 flex flex-col ${selectedConversation ? 'hidden md:flex' : ''}`}>
            {/* Search */}
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-gaming-accent"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No conversations yet</p>
                  <button
                    onClick={() => setShowNewMessage(true)}
                    className="mt-4 text-gaming-accent hover:underline"
                  >
                    Start a conversation
                  </button>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv.id)}
                    className={`w-full p-4 text-left hover:bg-white/5 transition-colors border-b border-white/5 ${
                      selectedConversation === conv.id ? 'bg-white/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gaming-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gaming-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium truncate">
                            {conv.otherParticipants?.[0]?.firstName} {conv.otherParticipants?.[0]?.lastName}
                          </span>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {formatTime(conv.messages?.[0]?.createdAt || conv.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 truncate">{conv.subject}</p>
                        {conv.messages?.[0] && (
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {conv.messages[0].content}
                          </p>
                        )}
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-gaming-accent rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Conversation View */}
          <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : ''}`}>
            {selectedConversation && conversationMessages ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-white/10 flex items-center gap-4">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 hover:bg-white/10 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 bg-gaming-accent/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gaming-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {conversationMessages.otherParticipants?.[0]?.firstName}{' '}
                      {conversationMessages.otherParticipants?.[0]?.lastName}
                    </h3>
                    <p className="text-sm text-gray-400">{conversationMessages.conversation.subject}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversationMessages.conversation.messages.map((message) => {
                    const isOwn = message.sender.role === 'affiliate';
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isOwn ? 'order-2' : ''}`}>
                          <div
                            className={`p-3 rounded-xl ${
                              isOwn
                                ? 'bg-gaming-accent text-white rounded-br-none'
                                : 'bg-white/10 rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${isOwn ? 'justify-end' : ''}`}>
                            <Clock className="w-3 h-3" />
                            {new Date(message.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Input */}
                <form onSubmit={sendReply} className="p-4 border-t border-white/10">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-gaming-accent"
                    />
                    <button
                      type="submit"
                      disabled={!replyContent.trim() || sending}
                      className="px-4 py-3 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation or start a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowNewMessage(false)}
          />
          <div className="relative w-full max-w-lg glass rounded-xl p-6 animate-fadeIn">
            <h2 className="text-xl font-bold mb-6">New Message</h2>

            <form onSubmit={sendNewMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">To (Affiliate Manager)</label>
                <select
                  value={newMessage.recipientId}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, recipientId: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-gaming-accent cursor-pointer"
                  required
                >
                  <option value="" className="bg-gaming-dark">Select a manager...</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id} className="bg-gaming-dark">
                      {manager.firstName} {manager.lastName} ({manager.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Message subject"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Type your message..."
                  rows={5}
                  className="input-field resize-none"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewMessage(false)}
                  className="flex-1 py-3 glass hover:bg-white/10 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 py-3 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState } from 'react';
import { MessageSquare, TrendingUp, Users, Bug, Target, Send, Mic, Image, Smile, PlusCircle, Paperclip } from 'lucide-react';

export default function AIMentor() {
  const [activeFeature, setActiveFeature] = useState('Doubt Solver');
  const [messages, setMessages] = useState([
    {
      type: 'user',
      content: 'Hew do I solve a 0/1 knapsack problem?'
    },
    {
      type: 'ai',
      content: {
        text: 'Of course! Sure, here\'s a plan;',
        steps: [
          'Define a DP array "dp" where dp[j] is the maximum value achievable with capacity j.',
          'Iterate through the items, updating the DP array in reverse to avoid recomputation.',
          'For each item, update dp[j] to be the maximum of dp[j] and the value of the current item plus dp[j - item\'s weight].',
          'The solution is found at dp(capacity).'
        ],
        code: 'dp[j] = max(dp[j], value + dp[j] - weight)'
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const features = [
    { icon: MessageSquare, name: 'Doubt Solver', active: true },
    { icon: TrendingUp, name: 'Concept Explainer', active: false },
    { icon: Users, name: 'Mock Interview', active: false },
    { icon: Bug, name: 'Debug Code', active: false },
    { icon: Target, name: 'Recommend Problems', active: false }
  ];

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { type: 'user', content: inputValue }]);
      setInputValue('');
    }
  };

  return (
    <div className="flex h-screen bg-[#0b1120] text-white">
      {/* Sidebar */}
      <div className="w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-white/10">
          <h1 className="text-3xl font-bold mb-2">AI Mentor</h1>
          <p className="text-gray-400 text-sm">Here to guide you through anything DSA.</p>
        </div>

        {/* Features */}
        <div className="flex-1 p-6 space-y-2">
          {features.map((feature, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFeature(feature.name)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                activeFeature === feature.name
                  ? 'bg-blue-500 text-black font-semibold shadow-lg'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <feature.icon className="w-5 h-5" />
              <span className="font-medium">{feature.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-20 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-blue-500 text-black rounded-lg font-semibold hover:opacity-90 transition">
              New Chat
            </button>
            <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg font-medium hover:bg-white/10 transition">
              Resume Chat
            </button>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-lg px-4 py-2 border border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">D</span>
            </div>
            <div>
              <div className="text-sm font-semibold">Dev</div>
              <div className="text-xs text-gray-400">Reputation 1340</div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 pb-32">
          {/* AI Avatar */}
          <div className="flex justify-center mb-12">
            <div className="w-32 h-32 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border-4 border-white/10 shadow-2xl">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          {messages.map((message, idx) => (
            <div key={idx} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'user' ? (
                <div className="bg-[#4a5ff5] rounded-2xl rounded-br-sm px-6 py-3 max-w-2xl">
                  <p className="text-white">{message.content}</p>
                </div>
              ) : (
                <div className="flex gap-4 max-w-4xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#4a5ff5] to-[#7b61ff] rounded-full flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-[#13152b] rounded-2xl rounded-tl-sm px-6 py-4 border border-[#2a2d4a]">
                    <p className="text-gray-200 mb-4">{message.content.text}</p>
                    <ol className="space-y-3 mb-4">
                      {message.content.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="text-gray-300 text-sm">
                          <span className="font-semibold text-white">{stepIdx + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                    <div className="relative bg-[#0a0b1e] rounded-lg p-4 border border-[#2a2d4a]">
                      <code className="text-cyan-400 font-mono text-sm">{message.content.code}</code>
                      <button className="absolute top-3 right-3 w-8 h-8 bg-[#1a1d3a] hover:bg-[#23265a] rounded flex items-center justify-center transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 pt-4">
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-xl flex-shrink-0 mb-30">
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder='Ask anything... ex: "Explain DP with 2D-grids"'
                className="w-full bg-transparent px-6 py-4 text-white placeholder-gray-500 outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Image className="w-5 h-5" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <PlusCircle className="w-5 h-5" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="ml-2 px-6 py-2 bg-blue-500 text-black hover:opacity-90 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
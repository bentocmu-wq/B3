import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Sender } from '../types';
import MessageBubble from './MessageBubble';
import LoadingDots from './LoadingDots';
import { fetchSheetData } from '../services/sheetService';
import { generateResponse } from '../services/geminiService';

interface ChatWindowProps {
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataContext, setDataContext] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize Data
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      // Simulate connection delay for realism
      await new Promise(r => setTimeout(r, 800));
      
      const sheetData = await fetchSheetData();
      setDataContext(sheetData.content);
      
      const initialMsg: Message = {
        id: 'init-1',
        text: sheetData.source === 'LIVE' 
          ? 'สวัสดีค่ะ! พี่พยาบาลแก้วรอบรู้พร้อมให้บริการแล้วค่ะ ถามอะไรมาได้เลยนะคะ'
          : 'สวัสดีค่ะ! พี่พยาบาลแก้วรอบรู้พร้อมให้บริการแล้วค่ะ (ข้อมูลจำลอง) ถามอะไรมาได้เลยนะคะ',
        sender: Sender.BOT,
        timestamp: new Date()
      };
      
      setMessages([initialMsg]);
      setIsLoading(false);
    };

    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    
    // Add User Message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: Sender.USER,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    // AI Processing
    try {
        // Pass the current message history and the sheet data context
        const aiResponseText = await generateResponse(userText, messages, dataContext);
        
        const newBotMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: aiResponseText,
            sender: Sender.BOT,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newBotMsg]);
    } catch (err) {
        const errorMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: "ขออภัยค่ะ เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง",
            sender: Sender.BOT,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
        setIsLoading(false);
        // Keep focus on input
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, messages, dataContext]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-400 to-rose-500 p-4 flex items-center justify-between shadow-md z-10 flex-shrink-0">
        <div className="flex items-center">
            {onBack && (
                <button 
                    onClick={onBack}
                    className="mr-3 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
            )}
            <div className="bg-white p-1.5 rounded-full mr-3 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-pink-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </div>
            <div>
                <h1 className="text-white font-bold text-lg leading-tight">พี่พยาบาลแก้วรอบรู้</h1>
                <p className="text-pink-100 text-xs flex items-center opacity-90">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 border border-white/20"></span>
                    Online
                </p>
            </div>
        </div>
        {/* Optional Right Icon */}
        <button className="text-white/80 hover:text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 scroll-smooth" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4 animate-pulse">
             <div className="flex items-center bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <LoadingDots />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex-shrink-0 z-20">
        <div className="flex items-end bg-gray-50 border border-gray-200 rounded-2xl px-2 py-2 focus-within:ring-2 focus-within:ring-pink-300 focus-within:border-pink-300 transition-all">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-gray-700 placeholder-gray-400 max-h-32 overflow-y-auto"
            placeholder="พิมพ์คำถามที่นี่... (เช่น นโยบายการลา)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`p-2.5 rounded-xl ml-2 transition-all duration-200 flex-shrink-0
              ${input.trim() && !isLoading 
                ? 'bg-pink-500 text-white shadow-lg hover:bg-pink-600 transform hover:scale-105 active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
        <div className="text-center mt-2 text-[10px] text-gray-400 font-light">
          พี่พยาบาลแก้วรอบรู้ตอบคำถามจากข้อมูลใน Sheet เท่านั้น
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
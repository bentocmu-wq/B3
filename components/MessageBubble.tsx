import React from 'react';
import { Message, Sender } from '../types';

interface MessageBubbleProps {
  message: Message;
}

// Helper to render text with links
const FormattedText: React.FC<{ text: string; isUser: boolean }> = ({ text, isUser }) => {
  
  const renderLineWithLinks = (text: string) => {
    // Regex to detect URLs starting with http:// or https://
    // Note: This regex is basic. It assumes the URL ends at a whitespace.
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline break-all transition-opacity hover:opacity-80 ${
              isUser ? 'text-white' : 'text-blue-600'
            }`}
            onClick={(e) => e.stopPropagation()} 
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Split by newlines to handle paragraphs
  const lines = text.split('\n');
  
  return (
    <div className="text-sm md:text-base leading-relaxed">
      {lines.map((line, index) => {
        const trimmedLine = line.trim();

        // Check for bullet points
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
          return (
            <div key={index} className="ml-4 flex items-start">
              <span className={`mr-2 ${isUser ? 'text-indigo-200' : 'text-blue-500'}`}>•</span>
              <span>{renderLineWithLinks(line.replace(/^[-•]\s+/, ''))}</span>
            </div>
          );
        }
        // Check for headers (simple Markdown-ish)
        if (trimmedLine.startsWith('### ') || trimmedLine.startsWith('**')) {
            const cleanLine = line.replace(/^###\s+/, '').replace(/\*\*/g, '');
            return (
              <div key={index} className={`font-bold mt-2 mb-1 ${isUser ? 'text-white' : 'text-blue-800'}`}>
                {renderLineWithLinks(cleanLine)}
              </div>
            );
        }
        
        // Empty lines
        if (!trimmedLine) {
          return <div key={index} className="h-2" />;
        }

        return <div key={index}>{renderLineWithLinks(line)}</div>;
      })}
    </div>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;
  const isSystem = message.sender === Sender.SYSTEM;

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center text-white shadow-sm mx-2
          ${isUser ? 'bg-indigo-500' : 'bg-pink-400'}`}>
          {isUser ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          )}
        </div>

        {/* Bubble */}
        <div className={`relative px-4 py-3 shadow-md
          ${isUser 
            ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl rounded-tr-none' 
            : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none'
          }`}>
           <FormattedText text={message.text} isUser={isUser} />
           <div className={`text-[10px] mt-1 opacity-70 ${isUser ? 'text-indigo-100' : 'text-gray-400 text-right'}`}>
             {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </div>
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;
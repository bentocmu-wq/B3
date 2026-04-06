import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import { BOT_AVATAR } from './constants';

function App() {
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');

  const handleStartChat = (msg?: string) => {
    if (msg) {
      setInitialMessage(msg);
    } else {
      setInitialMessage('');
    }
    setIsChatStarted(true);
  };

  if (isChatStarted) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        {/* Container for ChatWindow to maintain responsiveness */}
        <div className="w-full h-full md:h-[95vh] md:max-w-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-white relative flex flex-col">
           <ChatWindow onBack={() => setIsChatStarted(false)} initialMessage={initialMessage} />
        </div>
      </div>
    );
  }

  const quickActions = [
    "เบอร์โทรภายใน",
    "ตามเปลล้อ",
    "ระบบตรวจเช็คต่างๆ"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] max-w-sm w-full text-center space-y-6 relative overflow-hidden border border-white/50">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100 rounded-full blur-2xl opacity-60"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-60"></div>

        {/* Logo / Avatar Area */}
        <div className="relative mx-auto w-36 h-36 mb-6 group cursor-default">
             <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-blue-50 rounded-full shadow-inner transform group-hover:scale-105 transition-transform duration-500"></div>
             <div className="absolute inset-2 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden border-4 border-white">
                {/* Nurse Icon */}
                <img src={BOT_AVATAR} alt="Nurse Kaew" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             </div>
             {/* Status Indicator */}
             <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
             </div>
        </div>

        {/* Text Content */}
        <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 tracking-tight">
                พี่พยาบาล<span className="text-pink-500">แก้ว</span>รอบรู้
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light">
                สวัสดีค่ะ! พี่แก้วยินดีต้อนรับนะคะ 💖<br/>
                มีข้อสงสัยเรื่องสวัสดิการ หรือข้อมูลองค์กร<br/>
                แวะมาคุยกับพี่แก้วได้ตลอดเลยน้า~
            </p>
        </div>

        {/* Quick Actions */}
        <div className="relative z-10 flex flex-col gap-2 mt-4">
          <p className="text-xs text-gray-400 font-medium mb-1">คำถามที่พบบ่อย (คลิกเพื่อถามได้เลยค่ะ 👇)</p>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleStartChat(action)}
              className="text-sm bg-pink-50 hover:bg-pink-100 text-pink-600 py-2 px-4 rounded-xl border border-pink-100 transition-colors text-left flex items-center justify-between group"
            >
              <span className="truncate mr-2">{action}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button 
            onClick={() => handleStartChat()}
            className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group z-10 mt-4"
        >
            <span className="relative z-10 flex items-center text-lg">
                พิมพ์คำถามอื่นๆ
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </span>
        </button>

        {/* Footer */}
        <div className="pt-4 text-[10px] text-gray-400 font-light tracking-wider uppercase">
            AI Assistant • Internal Only
        </div>
      </div>
    </div>
  );
}

export default App;
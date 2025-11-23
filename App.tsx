import React, { useState } from 'react';
import ChatWindow from './ChatWindow';

function App() {
  const [isChatStarted, setIsChatStarted] = useState(false);

  if (isChatStarted) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        {/* Container for ChatWindow to maintain responsiveness */}
        <div className="w-full h-full md:h-[95vh] md:max-w-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-white relative flex flex-col">
           <ChatWindow onBack={() => setIsChatStarted(false)} />
        </div>
      </div>
    );
  }

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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20 text-pink-400">
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                    <path d="M12 12h.01" />
                </svg>
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
                สวัสดีค่ะ! ยินดีต้อนรับสู่ศูนย์ข้อมูลภายใน<br/>
                มีข้อสงสัยเรื่องสวัสดิการ หรือข้อมูลองค์กร<br/>
                ถามพี่แก้วได้เลยนะคะ
            </p>
        </div>

        {/* Action Button */}
        <button 
            onClick={() => setIsChatStarted(true)}
            className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group z-10"
        >
            <span className="relative z-10 flex items-center text-lg">
                เริ่มสนทนา
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
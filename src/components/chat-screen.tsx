'use client';

import { useState } from 'react';

interface ChatScreenProps {
  username: string;
}

export function ChatScreen({ username }: ChatScreenProps) {
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white p-4">
      <header className="mb-4 border-b border-gray-600 pb-2">
        <h1 className="text-xl font-bold">Chat</h1>
        <p className="text-sm text-gray-400">Logado como: {username}</p>
      </header>

      <div className="flex-grow mb-4">
        {/* As mensagens do chat apareceriam aqui */}
        <p className="text-center text-gray-500">Nenhuma mensagem ainda.</p>
      </div>

      <footer className="flex">
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-grow bg-gray-700 rounded-l-md p-2 outline-none"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md">
          Enviar
        </button>
      </footer>
    </div>
  );
}

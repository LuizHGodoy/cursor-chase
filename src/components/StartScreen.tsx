import { useState } from 'react';

interface StartScreenProps {
  onStart: (playerName: string) => void;
  initialPlayerName?: string;
}

export function StartScreen({ onStart, initialPlayerName = '' }: StartScreenProps) {
  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Por favor, digite seu nickname');
      return;
    }

    onStart(playerName.trim());
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-8">Cursor Chase</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mb-8">
        <div className="flex flex-col items-center">
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError('');
            }}
            placeholder="Digite seu nickname"
            className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-white/50 w-64"
            maxLength={20}
          />
          {error && <span className="text-red-400 text-sm mt-2">{error}</span>}
        </div>

        <p className="text-white/80 text-xl font-light text-center max-w-md">
          Evite o círculo branco o máximo que puder!
          <br />
          O perseguidor fica mais rápido com o tempo.
        </p>

        <button
          type="submit"
          className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Iniciar Jogo
        </button>
      </form>
    </div>
  );
} 
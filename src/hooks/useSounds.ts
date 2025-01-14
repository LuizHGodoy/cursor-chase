import { Howl } from 'howler';
import { useCallback, useEffect, useMemo } from 'react';

export function useSounds() {
  const sounds = useMemo(() => {
    console.log('Inicializando sons...');
    return {
      bgm: new Howl({
        src: ['/assets/sfx/background.mp3'],
        loop: true,
        volume: 0.5,
        onload: () => console.log('BGM carregado'),
        onloaderror: (err) => console.error('Erro ao carregar BGM:', err),
      }),
      gameOver: new Howl({
        src: ['/assets/sfx/game-over.mp3'],
        volume: 0.8,
        onload: () => console.log('Game Over som carregado'),
        onloaderror: (err) => console.error('Erro ao carregar Game Over:', err),
      }),
      heartbeat: new Howl({
        src: ['/assets/sfx/heartbeat.mp3'],
        volume: 0.4,
        loop: true,
        onload: () => console.log('Heartbeat som carregado'),
        onloaderror: (err) => console.error('Erro ao carregar Heartbeat:', err),
      }),
      newPursuer: new Howl({
        src: ['/assets/sfx/new-pursuer.mp3'],
        volume: 0.6,
        onload: () => console.log('New Pursuer som carregado'),
        onloaderror: (err) => console.error('Erro ao carregar New Pursuer:', err),
      }),
      scoreBonus: new Howl({
        src: ['/assets/sfx/score-powerup.mp3'],
        volume: 0.7,
        onload: () => console.log('Score Bonus som carregado'),
        onloaderror: (err) => console.error('Erro ao carregar Score Bonus:', err),
      }),
      multiplierBonus: new Howl({
        src: ['/assets/sfx/multiplier-powerup.mp3'],
        volume: 0.7,
        onload: () => console.log('Multiplier Bonus som carregado'),
        onloaderror: (err) => console.error('Erro ao carregar Multiplier Bonus:', err),
      })
    };
  }, []);

  const playSound = useCallback((soundName: keyof typeof sounds) => {
    console.log('Tentando tocar:', soundName);
    sounds[soundName].play();
  }, [sounds]);

  const stopSound = useCallback((soundName: keyof typeof sounds) => {
    console.log('Parando som:', soundName);
    sounds[soundName].stop();
  }, [sounds]);

  useEffect(() => {
    return () => {
      Object.values(sounds).forEach(sound => sound.stop());
    };
  }, [sounds]);

  return { playSound, stopSound };
} 
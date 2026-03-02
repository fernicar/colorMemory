import React, { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { IntroScreen } from './screens/IntroScreen';
import { ChallengeSetupScreen } from './screens/ChallengeSetupScreen';
import { ChallengeIntroScreen } from './screens/ChallengeIntroScreen';
import { CountdownScreen } from './screens/CountdownScreen';
import { MemorizeScreen } from './screens/MemorizeScreen';
import { PickerScreen } from './screens/PickerScreen';
import { ResultScreen } from './screens/ResultScreen';
import { TotalScreen } from './screens/TotalScreen';
import { ChallengeResultScreen } from './screens/ChallengeResultScreen';
import { AnimatePresence } from 'motion/react';

function GameRouter() {
  const { currentScreen, loadChallenge } = useGameStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get('d');
    if (d) {
      try {
        const payload = JSON.parse(atob(d));
        loadChallenge(payload);
      } catch (e) {
        console.error('Failed to parse challenge URL', e);
      }
    }
  }, [loadChallenge]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'intro': return <IntroScreen key="intro" />;
      case 'challenge-setup': return <ChallengeSetupScreen key="challenge-setup" />;
      case 'challenge-intro': return <ChallengeIntroScreen key="challenge-intro" />;
      case 'countdown': return <CountdownScreen key="countdown" />;
      case 'memorize': return <MemorizeScreen key="memorize" />;
      case 'picker': return <PickerScreen key="picker" />;
      case 'result': return <ResultScreen key="result" />;
      case 'total': return <TotalScreen key="total" />;
      case 'challenge-result': return <ChallengeResultScreen key="challenge-result" />;
      default: return <IntroScreen key="intro" />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 p-4 md:p-8">
      <div 
        id="game-container" 
        className="w-full max-w-[476px] h-[100dvh] md:h-[78vh] bg-black rounded-none md:rounded-3xl shadow-2xl overflow-hidden relative"
      >
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameRouter />
    </ErrorBoundary>
  );
}

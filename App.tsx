
import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Questionnaire } from './components/Questionnaire';
import { RecommendationPage } from './components/RecommendationPage';
import { UserAnswers } from './types';

type AppState = 'landing' | 'questionnaire' | 'recommendation';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [answers, setAnswers] = useState<UserAnswers | null>(null);

  const handleStart = () => {
    setAppState('questionnaire');
  };

  const handleComplete = (finalAnswers: UserAnswers) => {
    setAnswers(finalAnswers);
    setAppState('recommendation');
  };

  const handleRestart = () => {
    setAnswers(null);
    setAppState('landing');
  };

  const renderContent = () => {
    switch (appState) {
      case 'landing':
        return <LandingPage onStart={handleStart} />;
      case 'questionnaire':
        return <Questionnaire onComplete={handleComplete} />;
      case 'recommendation':
        return answers ? <RecommendationPage answers={answers} onRestart={handleRestart} /> : <LandingPage onStart={handleStart} />;
      default:
        return <LandingPage onStart={handleStart} />;
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans">
      <div className="absolute top-4 left-6 z-10">
         <h2 className="text-2xl font-bold text-ion-blue">ION <span className="font-light">CTRM</span></h2>
      </div>
      {renderContent()}
    </main>
  );
};

export default App;

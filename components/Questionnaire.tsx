
import React, { useState } from 'react';
import { UserAnswers, Question } from '../types';
import { QUESTIONS } from '../constants';
import { ProgressBar } from './common/ProgressBar';
import { ActionButton } from './common/ActionButton';

interface QuestionnaireProps {
  onComplete: (answers: UserAnswers) => void;
}

const initialAnswers: UserAnswers = {
  industry: null,
  users: 50,
  tradingType: null,
  orgSize: null,
  currentSystem: null,
  priorities: [],
  region: null,
  integrations: [],
};

export const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);
  const [animationClass, setAnimationClass] = useState('animate-slide-in');

  const currentQuestion: Question = QUESTIONS[currentStep];

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setAnimationClass('animate-slide-out');
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setAnimationClass('animate-slide-in');
      }, 500);
    } else {
      onComplete(answers);
    }
  };

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: option });
    setTimeout(handleNext, 300);
  };

  const handleMultiSelect = (option: string) => {
    const currentValues = (answers[currentQuestion.id] as string[]) || [];
    const newValues = currentValues.includes(option)
      ? currentValues.filter(item => item !== option)
      : [...currentValues, option];
    setAnswers({ ...answers, [currentQuestion.id]: newValues });
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, users: parseInt(e.target.value, 10) });
  };

  const isNextDisabled = (): boolean => {
    const value = answers[currentQuestion.id];
    if (Array.isArray(value)) {
        return value.length === 0;
    }

    // Add a type guard for 'number' to resolve the TS error and correctly handle the number input.
    if (typeof value === 'number') {
      return false; // The number slider always has a valid value.
    }

    if (currentQuestion.type === 'dropdown' && value === null) {
        return true;
    }
    
    // At this point, `value` is a string literal union or null.
    // The previous check for `''` caused a type error because `''` is not part of the defined types.
    return value === null;
  };
  
  const renderInput = () => {
    switch (currentQuestion.type) {
      case 'select':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {currentQuestion.options?.map(option => (
              <button key={option} onClick={() => handleSelect(option)} className="w-full p-4 text-left border-2 border-ion-gray-medium rounded-lg hover:border-ion-blue hover:bg-ion-blue/10 focus:outline-none focus:ring-2 focus:ring-ion-blue transition-all duration-200">
                {option}
              </button>
            ))}
          </div>
        );
      case 'multiselect':
        const selectedOptions = (answers[currentQuestion.id] as string[]) || [];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {currentQuestion.options?.map(option => (
              <button key={option} onClick={() => handleMultiSelect(option)} className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${selectedOptions.includes(option) ? 'bg-ion-blue text-white border-ion-blue' : 'border-ion-gray-medium hover:border-ion-blue hover:bg-ion-blue/10'}`}>
                {option}
              </button>
            ))}
          </div>
        );
      case 'number':
        return (
            <div className="mt-6 flex flex-col items-center">
                <span className="text-4xl font-bold text-ion-blue">{answers.users}</span>
                <input type="range" min="1" max="1000" step="1" value={answers.users} onChange={handleNumberChange} className="w-full h-2 bg-ion-gray-medium rounded-lg appearance-none cursor-pointer mt-4 accent-ion-blue"/>
            </div>
        );
      case 'dropdown':
         return (
             <div className="mt-6">
                <select onChange={(e) => handleSelect(e.target.value)} defaultValue="" className="w-full p-4 border-2 border-ion-gray-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-ion-blue">
                    <option value="" disabled>Select a region...</option>
                    {currentQuestion.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
             </div>
         );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4 sm:p-8 bg-white">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <ProgressBar current={currentStep} total={QUESTIONS.length} />
        <div className={`transition-opacity duration-500 ${animationClass}`}>
            <div className="flex items-start space-x-4 mb-4">
                {currentQuestion.icon}
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">{currentQuestion.text}</h2>
            </div>
            {renderInput()}
        </div>
        <div className="mt-8 flex justify-end">
            {(currentQuestion.type === 'multiselect' || currentQuestion.type === 'number') && (
                <ActionButton onClick={handleNext} disabled={isNextDisabled()}>
                    {currentStep === QUESTIONS.length - 1 ? 'Get Recommendation' : 'Next'}
                </ActionButton>
            )}
        </div>
      </div>
    </div>
  );
};

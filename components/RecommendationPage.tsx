import React, { useState, useEffect } from 'react';
import { UserAnswers, Product } from '../types';
import { getRecommendations } from '../services/recommendationService';
import { generateComparisonText } from '../services/geminiService';
import { ActionButton } from './common/ActionButton';

interface RecommendationPageProps {
  answers: UserAnswers;
  onRestart: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-ion-blue animate-bounce [animation-delay:-0.3s]"></div>
	    <div className="w-3 h-3 rounded-full bg-ion-blue animate-bounce [animation-delay:-0.15s]"></div>
	    <div className="w-3 h-3 rounded-full bg-ion-blue animate-bounce"></div>
    </div>
);


export const RecommendationPage: React.FC<RecommendationPageProps> = ({ answers, onRestart }) => {
  const [recommendations, setRecommendations] = useState<{ ideal: Product; strong: Product } | null>(null);
  const [justification, setJustification] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      
      const recs = getRecommendations(answers);
      setRecommendations(recs);

      const justificationText = await generateComparisonText(answers, recs.ideal, recs.strong);
      setJustification(justificationText);

      setIsLoading(false);
    };

    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const handleEmailSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, this would trigger an API call to send a PDF
      setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-ion-gray-light p-4 sm:p-8 animate-fade-in flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-ion-blue text-white p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Your Personalized Recommendations</h1>
        </div>
        
        {isLoading || !recommendations ? (
            <div className="p-8 text-center h-96 flex flex-col justify-center">
                <h2 className="text-xl text-gray-700 mb-4">Analyzing your answers...</h2>
                <LoadingSpinner />
            </div>
        ) : (
            <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                    
                    {/* Ideal Fit Column */}
                    <div className="border-2 border-ion-blue rounded-xl p-6 shadow-lg relative bg-white flex flex-col">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-ion-blue text-white px-4 py-1 rounded-full text-sm font-semibold">Ideal Fit</div>
                        <div className="mt-4 text-center">
                            <h2 className="text-3xl font-bold text-ion-blue">{recommendations.ideal.name}</h2>
                            <p className="text-md text-ion-gray-dark mt-2">{recommendations.ideal.description}</p>
                        </div>
                        <div className="mt-6 border-t border-ion-gray-medium pt-4 flex-grow">
                            <h3 className="font-semibold text-lg text-gray-800 mb-3 text-center">Key Strengths</h3>
                            <ul className="space-y-2">
                                {recommendations.ideal.keyStrengths.map(strength => (
                                    <li key={strength} className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-0.5 flex-shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                                        <span className="text-gray-700">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Strong Alternative Column */}
                    <div className="border border-ion-gray-medium rounded-xl p-6 shadow-md relative bg-white flex flex-col">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-ion-gray-dark text-white px-4 py-1 rounded-full text-sm font-semibold">Strong Alternative</div>
                        <div className="mt-4 text-center">
                            <h2 className="text-3xl font-bold text-gray-800">{recommendations.strong.name}</h2>
                            <p className="text-md text-ion-gray-dark mt-2">{recommendations.strong.description}</p>
                        </div>
                        <div className="mt-6 border-t border-ion-gray-medium pt-4 flex-grow">
                            <h3 className="font-semibold text-lg text-gray-800 mb-3 text-center">Key Strengths</h3>
                            <ul className="space-y-2">
                                {recommendations.strong.keyStrengths.map(strength => (
                                    <li key={strength} className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mr-2 mt-0.5 flex-shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                                        <span className="text-gray-700">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>

                <div className="bg-blue-50 border-l-4 border-ion-blue p-6 rounded-r-lg mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Recommendation Explained</h3>
                    {justification ? <p className="text-gray-700 leading-relaxed">{justification}</p> : <LoadingSpinner/>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <ActionButton onClick={() => alert('Booking a demo!')} className="w-full">Book a Demo</ActionButton>
                    <ActionButton onClick={() => alert('Exploring features!')} className="w-full">Explore Features</ActionButton>
                    <ActionButton onClick={() => alert('Downloading PDF!')} className="w-full">Download Overview PDF</ActionButton>
                </div>

                <div className="bg-ion-gray-light p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">Get Your Personalized Report</h3>
                    {isSubmitted ? (
                        <p className="text-center text-green-600 font-semibold">Thank you! Your report has been sent to {email}.</p>
                    ) : (
                        <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your business email"
                                required
                                className="flex-grow p-3 border border-ion-gray-medium rounded-md focus:ring-2 focus:ring-ion-blue focus:outline-none"
                            />
                            <ActionButton type="submit" className="w-full sm:w-auto">Send PDF</ActionButton>
                        </form>
                    )}
                </div>

                 <div className="mt-8 text-center">
                    <button onClick={onRestart} className="text-ion-blue hover:underline font-semibold">Start New Assessment</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

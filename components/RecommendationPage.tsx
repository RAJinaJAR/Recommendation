
import React, { useState, useEffect } from 'react';
import { UserAnswers, Product } from '../types';
import { getRecommendation } from '../services/recommendationService';
import { generateRecommendationText } from '../services/geminiService';
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
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);
  const [justification, setJustification] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
      setIsLoading(true);
      
      const product = getRecommendation(answers);
      setRecommendedProduct(product);

      const justificationText = await generateRecommendationText(answers, product);
      setJustification(justificationText);

      setIsLoading(false);
    };

    fetchRecommendation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const handleEmailSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, this would trigger an API call to send a PDF
      setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-ion-blue text-white p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Your Recommended CTRM Solution</h1>
        </div>
        
        {isLoading || !recommendedProduct ? (
            <div className="p-8 text-center h-96 flex flex-col justify-center">
                <h2 className="text-xl text-gray-700 mb-4">Analyzing your answers...</h2>
                <LoadingSpinner />
            </div>
        ) : (
            <div className="p-8">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-ion-blue">{recommendedProduct.name}</h2>
                    <p className="text-lg text-ion-gray-dark mt-2">{recommendedProduct.description}</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-ion-blue p-6 rounded-r-lg mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Why It's Recommended for You</h3>
                    <p className="text-gray-700">{justification}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <ActionButton onClick={() => alert('Booking a demo!')} className="w-full">Book a Demo</ActionButton>
                    <ActionButton onClick={() => alert('Exploring features!')} className="w-full">Explore Features</ActionButton>
                    <ActionButton onClick={() => alert('Downloading PDF!')} className="w-full">Download Overview PDF</ActionButton>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
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

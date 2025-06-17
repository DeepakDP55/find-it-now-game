import React, {useState} from 'react';
import {AlertCircle, Calculator, RotateCcw} from 'lucide-react';
import { analytics } from '../services/analytics';

interface GameData {
  itemPrice: number;
  gst: number;
  deliveryFee: number;
  membershipDiscount: number;
  displayedTotal: number;
  actualTotal: number;
  hasError: boolean;
  correctTotal: number;
}

interface PriceCheckerProps {
  gameData: GameData;
  onCorrectGuess: () => void;
  onWrongGuess: (answer: string) => void;
  hasFoundError: boolean;
  attempts: number;
  maxAttempts: number;
}

const PriceChecker: React.FC<PriceCheckerProps> = ({
                                                     gameData,
                                                     onCorrectGuess,
                                                     onWrongGuess,
                                                     hasFoundError,
                                                     attempts,
                                                     maxAttempts
                                                   }) => {
  const [userInput, setUserInput] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);
  const [lastWrongAnswer, setLastWrongAnswer] = useState('');

  const quirkMessages = [
    "Oops! Even calculators have bad days! 🤖",
    "Close, but no cigar! 🚭",
    "Math is hard, life is harder! 😅",
    "You're getting warmer... like a microwave! 🔥",
    "Nice try, detective! Back to training! 🕵️‍♀️",
    "Almost there! Like pizza that's almost ready! 🍕",
    "Error 404: Correct answer not found! 💻"
  ];

  const randomMessage = quirkMessages[Math.floor(Math.random() * quirkMessages.length)];

  const correctDifference = Math.abs(gameData.displayedTotal - gameData.actualTotal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userAnswer = parseInt(userInput);

    if (userAnswer === correctDifference) {
      // Track correct answer
      analytics.answerSubmitted(userInput, true, attempts + 1, correctDifference);
      
      setIsCorrect(true);
      setShowExplanation(true);
      setShowWrongFeedback(false);
      setTimeout(() => {
        onCorrectGuess();
      }, 1500);
    } else {
      setIsCorrect(false);
      setLastWrongAnswer(userInput);
      setShowWrongFeedback(true);
      onWrongGuess(userInput);
      setUserInput('');
    }
  };

  const handleTryAgain = () => {
    setShowWrongFeedback(false);
  };

  const isMaxAttemptsReached = attempts >= maxAttempts;

  return (
    <div className="space-y-4">
      {!hasFoundError && !showExplanation && !isMaxAttemptsReached && (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="text-purple-400" size={20}/>
            <h3 className="text-lg font-semibold text-white">Spot the Difference!</h3>
          </div>

          <p className="text-gray-300 mb-4 text-sm">
            What's the price difference between what you should pay vs what's shown?
          </p>

          {showWrongFeedback && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-red-400" size={16}/>
                <h4 className="font-semibold text-red-400 text-sm">
                  {randomMessage}
                </h4>
              </div>
              <p className="text-red-300 text-sm mb-2">
                You answered: <span className="font-bold">₹{lastWrongAnswer}</span>
              </p>
              <p className="text-purple-300 text-xs">
                Attempts: {attempts}/{maxAttempts}
              </p>
              <button
                onClick={handleTryAgain}
                className="w-full mt-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-200"
              >
                <RotateCcw size={14}/>
                Try Again ({maxAttempts - attempts} left)
              </button>
            </div>
          )}

          {!showWrongFeedback && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-white text-lg">₹</span>
                <input
                  type="number"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter difference amount"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
              >
                Submit Answer
              </button>
            </form>
          )}
        </div>
      )}

      {isMaxAttemptsReached && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="text-red-400" size={20}/>
            <h4 className="font-semibold text-red-400">Maximum Attempts Reached!</h4>
          </div>
          <p className="text-gray-300 text-sm mb-3">
            The correct answer was: <strong>₹{correctDifference}</strong>
          </p>
          <div className="bg-black/30 p-3 rounded-lg font-mono text-xs space-y-1">
            <div>Item + GST: ₹{gameData.correctTotal}</div>
            <div>Delivery: +₹{gameData.deliveryFee}</div>
            <div>Membership: +₹{gameData.membershipDiscount}</div>
            <div className="border-t border-gray-600 pt-1">
              <strong>Should be: ₹{gameData.actualTotal}</strong>
            </div>
            <div className="text-red-400">
              <strong>But shown as: ₹{gameData.displayedTotal}</strong>
            </div>
          </div>
        </div>
      )}

      {showExplanation && (
        <div className={`bg-gray-800/50 rounded-xl p-4 border animate-fade-in ${
          isCorrect
            ? 'border-green-500 bg-green-500/10'
            : 'border-red-500 bg-red-500/10'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            {isCorrect ? (
              <div className="text-green-400 text-2xl">🎉</div>
            ) : (
              <AlertCircle className="text-red-400" size={20}/>
            )}
            <h4 className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '🎉 Brilliant Detective Work!' : '❌ Oops! Not quite right!'}
            </h4>
          </div>

          <div className="text-sm space-y-2">
            <p className="text-gray-300">
              <strong>The actual difference is: ₹{correctDifference}</strong>
            </p>
            <div className="bg-black/30 p-3 rounded-lg font-mono text-xs space-y-1">
              <div>Item + GST: ₹{gameData.correctTotal}</div>
              <div>Delivery: +₹{gameData.deliveryFee}</div>
              <div>Membership: +₹{gameData.membershipDiscount}</div>
              <div className="border-t border-gray-600 pt-1">
                <strong>Should be: ₹{gameData.actualTotal}</strong>
              </div>
              <div className="text-red-400">
                <strong>But shown as: ₹{gameData.displayedTotal}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceChecker;

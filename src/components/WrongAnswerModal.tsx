import React from 'react';
import {RotateCcw, X} from 'lucide-react';

interface WrongAnswerModalProps {
  onClose: () => void;
  onTryAgain: () => void;
  correctAnswer: number;
  userAnswer: string;
  attempts: number;
  maxAttempts: number;
}

const WrongAnswerModal: React.FC<WrongAnswerModalProps> = ({
                                                             onClose,
                                                             onTryAgain,
                                                             correctAnswer,
                                                             userAnswer,
                                                             attempts,
                                                             maxAttempts
                                                           }) => {
  const quirkMessages = [
    "Oops! Even calculators have bad days! 🤖",
    "Close, but no cigar! 🚭",
    "Math is hard, life is harder! 😅",
    "You're getting warmer... like a microwave! 🔥",
    "Nice try, detective! Back to training! 🕵️‍♀️",
    "Almost there! Like pizza that's almost ready! 🍕",
    "Error 404: Correct answer not found! 💻"
  ];

  const finalAttemptMessages = [
    "Don't worry, even Sherlock had off days! 🎩",
    "Math detective training complete! Next case awaits! 📚",
    "Close enough for government work! 😄",
    "You'll get it next time, champion! 🏆"
  ];

  const isLastAttempt = attempts >= maxAttempts;
  const randomMessage = isLastAttempt
    ? finalAttemptMessages[Math.floor(Math.random() * finalAttemptMessages.length)]
    : quirkMessages[Math.floor(Math.random() * quirkMessages.length)];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-red-500 shadow-2xl animate-scale-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-400">
            {isLastAttempt ? 'Game Over! 🎯' : 'Almost There! 🎯'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20}/>
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl mb-4">
            {isLastAttempt ? '🤷‍♀️' : '🤔'}
          </div>
          <p className="text-gray-300 mb-2 text-lg">
            {randomMessage}
          </p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-red-300 text-sm">
              You answered: <span className="font-bold">₹{userAnswer}</span>
            </p>
            {isLastAttempt && (
              <p className="text-green-300 text-sm">
                Correct answer: <span className="font-bold">₹{correctAnswer}</span>
              </p>
            )}
            <p className="text-purple-300 text-xs mt-2">
              Attempts: {attempts}/{maxAttempts}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {!isLastAttempt && (
            <button
              onClick={onTryAgain}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-200"
            >
              <RotateCcw size={16}/>
              Try Again ({maxAttempts - attempts} left)
            </button>
          )}

          {isLastAttempt && (
            <button
              onClick={onTryAgain}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-purple-500 rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-200"
            >
              🎲 New Challenge
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          {isLastAttempt
            ? "New puzzle loading soon! 🔍"
            : "Don't give up! Every detective needs practice! 🔍"
          }
        </p>
      </div>
    </div>
  );
};

export default WrongAnswerModal;

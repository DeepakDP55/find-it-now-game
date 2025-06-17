import React, {useRef} from 'react';
import {Twitter, X} from 'lucide-react';
import HallOfFameShareCard from './HallOfFameShareCard';
import { analytics } from '../services/analytics';

interface HallOfFameShareModalProps {
  onShare: () => void;
  onClose: () => void;
  username: string;
  totalFound: number;
  puzzlesSolved: number;
  averagePerPuzzle: number;
  rank: {
    title: string;
    emoji: string;
    color: string;
  };
}

const HallOfFameShareModal: React.FC<HallOfFameShareModalProps> = ({
                                                                     onShare,
                                                                     onClose,
                                                                     username,
                                                                     totalFound,
                                                                     puzzlesSolved,
                                                                     averagePerPuzzle,
                                                                     rank
                                                                   }) => {
  const shareCardRef = useRef<HTMLDivElement>(null);

  const shareOnTwitter = () => {
    const shareText = `UnzeptoChallenge ✨\n\n🏆 Meet ${username}, the ${rank.emoji} ${rank.title}!\n💰 Uncovered ₹${totalFound} in errors\n🧩 Cracked ${puzzlesSolved} puzzles\n📊 Avg detective score: ₹${averagePerPuzzle}/puzzle\n\nThink you can out-sleuth me? Game on!\n`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;
    
    // Track Hall of Fame Twitter share
    analytics.sharedOnTwitter(totalFound, 'twitter');
    
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div
        className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl animate-scale-in my-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">🏆 Hall of Fame</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20}/>
          </button>
        </div>

        <div className="space-y-6">
          {/* Share Card Preview */}
          <div ref={shareCardRef}>
            <HallOfFameShareCard
              username={username}
              totalFound={totalFound}
              puzzlesSolved={puzzlesSolved}
              averagePerPuzzle={averagePerPuzzle}
              rank={rank}
            />
          </div>

          {/* Share Actions */}
          <div className="space-y-3">
            <button
              onClick={shareOnTwitter}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <Twitter size={16}/>
              Share on Twitter
            </button>
          </div>

          {/* Social CTAs */}
          <div className="border-t border-gray-700 pt-4 space-y-2">
            <p className="text-gray-400 text-sm text-center mb-3">
              Like this challenge?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  analytics.twitterFollowClicked('hall_of_fame');
                  window.open('https://x.com/cortisoul_', '_blank');
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Follow me on Twitter
              </button>
              <button
                onClick={() => {
                  analytics.matiksCTAClicked('hall_of_fame');
                  window.open('https://matiks.com/apps', '_blank');
                }}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Try my App
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallOfFameShareModal;

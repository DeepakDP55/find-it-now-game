import React, {useRef} from 'react';
import {Twitter, X} from 'lucide-react';
import ShareCard from './ShareCard';
import { analytics } from '../services/analytics';

interface GameData {
  displayedTotal: number;
  actualTotal: number;
  hasError: boolean;
}

interface ShareModalProps {
  onShare: () => void;
  onClose: () => void;
  gameData: GameData;
  onNewChallenge: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({onShare, onClose, gameData, onNewChallenge}) => {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const difference = Math.abs(gameData.displayedTotal - gameData.actualTotal);

  const shareOnTwitter = () => {
    const shareText = `UnzeptoChallenge 🔍✨\n\n💸 Aha! Just caught a sneaky ₹${difference} error hiding in plain sight!\n\nThink you've got the eyes to spot what others miss?\n`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;
    
    // Track Twitter share
    analytics.sharedOnTwitter(difference, 'twitter');
    
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div
        className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl animate-scale-in my-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">🎉 Detective Victory!</h3>
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
            <ShareCard
              difference={difference}
              actualTotal={gameData.actualTotal}
              displayedTotal={gameData.displayedTotal}
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

            <button
              onClick={() => {
                analytics.matiksCTAClicked('share_modal');
                window.open('https://matiks.com/apps', '_blank');
              }}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-200"
            >
              <img src="/bolt.png" alt="Bolt" className="h-5 w-5" /> Try Matiks
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
                  analytics.twitterFollowClicked('share_modal');
                  window.open('https://x.com/cortisoul_', '_blank');
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Follow me on Twitter
              </button>
              <button
                onClick={onNewChallenge}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                🎲 New Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

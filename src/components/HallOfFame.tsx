import React, {useState} from 'react';
import {Edit3, Share, Target, User} from 'lucide-react';
import HallOfFameShareModal from './HallOfFameShareModal';
import { analytics } from '../services/analytics';

interface HallOfFameProps {
  totalFound: number;
  puzzlesSolved: number;
  onShare: (shareData: { title: string; text: string; url: string }) => void;
}

const HallOfFame: React.FC<HallOfFameProps> = ({totalFound, puzzlesSolved, onShare}) => {
  const [username, setUsername] = useState(() => {
    const storedUsername = localStorage.getItem('detective_username');
    if (storedUsername === null) {
      // First visit, set a default username and save it
      const defaultUsername = 'Anonymous Detective';
      localStorage.setItem('detective_username', defaultUsername);
      return defaultUsername;
    }
    return storedUsername;
  });
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [showShareModal, setShowShareModal] = useState(false);

  const averagePerPuzzle = puzzlesSolved > 0 ? Math.round(totalFound / puzzlesSolved) : 0;

  const getRank = (total: number) => {
    if (total >= 10000) return {title: 'Legendary Detective', emoji: '🏆', color: 'text-yellow-400'};
    if (total >= 5000) return {title: 'Master Detective', emoji: '🥇', color: 'text-yellow-300'};
    if (total >= 2000) return {title: 'Expert Detective', emoji: '🥈', color: 'text-gray-300'};
    if (total >= 1000) return {title: 'Senior Detective', emoji: '🥉', color: 'text-orange-400'};
    if (total >= 500) return {title: 'Detective', emoji: '🕵️‍♀️', color: 'text-purple-400'};
    if (total >= 100) return {title: 'Junior Detective', emoji: '🔍', color: 'text-blue-400'};
    return {title: 'Rookie', emoji: '🌟', color: 'text-green-400'};
  };

  const rank = getRank(totalFound);

  const quirkUsernames = [
    'MathSleuth', 'ErrorHunter', 'CalcNinja', 'NumberDetective', 'PriceBuster',
    'MathMaven', 'DigitDiver', 'CalcCrusader', 'NumberNinja', 'ErrorExplorer',
    'MathMagician', 'PricePatrol', 'CalculatorCop', 'NumberNerd', 'ErrorEagle'
  ];

  const handleUsernameEdit = () => {
    if (isEditingUsername) {
      const finalUsername = tempUsername.trim() || quirkUsernames[Math.floor(Math.random() * quirkUsernames.length)];
      setUsername(finalUsername);
      localStorage.setItem('detective_username', finalUsername);
      setTempUsername(finalUsername);
      
      // Track username change
      analytics.hallOfFameUsernameChanged(finalUsername);
    } else {
      setTempUsername(username);
    }
    setIsEditingUsername(!isEditingUsername);
  };

  const displayUsername = username || 'Anonymous Detective';

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleShareAction = () => {
    const shareText = `UnzeptoChallenge ✨\n\n🏆 Meet ${username}, the ${rank.emoji} ${rank.title}!\n💰 Uncovered ₹${totalFound} in errors\n🧩 Cracked ${puzzlesSolved} puzzles\n📊 Avg detective score: ₹${averagePerPuzzle}/puzzle\n\nThink you can out-sleuth me? Game on!\n`;

    onShare({
      title: 'My Detective Hall of Fame! 🏆',
      text: shareText,
      url: window.location.href
    });

    setShowShareModal(false);
  };

  return (
    <div className="mt-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/*<Trophy className="text-yellow-400" size={20} />*/}
          <div className="flex justify-center">
            <img src="/favicon.ico" alt="Favicon" width={48} height={48}/>
          </div>
          <h3 className="text-lg font-semibold text-white">Hall of Fame</h3>
        </div>
        <button
          onClick={handleShare}
          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors duration-200"
          title="Share your achievements"
        >
          <Share className="text-purple-400" size={16}/>
        </button>
      </div>

      <div className="space-y-3">
        {/* Username Section */}
        <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <User className="text-green-400" size={16}/>
            {isEditingUsername ? (
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Enter quirky username"
                className="bg-gray-700 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={20}
                autoFocus
              />
            ) : (
              <span className="text-white font-medium">{displayUsername}</span>
            )}
          </div>
          <button
            onClick={handleUsernameEdit}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title={isEditingUsername ? "Save username" : "Edit username"}
          >
            <Edit3 size={14}/>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-300">Your Rank:</span>
          <div className="flex items-center gap-1">
            <span className="text-xl">{rank.emoji}</span>
            <span className={`font-semibold ${rank.color}`}>{rank.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">₹{totalFound}</div>
            <div className="text-xs text-gray-400">Total Found</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-400">{puzzlesSolved}</div>
            <div className="text-xs text-gray-400">Puzzles Solved</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">₹{averagePerPuzzle}</div>
            <div className="text-xs text-gray-400">Avg Per Puzzle</div>
          </div>
        </div>

        {totalFound >= 100 && (
          <div className="text-center pt-2 border-t border-gray-700">
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Target size={16}/>
              <span className="text-sm font-medium">Achievement Unlocked!</span>
            </div>
          </div>
        )}
      </div>

      {showShareModal && (
        <HallOfFameShareModal
          onShare={handleShareAction}
          onClose={() => setShowShareModal(false)}
          username={displayUsername}
          totalFound={totalFound}
          puzzlesSolved={puzzlesSolved}
          averagePerPuzzle={averagePerPuzzle}
          rank={rank}
        />
      )}
    </div>
  );
};

export default HallOfFame;

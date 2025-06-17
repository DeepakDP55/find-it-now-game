import React from 'react';
import {Calculator, User} from 'lucide-react';

interface HallOfFameShareCardProps {
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

const HallOfFameShareCard: React.FC<HallOfFameShareCardProps> = ({
                                                                   username,
                                                                   totalFound,
                                                                   puzzlesSolved,
                                                                   averagePerPuzzle,
                                                                   rank
                                                                 }) => {
  return (
    <div
      className="bg-gradient-to-br from-purple-900 via-gray-900 to-green-900 p-6 rounded-2xl border border-purple-500/30 max-w-md mx-auto">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          {/*<div className="bg-gradient-to-r from-green-400 to-purple-400 p-3 rounded-full">*/}
          {/*  <Trophy className="text-black" size={24} />*/}
          {/*</div>*/}
          <div className="flex justify-center">
            <img src="/favicon.ico" alt="Favicon" width={48} height={48}/>
          </div>
        </div>

        <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
          My Detective Hall of Fame! 🏆
        </h2>

        <div className="bg-black/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <User className="text-green-400" size={16}/>
            <span className="font-semibold text-white">{username}</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">{rank.emoji}</span>
            <span className={`font-semibold ${rank.color}`}>{rank.title}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-black/30 rounded-lg p-2">
              <div className="text-lg font-bold text-green-400">₹{totalFound}</div>
              <div className="text-gray-400">Total Found</div>
            </div>
            <div className="bg-black/30 rounded-lg p-2">
              <div className="text-lg font-bold text-purple-400">{puzzlesSolved}</div>
              <div className="text-gray-400">Puzzles</div>
            </div>
            <div className="bg-black/30 rounded-lg p-2">
              <div className="text-lg font-bold text-blue-400">₹{averagePerPuzzle}</div>
              <div className="text-gray-400">Avg/Puzzle</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
          <Calculator size={16}/>
          <span>Mathematical Detective Skills: Proven ✨</span>
        </div>

        <div className="text-xs text-gray-400 border-t border-gray-700 pt-3">
          Unzepto yourself!
        </div>
      </div>
    </div>
  );
};

export default HallOfFameShareCard;
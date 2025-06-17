import React from 'react';
import {Calculator, Target} from 'lucide-react';

interface ShareCardProps {
  difference: number;
  actualTotal: number;
  displayedTotal: number;
}

const ShareCard: React.FC<ShareCardProps> = ({difference, actualTotal, displayedTotal}) => {
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
          I Spotted the Error! 🕵️‍♀️
        </h2>

        <div className="bg-black/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-green-400">
            <Target size={16}/>
            <span className="font-semibold">Found ₹{difference} discrepancy!</span>
          </div>

          <div className="text-xs text-gray-300 space-y-1">
            <div className="flex justify-between">
              <span>Should pay:</span>
              <span className="text-green-400">₹{actualTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Was shown:</span>
              <span className="text-red-400">₹{displayedTotal}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
          <Calculator size={16}/>
          <span>Mathematical Detective Skills: Activated ✨</span>
        </div>

        <div className="text-xs text-gray-400 border-t border-gray-700 pt-3">
          Unzepto yourself!
        </div>
      </div>
    </div>
  );
};

export default ShareCard;

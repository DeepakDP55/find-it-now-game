import React, {useEffect, useState} from 'react';
import BillSummary from '../components/BillSummary';
import PriceChecker from '../components/PriceChecker';
import ShareModal from '../components/ShareModal';
import HallOfFame from '../components/HallOfFame';
import { initializeAnalytics, analytics } from '../services/analytics';

const Index = () => {
  const [gameData, setGameData] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [hasFoundError, setHasFoundError] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [gameKey, setGameKey] = useState(1); // Add a key to force remount of PriceChecker
  const [totalDifferenceFound, setTotalDifferenceFound] = useState(() => {
    return parseInt(localStorage.getItem('totalDifferenceFound') || '0');
  });
  const [puzzlesSolved, setPuzzlesSolved] = useState(() => {
    return parseInt(localStorage.getItem('puzzlesSolved') || '0');
  });

  useEffect(() => {
    // Initialize PostHog
    initializeAnalytics();
    
    // Track page view
    analytics.pageViewed();
    
    generateNewGame();
  }, []);

  const generateNewGame = () => {
    // Generate random pricing with minimum difference of 50
    const itemPrice = Math.floor(Math.random() * 500) + 100;
    const gst = Math.floor(itemPrice * 0.18);
    const correctTotal = itemPrice + gst;

    const deliveryFee = Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 50) + 20;
    const membershipDiscount = Math.floor(Math.random() * 100) + 50;

    // Calculate actual total (including membership in the cost, not as discount)
    const actualTotal = correctTotal + deliveryFee + membershipDiscount;

    // Ensure minimum difference of 50
    const minErrorAmount = 50;
    const maxErrorAmount = 200;
    const errorAmount = Math.floor(Math.random() * (maxErrorAmount - minErrorAmount)) + minErrorAmount;
    const displayedTotal = actualTotal + errorAmount;

    setGameData({
      itemPrice,
      gst,
      deliveryFee,
      membershipDiscount,
      displayedTotal,
      actualTotal,
      hasError: true,
      correctTotal
    });
    
    // Track game started
    analytics.gameStarted({
      displayedTotal,
      actualTotal,
      correctTotal
    });
    
    setHasFoundError(false);
    setUserAnswer('');
    setAttempts(0);
    setShowShareModal(false);
    // Increment the game key to force remount of PriceChecker
    setGameKey(prevKey => prevKey + 1);
  };

  const handleCorrectGuess = () => {
    const difference = Math.abs(gameData.displayedTotal - gameData.actualTotal);
    const newTotal = totalDifferenceFound + difference;
    const newPuzzleCount = puzzlesSolved + 1;

    // Track successful completion
    analytics.challengeCompleted(difference, attempts, newTotal, newPuzzleCount);

    setTotalDifferenceFound(newTotal);
    setPuzzlesSolved(newPuzzleCount);
    localStorage.setItem('totalDifferenceFound', newTotal.toString());
    localStorage.setItem('puzzlesSolved', newPuzzleCount.toString());

    setHasFoundError(true);
    setShowShareModal(true);
    
    // Track share modal opening
    analytics.shareModalOpened(difference);
  };

  const handleWrongGuess = (answer) => {
    setUserAnswer(answer);
    setAttempts(prev => prev + 1);
    // Track wrong answer submission
    const difference = Math.abs(gameData.displayedTotal - gameData.actualTotal);
    analytics.answerSubmitted(answer, false, attempts + 1, difference);
  };

  const handleShare = () => {
    const difference = Math.abs(gameData.displayedTotal - gameData.actualTotal);
    
    if (navigator.share) {
      analytics.sharedOnTwitter(difference, 'native_share');
      navigator.share({
        title: 'I found the pricing error! 🕵️‍♀️',
        text: `I just spotted a ₹${difference} calculation mistake! Can you find it too?`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setShowShareModal(false);
  };

  const handleTryAgain = () => {
    if (attempts >= 3) {
      generateNewGame();
    }
  };

  const handleNewChallenge = () => {
    analytics.newChallengeClicked('main_button');
    generateNewGame();
  };

  if (!gameData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-green-900/20"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-md mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <h1
            className="text-3xl font-bold bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Unzepto Challenge!!
          </h1>
          <p className="text-gray-400 text-sm">
            Find the price difference! 🕵️‍♀️
          </p>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-purple-400">Attempts: {attempts}/3</span>
            <span className="text-green-400">Total Found: ₹{totalDifferenceFound}</span>
          </div>
        </header>

        <BillSummary gameData={gameData}/>

        <PriceChecker
          key={gameKey} // Add key to force remount when a new game is generated
          gameData={gameData}
          onCorrectGuess={handleCorrectGuess}
          onWrongGuess={handleWrongGuess}
          hasFoundError={hasFoundError}
          attempts={attempts}
          maxAttempts={3}
        />

        <button
          onClick={handleNewChallenge}
          className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg font-semibold hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-purple-500/25"
        >
          🎲 New Challenge
        </button>

        <HallOfFame
          totalFound={totalDifferenceFound}
          puzzlesSolved={puzzlesSolved}
          onShare={(shareData) => {
            analytics.hallOfFameShared(totalDifferenceFound, puzzlesSolved, 'detective');
            if (navigator.share) {
              navigator.share(shareData);
            } else {
              navigator.clipboard.writeText(shareData.text);
            }
          }}
        />
      </div>

      {showShareModal && (
        <ShareModal
          onShare={handleShare}
          onClose={() => setShowShareModal(false)}
          gameData={gameData}
          onNewChallenge={() => {
            analytics.newChallengeClicked('share_modal');
            handleNewChallenge();
          }}
        />
      )}
    </div>
  );
};

export default Index;

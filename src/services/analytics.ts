
import posthog from 'posthog-js';

// Initialize PostHog
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    console.log('🔍 Initializing PostHog analytics...');
    posthog.init(
      'phc_Mvn3K2nbA4rEgNBxrdmUA7jqCMoKp1dZFs9tbmPgWx8',
      {
        api_host: 'https://us.i.posthog.com',
        loaded: (posthog) => {
          console.log('✅ PostHog loaded successfully');
        },
        debug: true, // Enable debug mode
        capture_pageview: true, // Automatically capture page views
        capture_pageleave: true // Capture when users leave pages
      }
    );
  }
};

// Analytics event functions
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    console.log('📊 Tracking event:', eventName, properties);
    posthog.capture(eventName, properties);
    console.log('📤 Event sent to PostHog');
  }
};

// Specific tracking functions for your app
export const analytics = {
  // User arrival and engagement
  pageViewed: () => {
    console.log('👀 Tracking page view');
    trackEvent('page_viewed', {
      page: 'unzepto_challenge',
      timestamp: new Date().toISOString()
    });
  },

  gameStarted: (gameData: any) => {
    console.log('🎮 Tracking game started');
    trackEvent('game_started', {
      displayed_total: gameData.displayedTotal,
      actual_total: gameData.actualTotal,
      difference: Math.abs(gameData.displayedTotal - gameData.actualTotal),
      timestamp: new Date().toISOString()
    });
  },

  // Answer submission tracking
  answerSubmitted: (userAnswer: string, isCorrect: boolean, attempts: number, actualDifference: number) => {
    console.log('📝 Tracking answer submission:', { userAnswer, isCorrect, attempts });
    trackEvent('answer_submitted', {
      user_answer: userAnswer,
      is_correct: isCorrect,
      actual_difference: actualDifference,
      attempts: attempts,
      timestamp: new Date().toISOString()
    });
  },

  // Success tracking
  challengeCompleted: (difference: number, attempts: number, totalFound: number, puzzlesSolved: number) => {
    console.log('🎉 Tracking challenge completed');
    trackEvent('challenge_completed', {
      difference_found: difference,
      attempts_taken: attempts,
      total_difference_found: totalFound,
      puzzles_solved: puzzlesSolved,
      timestamp: new Date().toISOString()
    });
  },

  // Share tracking
  shareModalOpened: (difference: number) => {
    console.log('📤 Tracking share modal opened');
    trackEvent('share_modal_opened', {
      difference_found: difference,
      timestamp: new Date().toISOString()
    });
  },

  sharedOnTwitter: (difference: number, platform: 'twitter' | 'native_share') => {
    console.log('🐦 Tracking Twitter share');
    trackEvent('shared_challenge', {
      platform: platform,
      difference_found: difference,
      timestamp: new Date().toISOString()
    });
  },

  // External link clicks
  matiksCTAClicked: (source: 'share_modal' | 'hall_of_fame') => {
    console.log('🔗 Tracking Matiks CTA click');
    trackEvent('matiks_cta_clicked', {
      source: source,
      timestamp: new Date().toISOString()
    });
  },

  twitterFollowClicked: (source: 'share_modal' | 'hall_of_fame') => {
    console.log('🐦 Tracking Twitter follow click');
    trackEvent('twitter_follow_clicked', {
      source: source,
      timestamp: new Date().toISOString()
    });
  },

  // Hall of Fame tracking
  hallOfFameUsernameChanged: (newUsername: string) => {
    console.log('👤 Tracking username change');
    trackEvent('username_changed', {
      new_username: newUsername,
      timestamp: new Date().toISOString()
    });
  },

  hallOfFameShared: (totalFound: number, puzzlesSolved: number, rank: string) => {
    console.log('🏆 Tracking Hall of Fame share');
    trackEvent('hall_of_fame_shared', {
      total_found: totalFound,
      puzzles_solved: puzzlesSolved,
      rank: rank,
      timestamp: new Date().toISOString()
    });
  },

  // Game actions
  newChallengeClicked: (source: 'main_button' | 'share_modal') => {
    console.log('🎲 Tracking new challenge click');
    trackEvent('new_challenge_clicked', {
      source: source,
      timestamp: new Date().toISOString()
    });
  },

  hintUsed: (attempts: number) => {
    console.log('💡 Tracking hint used');
    trackEvent('hint_used', {
      attempts_before_hint: attempts,
      timestamp: new Date().toISOString()
    });
  }
};

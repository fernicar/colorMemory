import { create } from 'zustand';
import { HSB, generateRandomColor } from '../utils/color';

export type ScreenType = 
  | 'intro'
  | 'challenge-setup'
  | 'challenge-intro'
  | 'countdown'
  | 'memorize'
  | 'picker'
  | 'result'
  | 'total'
  | 'challenge-result';

export interface ChallengeScore {
  name: string;
  score: number;
  round_scores: number[];
  player_colors: HSB[];
}

export interface ChallengeState {
  active: boolean;
  code: string | null;
  challengerName: string;
  colors: HSB[];
  mode: 'easy' | 'hard';
  scores: ChallengeScore[];
}

interface GameState {
  currentScreen: ScreenType;
  round: number;
  totalScore: number;
  currentHsb: HSB;
  pickerHsb: HSB;
  roundScores: number[];
  playerColors: HSB[];
  challengeColors: HSB[];
  hardMode: boolean;
  playerName: string;
  challenge: ChallengeState;
  
  setScreen: (screen: ScreenType) => void;
  setHardMode: (hard: boolean) => void;
  setPlayerName: (name: string) => void;
  startGame: (isChallenge?: boolean) => void;
  nextRound: () => void;
  setPickerHsb: (hsb: HSB) => void;
  submitRound: (score: number, guess: HSB) => void;
  loadChallenge: (payload: any) => void;
  resetGame: () => void;
}

const initialChallenge: ChallengeState = {
  active: false,
  code: null,
  challengerName: '',
  colors: [],
  mode: 'easy',
  scores: []
};

export const useGameStore = create<GameState>((set, get) => ({
  currentScreen: 'intro',
  round: 1,
  totalScore: 0,
  currentHsb: [0, 0, 0],
  pickerHsb: [0, 0, 0],
  roundScores: [],
  playerColors: [],
  challengeColors: [],
  hardMode: false,
  playerName: '',
  challenge: initialChallenge,

  setScreen: (screen) => set({ currentScreen: screen }),
  setHardMode: (hard) => set({ hardMode: hard }),
  setPlayerName: (name) => set({ playerName: name }),

  startGame: (isChallenge = false) => {
    const { challenge, hardMode } = get();
    let colors: HSB[] = [];
    
    if (isChallenge && challenge.active) {
      colors = challenge.colors;
    } else {
      for (let i = 0; i < 5; i++) {
        colors.push(generateRandomColor());
      }
    }

    set({
      currentScreen: 'countdown',
      round: 1,
      totalScore: 0,
      roundScores: [],
      playerColors: [],
      challengeColors: colors,
      currentHsb: colors[0],
      pickerHsb: generateRandomColor(),
      hardMode: isChallenge && challenge.active ? challenge.mode === 'hard' : hardMode
    });
  },

  nextRound: () => {
    const { round, challengeColors } = get();
    if (round < 5) {
      set({
        round: round + 1,
        currentScreen: 'countdown',
        currentHsb: challengeColors[round],
        pickerHsb: generateRandomColor()
      });
    } else {
      const { challenge } = get();
      set({ currentScreen: challenge.active ? 'challenge-result' : 'total' });
    }
  },

  setPickerHsb: (hsb) => set({ pickerHsb: hsb }),

  submitRound: (score, guess) => {
    set((state) => ({
      roundScores: [...state.roundScores, score],
      playerColors: [...state.playerColors, guess],
      totalScore: state.totalScore + score,
      currentScreen: 'result'
    }));
  },

  loadChallenge: (payload) => {
    try {
      if (!payload.c || !Array.isArray(payload.c) || payload.c.length !== 5) {
        throw new Error('Invalid colors');
      }
      
      const challengerScore: ChallengeScore = {
        name: payload.n || 'Anonymous',
        score: payload.s || 0,
        round_scores: payload.rs || [],
        player_colors: payload.pc || []
      };

      set({
        challenge: {
          active: true,
          code: null,
          challengerName: payload.n || 'Anonymous',
          colors: payload.c,
          mode: payload.m === 'hard' ? 'hard' : 'easy',
          scores: [challengerScore]
        },
        currentScreen: 'challenge-intro'
      });
    } catch (e) {
      console.error('Failed to load challenge', e);
      set({ currentScreen: 'intro', challenge: initialChallenge });
    }
  },

  resetGame: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    set({
      currentScreen: 'intro',
      round: 1,
      totalScore: 0,
      roundScores: [],
      playerColors: [],
      challengeColors: [],
      challenge: initialChallenge
    });
  }
}));

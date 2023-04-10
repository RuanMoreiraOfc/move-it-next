import challenges from '../../challenges.json';

import { useState, useEffect, createContext, ReactNode } from 'react';

import axios from 'axios';
import { UpdateBodyType } from '@sf-database/mongo/update';

import { kSquaredSigma } from '@u-functions/Sigma';

import useSession from '@hooks/useSession';

import LevelUpModal from '@components/LevelUpModal';

export { ChallengesContext };
export default ChallengesContextProvider;

type ChallengeType = {
   type: 'body' | 'eye';
   description: string;
   amount: number;
};

type TimerConfigType = {
   get: {
      treatedTimer: (value?: number) => number;
      timer: () => number;
      multiplier: () => number;
   };
   set: {
      timer: (newMsValue: number) => void;
      multiplier: (newMultiplierValue: number) => void;
   };
};

type ContextType =
   | 'none'
   | 'onGainExp'
   | 'onLevelUp'
   | 'onGainedExp'
   | 'isGainingExp'
   | 'isLevelingUp'
   | 'isPosLevelingUp';

type ChallengesContextDataType = {
   inContext: (value?: ContextType) => boolean;

   levelDelayed: number;
   levelRaw: number;

   lastExperience: number;
   currentExperience: number;
   getExperienceByLevel: (currentLevel?: number) => number;
   getExperienceToNextLevel: (currentLevel?: number) => number;

   experienceUpdatingTimerConfig: TimerConfigType;

   activeChallenge: ChallengeType;
   completedChallenges: number;

   CloseLevelUpModal: () => void;

   StartNewChallenge: () => void;
   CompleteChallenge: () => void;
   ResetChallenge: () => void;
};

const ChallengesContext = createContext({} as ChallengesContextDataType);

type ChallengesContextProviderProps = {
   level: number;
   experienceTotal: number;
   completedChallenges: number;
};

function ChallengesContextProvider({
   children,
   ...initiator
}: ChallengesContextProviderProps & { children: ReactNode }) {
   const { isLogged, login } = useSession();
   const [canUploadData, setCanUploadData] = useState(false);

   //#region UseStates

   const [context, setContex] = useState<ContextType>('none');
   const inContext = (value: ContextType = 'none') => context === value;

   const [levelRaw, setLevelRaw] = useState(initiator.level ?? 1);
   const [levelDelayed, setLevelDelayed] = useState(initiator.level ?? 1);

   const [experienceTotal, setExperienceTotal] = useState(
      initiator.experienceTotal,
   );
   const [currentExperience, setCurrentExperience] = useState(0);
   const [lastExperience, setLastExperience] = useState(0);

   const [experienceUpdatingTimer, setExperienceUpdatingTimer] = useState(-1);
   const [
      experienceUpdatingTimerMultiplier,
      setExperienceUpdatingTimerMultiplier,
   ] = useState(1);
   const experienceUpdatingTimerConfig: TimerConfigType = {
      get: {
         treatedTimer: (multiplier = experienceUpdatingTimerMultiplier) =>
            experienceUpdatingTimer * multiplier,
         timer: () => experienceUpdatingTimer,
         multiplier: () => experienceUpdatingTimerMultiplier,
      },
      set: {
         timer: setExperienceUpdatingTimer.bind(null),
         multiplier: setExperienceUpdatingTimerMultiplier.bind(null),
      },
   };

   const [activeChallenge, setActiveChallenge] = useState(null);
   const [completedChallenges, setCompletedChallenges] = useState(
      initiator.completedChallenges ?? 0,
   );

   const [isLevelModalOpen, setisLevelModalOpen] = useState(false);

   const EXPERIENCE_SCALE = 4 ** 2;

   /** currentLevel >= 1 */
   const getExperienceByLevel = (currentLevel: number = levelRaw) => {
      return EXPERIENCE_SCALE * kSquaredSigma({ n: currentLevel, k: 2 });
   };

   /** currentLevel >= 1 */
   const getExperienceToNextLevel = (currentLevel: number = levelDelayed) => {
      const nextLevel = currentLevel + 1;
      return EXPERIENCE_SCALE * nextLevel ** 2;
   };

   //#endregion

   useEffect(() => {
      Notification.requestPermission();

      const { experienceTotal: total, level } = initiator;
      const experienceToGain = total % getExperienceByLevel(level);

      if (isNaN(experienceToGain)) {
         GainExperience(total);
      }

      if (experienceToGain > 0) {
         GainExperience(experienceToGain);
      }

      NextFrame(() => setCanUploadData(true));
   }, []);

   useEffect(() => {
      if (!isLogged) return;
      if (!canUploadData) return;

      const currentData: UpdateBodyType = {
         filter: { login },
         userData: {
            level: levelRaw,
            exp: getExperienceByLevel() + currentExperience,
            tasks: completedChallenges,
         },
      };

      const { protocol, host } = location;
      const url = `${protocol}//${host}/api/database/mongo/update/single`;

      // TODO: SAVING WARN

      axios.put(url, currentData);
   }, [experienceTotal]);

   function NextFrame(posFrameFunction: () => void) {
      setTimeout(posFrameFunction, 0);
   }

   function GainExperience(value: number) {
      const currentExperienceNow = currentExperience + value;
      const experienceToNextLevel = getExperienceToNextLevel(levelDelayed);

      setLastExperience(currentExperience);
      setExperienceTotal(experienceTotal + value);
      setCurrentExperience(currentExperienceNow % experienceToNextLevel);

      if (currentExperienceNow > experienceToNextLevel) {
         setLevelRaw(levelRaw + 1);
      }

      TriggerGainExperience(function afterGainExperience() {
         if (currentExperienceNow >= experienceToNextLevel) LevelUp();
      });
   }

   function LevelUp() {
      setLevelDelayed(levelDelayed + 1);

      TriggerGainLevel(OpenLevelUpModal);
   }

   function TriggerGainExperience(afterGainExperience: () => void) {
      setContex('onGainExp');
      NextFrame(() => {
         setContex('isGainingExp');
         afterGainExperience();
      });
      setTimeout(() => {
         setContex('onGainedExp');
         NextFrame(setContex.bind(null, 'none'));
      }, experienceUpdatingTimer);
   }

   function TriggerGainLevel(afterGainLevel: () => void) {
      setContex('isLevelingUp');

      setTimeout(() => {
         setLastExperience(0);

         setContex('onLevelUp');
         NextFrame(setContex.bind(null, 'isPosLevelingUp'));

         afterGainLevel();
      }, experienceUpdatingTimerConfig.get.treatedTimer());
   }

   function OpenLevelUpModal() {
      setisLevelModalOpen(true);
   }

   function CloseLevelUpModal() {
      setisLevelModalOpen(false);
   }

   function StartNewChallenge() {
      const randomChallengeIndex = Math.floor(
         Math.random() * challenges.length,
      );
      const challenge = challenges[randomChallengeIndex];

      setActiveChallenge(challenge);

      new Audio('/notification.mp3').play();

      if (Notification.permission === 'granted') {
         new Notification('Novo desafio 🎉', {
            body: `Valendo ${challenge.amount}xp`,
            silent: true,
         });
      }
   }

   function CompleteChallenge() {
      if (!activeChallenge) return;

      setActiveChallenge(null);

      setCompletedChallenges(completedChallenges + 1);

      GainExperience(activeChallenge.amount);
   }

   function ResetChallenge() {
      setActiveChallenge(null);
   }

   return (
      <ChallengesContext.Provider
         value={{
            inContext,
            levelDelayed,
            levelRaw,
            lastExperience,
            currentExperience,
            getExperienceByLevel,
            getExperienceToNextLevel,
            experienceUpdatingTimerConfig,
            completedChallenges,
            activeChallenge,
            StartNewChallenge,
            CompleteChallenge,
            ResetChallenge,
            CloseLevelUpModal,
         }}
      >
         {isLevelModalOpen && <LevelUpModal />}
         {children}
      </ChallengesContext.Provider>
   );
}

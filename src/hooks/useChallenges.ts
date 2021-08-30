import { useContext } from 'react';
import { ChallengesContext } from '@contexts/ChallengesContext';

export default useChallenges;

function useChallenges() {
  return useContext(ChallengesContext);
}

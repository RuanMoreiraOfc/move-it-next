import { useContext } from 'react';
import { CountdownContext } from '@contexts/CountdownContext';

export default useCountdown;

function useCountdown() {
  return useContext(CountdownContext);
}

import { useContext } from 'react';
import { SessionContext } from '@contexts/SessionContext';

export default useSession;

function useSession() {
  return useContext(SessionContext);
}

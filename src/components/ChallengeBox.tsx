import styles from '@st-components/ChallengeBox.module.css';

import useChallenges from '@hooks/useChallenges';
import useCountdown from '@hooks/useCountdown';

export default ChallengeBox;

function ChallengeBox() {
   const { activeChallenge, CompleteChallenge, ResetChallenge } =
      useChallenges();
   const { ResetCountdown } = useCountdown();

   function handleChallengeSucceeded() {
      CompleteChallenge();
      ResetCountdown();
   }

   function handleChallengeFailed() {
      ResetChallenge();
      ResetCountdown();
   }

   return (
      <div className={styles.challengeBoxContainer}>
         {activeChallenge ? (
            <div className={styles.challengeActive}>
               <header>Ganhe {activeChallenge.amount} xp</header>

               <main>
                  <img src={'icons/' + activeChallenge.type + '.svg'} />
                  <strong>Novo desafio</strong>
                  <p>{activeChallenge.description}</p>
               </main>

               <footer>
                  <button
                     type='button'
                     className={styles.challengeFailedButton}
                     onClick={handleChallengeFailed}
                  >
                     Falhei
                  </button>
                  <button
                     type='button'
                     className={styles.challengeSucceededButton}
                     onClick={handleChallengeSucceeded}
                  >
                     Completei
                  </button>
               </footer>
            </div>
         ) : (
            <div className={styles.challengeNonActive}>
               <strong>Finalize um ciclo para receber um desafio</strong>
               <p>
                  <img src='icons/level-up.svg' alt='Level Up' />
                  Avance de level completando desafios.
               </p>
            </div>
         )}
      </div>
   );
}

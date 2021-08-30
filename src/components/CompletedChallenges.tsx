import styles from '@st-components/CompletedChallenges.module.css';

import useChallenges from '@hooks/useChallenges';

export default CompletedChallenges;

function CompletedChallenges() {
   const { completedChallenges } = useChallenges();

   return (
      <div className={styles.completedChallengesContainer}>
         <span>Desafios Completos</span>
         <span>{completedChallenges}</span>
      </div>
   );
}

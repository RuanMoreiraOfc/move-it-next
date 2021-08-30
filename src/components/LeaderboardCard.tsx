import styles from '@st-components/LeaderboardCard.module.css';

import { AddBodyType } from '@sf-database/mongo/add';

import Profile from '@components/Profile';

export default LeaderboardCard;

type LeaderboardCardProps = {
   index: number;
   highlighted: boolean;
} & AddBodyType;

function LeaderboardCard({
   index,
   tasks,
   exp,
   highlighted,
   ...profileProps
}: LeaderboardCardProps) {
   return (
      <div
         className={`${styles.container}${
            highlighted ? ' ' + styles.highlight : ''
         }`}
      >
         <span className={styles.index}>{index}</span>
         <div className={styles.dataContainer}>
            <span className={styles.user}>
               <Profile {...profileProps} />
            </span>
            <span className={styles.tasks}>
               <strong>{tasks}</strong> completados
            </span>
            <span className={styles.exp}>
               <strong>{exp}</strong> xp
            </span>
         </div>
      </div>
   );
}

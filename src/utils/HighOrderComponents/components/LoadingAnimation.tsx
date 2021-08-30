import styles from '@u-hoc-styles/Loading.module.css';

export default LoadingAnimation;

function LoadingAnimation() {
   return (
      <div className={styles.container}>
         <span>loading</span>
         <img src='/icons/key.svg' />
      </div>
   );
}

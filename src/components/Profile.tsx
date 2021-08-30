import styles from '../styles/components/Profile.module.css';

export default Profile;

type ProfileProps = {
   name: string;
   login: string;
   level: number;
};

function Profile({ name, login, level }: ProfileProps) {
   return (
      <div className={styles.profileContainer}>
         <img
            src={`http://github.com/${login}.png`}
            alt={`Foto de Perfil - ${login}`}
         />
         <div>
            <strong>{name}</strong>
            <p>
               <img src='/icons/level.svg' alt='Level' />
               <span>{'Level ' + level}</span>
            </p>
         </div>
      </div>
   );
}

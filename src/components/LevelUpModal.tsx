import styles from '../styles/components/LevelUpModal.module.css';

import { ChallengesContext } from '../contexts/ChallengesContext';

import { useContext } from 'react';

export function LevelUpModal() {
    const { level, CloseLevelUpModal } = useContext( ChallengesContext )

    return (
        <div className={ styles.overlay }>
            <div className={ styles.container } >
                <header>{level}</header>

                <strong>Parabéns 🎉</strong>
                <p>Você alcançou um novo level.</p>
                <button
                    type="button"
                    onClick={ CloseLevelUpModal }
                >
                    <img src="/icons/close.svg" alt="Fechar modal" />
                </button>
            </div>
        </div>
    )    
}
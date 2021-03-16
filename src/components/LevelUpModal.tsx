import styles from '../styles/components/LevelUpModal.module.css';

import { ChallengesContext } from '../contexts/ChallengesContext';

import { useContext } from 'react';

export function LevelUpModal() {
    const { level, CloseLevelUpModal } = useContext( ChallengesContext )

    // TODO: https://github.com/mathusummut/confetti.js

    return (
        <div className={ styles.overlay }>
            <div className={ styles.container } >
                <header data-level={level} >{level}</header>

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
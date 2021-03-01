import styles from '../styles/components/ExperienceBar.module.css'

import { ChallengesContext } from '../contexts/ChallengesContext';

import { useEffect, useContext } from "react";

export function ExperienceBar() {
    const { currentExperience: progress, experienceToNextLevel: maxProgress } = useContext(ChallengesContext)

    function GetProgressPerCent()
    {
        return (progress / maxProgress * 100) + '%';
    }

    return (
        <header className={styles.experienceBar}>
            <span>0 exp</span>
            <div>
                <div style={{ width: GetProgressPerCent() }} />
                <span className={styles.currentExperience} style={{ left: GetProgressPerCent() }}>
                    { progress } exp
                </span>
            </div>
            <span>{ maxProgress } exp</span>
        </header>
    )
}
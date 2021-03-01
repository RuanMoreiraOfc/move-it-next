// @collapse

import challenges from "../../challenges.json";
import Cookies from "js-cookie";

import { useState, useEffect, createContext, ReactNode } from "react";

import { LevelUpModal } from "../components/LevelUpModal";

interface IChallenge
{
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface IChallengesContextData {
    level: number;
    currentExperience: number;
    experienceToNextLevel: number;
    activeChallenge: IChallenge;
    completedChallenges: number;

    CloseLevelUpModal: () => void;
    StartNewChallenge: () => void;
    CompleteChallenge: () => void;
    ResetChallenge: () => void;
}

export const ChallengesContext = createContext( {} as IChallengesContextData );

interface IChallengesContextProviderProps {
    level: number;
    currentExperience: number;
    completedChallenges: number;
    children: ReactNode;
}

export function ChallengesContextProvider( { children, ...initiator }: IChallengesContextProviderProps ) {
    //#region UseStates 

    const [level, setLevel] = useState( initiator.level ?? 1 );
    const [currentExperience, setCurrentExperience] = useState( initiator.currentExperience ?? 0 );
    const [completedChallenges, setCompletedChallenges] = useState( initiator.completedChallenges ?? 0 );
    const [activeChallenge, setActiveChallenge] = useState( null );

    const [isLevelModalOpen, setisLevelModalOpen] = useState( false );
    
    const getExperienceToNextLevel = ( currentLevel: number ) => Math.pow( ( currentLevel + 1 ) * 4, 2 );
    const experienceToNextLevel = getExperienceToNextLevel(level);

    //#endregion

    useEffect( () => {
        Notification.requestPermission()
    }, [] )
    
    {
        const cookies = { level, currentExperience, completedChallenges }
        const handleCookies = ([key, value]: string[]) => Cookies.set(key, value)
        
        useEffect(
            Array.prototype.forEach.bind( Object.entries(cookies), handleCookies )
        , [{ ...Object.keys(cookies) }] )
    }

    function LevelUp()
    {
        setLevel(level + 1);
        setisLevelModalOpen( true )
    }

    function CloseLevelUpModal()
    {
        setisLevelModalOpen( false );
    }

    function StartNewChallenge()
    {
        const randomChallengeIndex = Math.floor( Math.random() * challenges.length );
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge( challenge );

        new Audio('/notification.mp3').play();

            if ( Notification.permission === 'granted' )
        new Notification('Novo desafio 🎉', {
            body: `Valendo ${challenge.amount}xp`
            , silent: true
        });
    }
    
    function CompleteChallenge()
    {
        if ( !activeChallenge )
            return;

        const currentExperienceNow = currentExperience + activeChallenge.amount;

        setActiveChallenge( null );

        setCompletedChallenges( completedChallenges + 1 )
        setCurrentExperience( currentExperienceNow )

        if ( currentExperienceNow < experienceToNextLevel )
            return;

        LevelUp()
        setCurrentExperience( currentExperienceNow % experienceToNextLevel )
    }

    function ResetChallenge()
    {
        setActiveChallenge( null )
    }

    return (
        <ChallengesContext.Provider value={{
            level
            , currentExperience
            , experienceToNextLevel
            , completedChallenges
            , activeChallenge
            , StartNewChallenge
            , CompleteChallenge
            , ResetChallenge
            , CloseLevelUpModal
        }}>
            { isLevelModalOpen && <LevelUpModal /> }
            { children }
        </ChallengesContext.Provider>
    )
}
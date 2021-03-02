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

interface IConfig
{
    get: () => number;
    set: (newMsValue: number) => void;
}

interface IChallengesContextData {
    level: number;

    lastExperience: number;
    currentExperience: number;
    getExperienceToSpecificLevel: ( currentLevel?: number ) => number;

    onGainExperience: boolean;
    onLevelUp: boolean;

    inLevelingUp: boolean;
    inLevelingUpOffDelayConfig: IConfig;

    activeChallenge: IChallenge;
    completedChallenges: number;

    OpenLevelUpModal: () => void;
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

    const [currentExperience, setCurrentExperience] = useState( initiator.currentExperience ?? 30 );
    const [lastExperience, setLastExperience] = useState( 0 );

    const [onGainExperience, setOnGainExperience] = useState( false );
    const [onLevelUp, setOnLevelUp] = useState( false );

    const [inLevelingUp, setInLevelingUp] = useState( false );
    const [inLevelingUpOffDelay, setInLevelingUpOffDelay] = useState( -1 );
    const inLevelingUpOffDelayConfig = { get: () => inLevelingUpOffDelay, set: setInLevelingUpOffDelay }

    const [activeChallenge, setActiveChallenge] = useState( null );
    const [completedChallenges, setCompletedChallenges] = useState( initiator.completedChallenges ?? 0 );

    const [isLevelModalOpen, setisLevelModalOpen] = useState( false );
    
    const getExperienceToSpecificLevel = ( currentLevel = level ) => Math.pow( ( currentLevel + 1 ) * 4, 2 );

    //#endregion

    useEffect( () => {
        Notification.requestPermission();
        TriggerGainExperience()
    }, [] )
    
    {
        const cookies = { level, currentExperience, completedChallenges }
        //FIXME: COOKIES
        const handleCookies = ([key, value]: string[]) => {}//Cookies.set(key, value)
        
        useEffect(
            Array.prototype.forEach.bind( Object.entries(cookies), handleCookies )
        , [{ ...Object.keys(cookies) }] )
    }

    function TriggerGainLevel( afterGainLevel: () => void )
    {
        setInLevelingUp( true );

        setTimeout( () =>  {
            setInLevelingUp(false);
            
            setOnLevelUp( true );
            setTimeout( setOnLevelUp.bind(null, false) , 1 );

            afterGainLevel();
        }, inLevelingUpOffDelay );
    }

    function TriggerGainExperience()
    {
        setOnGainExperience( true )
        setTimeout( setOnGainExperience.bind(null, false), 0 )
    }

    function LevelUp()
    {
        setLevel( level + 1 )

        TriggerGainLevel( function afterGainLevel()
        {
            // OpenLevelUpModal()
        } )
    }

    function OpenLevelUpModal()
    {
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

        if ( Notification.permission === 'granted' ) {
            new Notification( 'Novo desafio 🎉', {
                body: `Valendo ${challenge.amount}xp`
                , silent: true
            } );
        }
    }
    
    function CompleteChallenge()
    {
        if ( !activeChallenge )
            return;

        const currentExperienceNow = currentExperience + activeChallenge.amount;
        const experienceToNextLevel = getExperienceToSpecificLevel(level);

        setActiveChallenge( null );

        setCompletedChallenges( completedChallenges + 1 )

        setLastExperience( currentExperience )
        setCurrentExperience( currentExperienceNow % experienceToNextLevel )

        TriggerGainExperience();

        if ( currentExperienceNow >= experienceToNextLevel )
            LevelUp()
    }

    function ResetChallenge()
    {
        setActiveChallenge( null )
    }

    return (
        <ChallengesContext.Provider value={{
            level
            , lastExperience
            , currentExperience
            , getExperienceToSpecificLevel
            , onGainExperience
            , onLevelUp
            , inLevelingUp
            , inLevelingUpOffDelayConfig
            , completedChallenges
            , activeChallenge
            , StartNewChallenge
            , CompleteChallenge
            , ResetChallenge
            , OpenLevelUpModal
            , CloseLevelUpModal
        }}>
            { isLevelModalOpen && <LevelUpModal /> }
            { children }
        </ChallengesContext.Provider>
    )
}
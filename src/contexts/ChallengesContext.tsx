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

interface ITimerConfig
{
    get: {
        treatedTimer: ( value?: number ) => number
        , timer: () => number
        , multiplier: () => number
    };
    set: {
        timer: (newMsValue: number) => void
        , multiplier: (newMultiplierValue: number) => void
    };
}

export enum EnumContext
{
    none
    , onGainExp
    , onLevelUp
    , onGainedExp
    , isGainingExp
    , isLevelingUp
    , isPosLevelingUp
}

interface IChallengesContextData {
    inContext: ( value?: EnumContext ) => boolean;

    level: number;

    lastExperience: number;
    currentExperience: number;
    getExperienceToSpecificLevel: ( currentLevel?: number ) => number;

    experienceUpdatingTimerConfig: ITimerConfig;

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
    currentExperience: number ;
    completedChallenges: number;
    children: ReactNode;
}

export function ChallengesContextProvider( { children, ...initiator }: IChallengesContextProviderProps ) {
    //#region UseStates 

    const [context, setContex] = useState( EnumContext.none );
    const inContext = ( value = EnumContext.none ) => context === value ;

    const [level, setLevel] = useState( initiator.level ?? 1 );

    const [currentExperience, setCurrentExperience] = useState( 0 );
    const [lastExperience, setLastExperience] = useState( 0 );

    const [experienceUpdatingTimer, setExperienceUpdatingTimer] = useState( -1 );
    const [experienceUpdatingTimerMultiplier, setExperienceUpdatingTimerMultiplier] = useState( 1 );
    const experienceUpdatingTimerConfig: ITimerConfig = {
        get: {
            treatedTimer: ( multiplier = experienceUpdatingTimerMultiplier ) => experienceUpdatingTimer * multiplier
            , timer: () => experienceUpdatingTimer
            , multiplier: () => experienceUpdatingTimerMultiplier
        }, set: {
            timer: setExperienceUpdatingTimer.bind(null)
            , multiplier: setExperienceUpdatingTimerMultiplier.bind(null)
        }
    };

    const [activeChallenge, setActiveChallenge] = useState( null );
    const [completedChallenges, setCompletedChallenges] = useState( initiator.completedChallenges ?? 0 );

    const [isLevelModalOpen, setisLevelModalOpen] = useState( false );
    
    const getExperienceToSpecificLevel = ( currentLevel = level ) => Math.pow( ( currentLevel + 1 ) * 4, 2 );

    //#endregion

    useEffect( () => {
        Notification.requestPermission();

        if ( initiator.currentExperience ) {
            GainExperience( initiator.currentExperience );
        }
    }, [] )
    
    {
        const cookies = { level, currentExperience, completedChallenges }
        const handleCookies = ([key, value]: string[]) => ( process.env.NODE_ENV !== 'development' ) && Cookies.set(key, value)
        
        useEffect(
            Array.prototype.forEach.bind( Object.entries(cookies), handleCookies )
        , [{ ...Object.keys(cookies) }] )
    }

    function NextFrame( posFrameFunction: () => void ) {
        setTimeout( posFrameFunction, 0 );
    }

    function GainExperience( value: number )
    {
        const currentExperienceNow = currentExperience + value;
        const experienceToNextLevel = getExperienceToSpecificLevel(level);

        setLastExperience( currentExperience )
        setCurrentExperience( currentExperienceNow % experienceToNextLevel )
        
        TriggerGainExperience( function afterGainExperience() {
            if ( currentExperienceNow >= experienceToNextLevel )
                LevelUp();
        } );
    }

    function LevelUp()
    {
        setLevel( level + 1 )
        
        TriggerGainLevel( OpenLevelUpModal )
    }

    function TriggerGainExperience( afterGainExperience: () => void )
    {
        setContex( EnumContext.onGainExp );
        NextFrame( () => {
            setContex(EnumContext.isGainingExp);
            afterGainExperience();
        } )
        setTimeout( () => {
            setContex(EnumContext.onGainedExp)
            NextFrame( setContex.bind(null, EnumContext.none) )
        }, experienceUpdatingTimer );
    }

    function TriggerGainLevel( afterGainLevel: () => void )
    {
        setContex( EnumContext.isLevelingUp )

        setTimeout( () =>  {
            setLastExperience( 0 );

            setContex( EnumContext.onLevelUp );
            NextFrame( setContex.bind(null, EnumContext.isPosLevelingUp) );

            afterGainLevel();
        }, experienceUpdatingTimerConfig.get.treatedTimer() );
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

        setActiveChallenge( null );

        setCompletedChallenges( completedChallenges + 1 )

        GainExperience( activeChallenge.amount );
    }

    function ResetChallenge()
    {
        setActiveChallenge( null )
    }

    return (
        <ChallengesContext.Provider value={{
            inContext
            , level
            , lastExperience
            , currentExperience
            , getExperienceToSpecificLevel
            , experienceUpdatingTimerConfig
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
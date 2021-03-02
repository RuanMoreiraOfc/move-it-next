import { ChallengesContext } from './ChallengesContext';

import { useState, useEffect, useContext, createContext, ReactNode } from "react";

interface ICountdownContextData {
    minutes: number;
    seconds: number;

    hasFinished: boolean;    
    isActive: boolean;

    // OnConclude: () => void;
    StartCountdown: () => void;
    ResetCountdown: () => void;
}

export const CountdownContext = createContext( {} as ICountdownContextData );

interface ICountdownContextProviderProps {
    children: ReactNode;
}

export function CountdownContextProvider( { children }: ICountdownContextProviderProps ) {
    
    const { StartNewChallenge } = useContext(ChallengesContext)
    
	const maxTimer = 1 || 25 * 60;
    
	const [timer, setTimer] = useState( maxTimer );
	const [isActive, setIsActive] = useState( false );
	const [hasFinished,  setHasFinished] = useState( false );

    const minutes = Math.floor(timer/60);
	const seconds = timer % 60;

    function StartCountdown()
	{
		setIsActive( true );
	}

	let countdownTimeout: NodeJS.Timeout;

	function ResetCountdown()
	{
		setTimer( maxTimer );
		setIsActive( false );
		setHasFinished( false );

		clearTimeout( countdownTimeout );
	}

    useEffect( () => {
		
		if ( isActive && timer === 0 )
			caseCountdownConclude()			
		
		else if ( isActive && timer > 0 )
			caseCountdownNonConclude()
			
	}, [isActive, timer] )

    function caseCountdownConclude()
	{
		setIsActive( false );
		setHasFinished( true );

        StartNewChallenge();
	}
	
	function caseCountdownNonConclude()
	{
		countdownTimeout = setTimeout( setTimer.bind( null, timer - 1 ), 1000 );
	}

    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            isActive,
            hasFinished,
            StartCountdown,
            ResetCountdown
        }}>
            { children }
        </CountdownContext.Provider>
    )
}
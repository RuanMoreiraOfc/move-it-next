import { useState, useEffect, createContext, ReactNode } from "react";

export interface ISessionContextData {
    isLogged: boolean;
    name: string;
    login: string;
}

export const SessionContext = createContext( {} as ISessionContextData );

interface ISessionContextProviderProps {
    children: ReactNode;
}

export default function SessionContextProvider( { children, ...initiator }: ISessionContextData & ISessionContextProviderProps ) {
    // const [name, setName] = useState( initiator.name );
    // const [login, setLogin] = useState( initiator.login );
    const isLogged = Boolean( initiator.login );
    const name = initiator.name;
    const login = initiator.login;

    return (
        <SessionContext.Provider value={{
            isLogged
            , name
            , login
        }}>
            { children }
        </SessionContext.Provider>
    )
}
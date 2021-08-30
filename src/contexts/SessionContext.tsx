import { createContext, ReactNode } from 'react';

export { SessionContext };
export default SessionContextProvider;

type SessionContextDataType = {
   isLogged: boolean;
   name: string;
   login: string;
};

const SessionContext = createContext({} as SessionContextDataType);

type ISessionContextProviderProps = {
   children: ReactNode;
} & SessionContextDataType;

function SessionContextProvider({
   children,
   ...initiator
}: ISessionContextProviderProps) {
   const isLogged = Boolean(initiator.login);
   const name = initiator.name;
   const login = initiator.login;

   return (
      <SessionContext.Provider
         value={{
            isLogged,
            name,
            login,
         }}
      >
         {children}
      </SessionContext.Provider>
   );
}

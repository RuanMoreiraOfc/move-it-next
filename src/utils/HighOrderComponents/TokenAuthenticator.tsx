// @collapse

import { ElementType, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { ValidateToken } from "../../pages/api/auth/github/validate";

import SessionContextProvider, { ISessionContextData } from "../../contexts/SessionContext";

import { LoadingAnimation } from "./components/LoadingAnimation";

import Cookies from "js-cookie";

export default function TokenAuthenticator( Component: ElementType, mustHaveValidToken: boolean = true) {
	function Wrap( props: unknown ) {
		const router = useRouter();

		const [hasAccess, setHasAccess] = useState( false );
		const [sessionProps, setSessionProps] = useState({} as ISessionContextData);

		async function ValidateAcess() {

			const token = Cookies.get('token');
			const tokenType = Cookies.get('token_type');

			const hasToken = Boolean(token);

			const IsLoginPage = () => router.pathname === '/login';

			/* ---- NO TOKEN TEST */ {

				if ( !hasToken ) if ( mustHaveValidToken ) {
					router.replace(`/login?redirect=${"need_auth"}`);
					return;
				}

				if ( !hasToken ) {
					setHasAccess(true);
					return;
				}

			}

			// ---- REQUEST
			const requestedData = await ValidateToken( tokenType, token ).catch( err => null );

			/* ---- TOKEN TEST */ {

				const tokenIsValid = Boolean( requestedData );

				if ( !tokenIsValid ) if ( mustHaveValidToken ) {
					router.replace(`/login?redirect=${"denied"}`);
					return;
				}

				if ( tokenIsValid ) if ( !IsLoginPage() ) {
					setSessionProps( requestedData.data as ISessionContextData );
				}

				setHasAccess(true);

				if ( IsLoginPage() ) {

					if ( tokenIsValid ) {
						router.replace('/');
						return;
					}

					router.replace(`/login?redirect=${"invalid"}`);

				}

			}
		}

		useEffect( ValidateAcess as () => void , []);

		return (
			!hasAccess ? (
				<LoadingAnimation />
			) : (
				<SessionContextProvider {...sessionProps} children={ <Component {...props} /> } />
			)
		)
	}

	return Wrap;
}
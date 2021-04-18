import { NextApiRequest, NextApiResponse } from "next";

import cookie, { CookieSerializeOptions } from 'cookie';

interface IRequestDealer {
    response: NextApiResponse;
    status?: number;
    json?: object | any[];
}

function GetCookieConfig( sameSite: 'lax' | 'strict' ){
    const { NODE_ENV } = process.env;

    const cookieConfig: CookieSerializeOptions = {
        secure: NODE_ENV !== 'development'
        , path: '/'
        , sameSite
    }

    return cookieConfig;
}

function CookieDealer( config?: CookieSerializeOptions ){
    return ( data: object ) => {

        const dataEntries = Object.entries(data)[0];

        return cookie.serialize(dataEntries[0], dataEntries[1] , config);
    }

}

function SetCookieDealer( config?: CookieSerializeOptions ){

    const setCookie = CookieDealer( config );

    return ( response: NextApiResponse ) =>

    ( cookies: object[] ) => {
        if ( cookies.length === 0 ) {
            return;
        }

        const serializeCookies = ( cookie: object ) => {
            const [ key, value ] = Object.entries( cookie )[0];

            return setCookie({ [key]: value });
        }

        response.setHeader('Set-Cookie', cookies.map( serializeCookies ));
    }

}

export function SetResponseCookies( sameSite: 'lax' | 'strict' = 'strict' ){

    return ( response: NextApiResponse ) => SetCookieDealer( GetCookieConfig(sameSite) )(response)

}

export function ResponseDealer( { response, status, json } : IRequestDealer ) {

    response.status( status || 404 );

    if ( !json ) {
        response.end();
        return;
    }

    response.json( json );

}

export default null;
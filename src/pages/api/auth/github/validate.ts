import { NextApiRequest, NextApiResponse } from 'next';

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { ApiUrl } from '../../utils/request';
import { SetResponseCookies } from '../../utils/response';
import { IAddBody } from '../../database/mongo/add';

export async function ValidateToken( tokenType: string, token: string ) {

    if ( !token || !tokenType ) {
        throw new Error( 'Token or Token Type is not defined!' )
    }

    const authHeader: AxiosRequestConfig = { headers: {
        'Authorization': `${tokenType} ${ token }`
    } }

    const requestedData: AxiosResponse = await axios.get('https://api.github.com/user', authHeader).catch( err => null );

    return requestedData;

}

// ---- STEP 3
export default async function Validate(request: NextApiRequest, response: NextApiResponse) {

    const { env: environment } = process;
    const { query, cookies } = request;

    /* ---- REQUEST VALIDATION */ {

        const { GITHUB_STATE: state } = environment;
        const { state: stateParam } = query;

        if ( stateParam !== state ) {
            response.status(403).redirect(`/login?redirect=${"unsafe"}`).end();
            return;
        }

    }

    /* ---- ADD TO DATABASE */ {

        const { token, token_type } = cookies;

        const validatedData: AxiosResponse = await ValidateToken( token_type, token ).catch( err => null );

        if ( !validatedData ) {
            response.status(401).redirect(`/login?redirect=${"database"}`).end();
            return;
        }

        const postAddUrl = ApiUrl( request, '/database/mongo/add' );

        const { login, name } = validatedData.data;

        const { status } = await axios.post( postAddUrl, {
            login
            , name
            , level: 1
            , tasks: 0
            , exp: 0
        } as IAddBody ).catch( ( error: AxiosError ) => ({status: error.response.status}) );

        if ( status !== 201 ) if ( status !== 406 ) {
            SetResponseCookies( 'lax' )(response)( [ {token: ''}, {token_type: ''} ] );

            response.status(401).redirect(`/login?redirect=${"database"}`).end();
            return;
        }

        SetResponseCookies( 'strict' )(response)( [ {token}, {token_type} ] );

    }

    response.status(201).redirect('/').end();
    return;

}
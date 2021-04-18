import { NextApiRequest, NextApiResponse } from "next";

import { ResponseDealer } from '../../utils/response';
import { GetCurrentDbColleciton } from './connect';
import { GetUserStatus, ISearchProps } from "./get";

export interface IAddBody extends ISetUserData {}

interface ISetUserData {
    login: string;
    name: string;

    level: number;
    tasks: number;
    exp: number;
}

interface ISetData {
    userData: ISetUserData;
}

interface ISetProps extends ISetData {
    searchProps: ISearchProps;
}

async function AddUser( { userData, searchProps } : ISetProps ) {
    const { collection } = searchProps;

    const userExist = await GetUserStatus( searchProps ) === 200;

    if ( userExist ) {
        return ( response: NextApiResponse ) => ResponseDealer( {response, status: 406, json: { warn: "Already Exists!" }} );
    }

    const { ok: successfulInsertion } = ( await collection.insertOne( userData ) ).result;

    if ( successfulInsertion ) {
        return ( response: NextApiResponse ) => ResponseDealer( {response, status: 201, json: { warn: "User Successfully Added!" }} );
    }

    return ( response: NextApiResponse ) => ResponseDealer( {response, status: 502, json: { error: 'Something went wrong, try again later!' }} );
}

export default async function (request: NextApiRequest, response: NextApiResponse) {
    if ( request.method !== "POST" ) {
        response.setHeader( "Allow", "POST" );
        ResponseDealer( { response, status: 405 } );
        return;
    }

    // TODO: SAFETY VERIFY

    const { login, ...userData }: IAddBody = request.body;

    if ( !login ) {
        ResponseDealer( { response, status: 400, json: { error: 'Login is required!' } } );
        return;
    }

    const collection = await GetCurrentDbColleciton();

    if ( collection instanceof Error ) {
        ResponseDealer( { response, status: 503, json: { error: collection.message } } );
        return;
    }

    const completeUserData: ISetUserData = Object.assign(userData, { login });

    const searchProps: ISearchProps = { filter: { login }, collection };
    const responseIt = await AddUser( {userData: completeUserData, searchProps} );

    responseIt( response );
    return;
};
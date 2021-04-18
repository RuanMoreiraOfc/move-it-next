import { NextApiRequest, NextApiResponse } from 'next';

import { EnumAcceptedMode } from '../../../utils/request/database/mode';
import { ResponseDealer } from '../../../utils/response';
import { GetUserRaw, IFilterProps, ISearchProps } from '../get';

export interface IDeleteBody extends IFilterProps {}

async function DestroyManyUsers( searchProps : ISearchProps ) {
    const { collection, filter } = searchProps;

    const { ok: successfulManyDestroy } = ( await collection.deleteMany( filter ) ).result;

    if ( successfulManyDestroy ) {
        return ( response: NextApiResponse ) => ResponseDealer( {response, status: 202, json: { warn: "Users Deleted!" }} );
    }

    return new Error( 'Users Not Deleted!' );
}

async function DestroySingleUser( searchProps : ISearchProps ) {
    const { collection, filter } = searchProps;

    const { ok: successfulSingleDestroy } = ( await collection.deleteOne( filter ) ).result;

    if ( successfulSingleDestroy ) {
        return ( response: NextApiResponse ) => ResponseDealer( {response, status: 202, json: { warn: "User Deleted!" }} );
    }

    return new Error( 'User Not Deleted!' );
}

export async function DestroyUser( searchProps : ISearchProps, mode: EnumAcceptedMode ) {
    const data = await GetUserRaw( searchProps );

    if ( !data ) {
        return ( response: NextApiResponse ) => ResponseDealer( {response, status: 204} );
    }

    /* SINGLE */ if ( mode === EnumAcceptedMode.single ) {

        const result = await DestroySingleUser( searchProps );

        if ( result instanceof Function ) {
            return result;
        }

    }

    /* MANY */ {

        const result = await DestroyManyUsers( searchProps );

        if ( result instanceof Function ) {
            return result;
        }

    }

    return ( response: NextApiResponse ) => ResponseDealer( {response, status: 502, json: { error: 'Something went wrong, try again later!' }} );
}

export default async (request: NextApiRequest, response: NextApiResponse) => response.status(308).redirect('./destroy/none').end();
import { NextApiRequest, NextApiResponse } from 'next';

import { EnumAcceptedMode, ModeFilter, IsModeAcceptable } from '../../../utils/request/database/mode';
import { ResponseDealer } from '../../../utils/response';
import { GetCurrentDbColleciton } from '../connect';
import { GetUser, IGetData, ISearchProps } from '.';

export default async function (request: NextApiRequest, response: NextApiResponse) {
    if ( request.method !== "GET" ) {
        response.setHeader( "Allow", "GET" );
        ResponseDealer( { response, status: 405 } );
        return;
    }

    const { query } = request;

    const mode: EnumAcceptedMode = IsModeAcceptable( query.mode as string )( response );
    if ( !mode ) return;

    const { mode: aidParam, ...filterParams } = query;

    if ( Object.keys( filterParams ).length === 0 ) if ( mode === EnumAcceptedMode.single ) {
        ResponseDealer( { response, status: 400, json: { error: 'Filter is Null!' } } );
        return;
    }

    const collection = await GetCurrentDbColleciton();

    if ( collection instanceof Error ) {
        ResponseDealer( { response, status: 503, json: { error: collection.message } } );
        return;
    }

    const searchProps: ISearchProps = { filter: ModeFilter(filterParams, mode) as IGetData, collection };
    const responseIt = await GetUser( searchProps );

    responseIt( response );
    return;
}
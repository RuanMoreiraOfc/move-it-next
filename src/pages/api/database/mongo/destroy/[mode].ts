import { NextApiRequest, NextApiResponse } from 'next';

// import { IVerifyRequestAcceptedBody } from '../../utils/verifyRequest';
import { EnumAcceptedMode, ModeFilter, IsModeAcceptable } from '../../../utils/request/database/mode';
import { ResponseDealer } from '../../../utils/response';
import { GetCurrentDbColleciton } from '../connect';
import { DestroyUser } from '.';
import { IFilterProps, IGetData, ISearchProps } from '../get';

export default async function (request: NextApiRequest, response: NextApiResponse) {
    if ( request.method !== "DELETE" ) {
        response.setHeader( "Allow", "DELETE" );
        ResponseDealer( { response, status: 405 } );
        return;
    }

    // TODO: SAFETY VERIFY

    const { query, body } = request;

    const mode: EnumAcceptedMode = IsModeAcceptable( query.mode as string )( response );
    if ( !mode ) return;

    const { filter }: IFilterProps = body;

    const collection = await GetCurrentDbColleciton();

    if ( collection instanceof Error ) {
        ResponseDealer( { response, status: 503, json: { error: collection.message } } );
        return;
    }

    const searchProps: ISearchProps = { filter: ModeFilter(filter, mode) as IGetData, collection };
    const responseIt = await DestroyUser( searchProps, mode );

    responseIt( response );
    return;
}
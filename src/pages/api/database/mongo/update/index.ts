import { NextApiRequest, NextApiResponse } from 'next';

import { EnumAcceptedMode } from '../../../utils/request/database/mode';
import { ResponseDealer } from '../../../utils/response';
import { GetUserStatus, IFilterProps, IGetData, ISearchProps } from '../get';

export interface IUpdateBody extends IPutData {}

interface IUserData {
    userData: IGetData;
}

export interface IPutProps extends IUserData {
    searchProps: ISearchProps;
}

export interface IPutData extends IUserData, IFilterProps {}

async function UpdateManyUsers( {userData, searchProps} : IPutProps ) {
    const { collection, filter } = searchProps;

    const { ok: successfulManyUpdate } = ( await collection.updateMany( filter, {$set: userData} ) ).result;

    if ( successfulManyUpdate ) {
        return ( response: NextApiResponse ) => ResponseDealer( {response, status: 200, json: { warn: "Users Updated!" }} );
    }

    return new Error( 'Users Not Updated!' );
}

async function UpdateSingleUser( {userData, searchProps} : IPutProps ) {
    const { collection, filter } = searchProps;

    const { ok: successfulSingleUpdated } = ( await collection.updateOne( filter, {$set: userData} ) ).result;

    if ( successfulSingleUpdated ) {
        return ( response: NextApiResponse ) => ResponseDealer( {response, status: 200, json: { warn: "User Updated!" }} );
    }

    return new Error( 'User Not Updated!' );
}

export async function UpdateUser( props : IPutProps, mode: EnumAcceptedMode ) {
    const { searchProps } = props;

    const userExist = await GetUserStatus( searchProps ) === 200;

    if ( !userExist ) {
        return ( response: NextApiResponse ) => ResponseDealer( {response, status: 204} );
    }

    /* SINGLE */ if ( mode === EnumAcceptedMode.single ) {

        const result = await UpdateSingleUser( props );

        if ( result instanceof Function ) {
            return result;
        }

    }

    /* MANY */ {

        const result = await UpdateManyUsers( props );

        if ( result instanceof Function ) {
            return result;
        }

    }

    return ( response: NextApiResponse ) => ResponseDealer( {response, status: 502, json: { error: 'Something went wrong, try again later!' }} );
}

export default async (request: NextApiRequest, response: NextApiResponse) => response.status(308).redirect('./update/none').end();
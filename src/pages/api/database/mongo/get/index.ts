import { NextApiRequest, NextApiResponse } from 'next';

import { ResponseDealer } from '../../../utils/response';

import { Collection } from 'mongodb';

export interface IGetQuery extends IGetData {}

export interface IFilterProps {
    filter: IGetData;
}

export interface ICollecitonProps {
    collection: Collection<any>;
}

export interface ISearchProps extends ICollecitonProps, IFilterProps {}

export interface IGetData {
    // _id?: string;
    login?: string;
    name?: string;

    level?: number;
    tasks?: number;
    exp?: number;
}

export async function GetUserRaw( searchProps : ISearchProps ) {
    const { collection, filter } = searchProps;

    const data = await collection.find( filter ).toArray();

    if ( data.length > 0 ) {
        return data;
    }

    return null;
}

export async function GetUser( searchProps : ISearchProps ) {
    const data = await GetUserRaw( searchProps );

    if ( data === null ) {
        return (response: NextApiResponse) => ResponseDealer( {response, status: 204} );
    }

    return (response: NextApiResponse) => ResponseDealer( { response, status: 200, json: [...data] } );
}

export async function GetUserStatus( searchProps : ISearchProps ) {
    const data = await GetUserRaw( searchProps );

    if ( data === null ) {
        return 204;
    }

    return 200;
}

export default async (request: NextApiRequest, response: NextApiResponse) => response.status(308).redirect('./get/all').end();
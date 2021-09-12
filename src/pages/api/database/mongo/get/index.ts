import { NextApiRequest, NextApiResponse } from 'next';

import { ResponseDealer } from '@sf-utils/response';

import { Collection } from 'mongodb';

export default sf_get;
export type {
  GetQueryType,
  ApiSearchOptionsType,
  SearchOptionsType,
  FilterProps,
  CollectionProps,
  SearchProps,
  GetDataType,
};
export { GetUserRaw, GetUser, GetUserStatus };

type GetQueryType = GetDataType;

type ApiSearchOptionsType = {
  limit?: string;
  skip?: string;
  sort?: '{[key: string]: -1 | 1}';
};

type SearchOptionsType = {
  limit?: number;
  skip?: number;
  sort?: { [key: string]: -1 | 1 };
};

type FilterProps = {
  filter: GetDataType;
  options?: SearchOptionsType;
};

type CollectionProps = {
  collection: Collection<any>;
};

type SearchProps = CollectionProps & FilterProps;

type GetDataType = {
  // _id?: string;
  login?: string;
  name?: string;

  level?: number;
  tasks?: number;
  exp?: number;
};

async function GetUserRaw(searchProps: SearchProps) {
  const { collection, filter, options } = searchProps;

  const data = await collection.find(filter, options).toArray();

  if (data.length > 0) {
    return data;
  }

  return null;
}

async function GetUser(searchProps: SearchProps) {
  const data = await GetUserRaw(searchProps);

  if (data === null) {
    return (response: NextApiResponse) =>
      ResponseDealer({ response, status: 204 });
  }

  return (response: NextApiResponse) =>
    ResponseDealer({ response, status: 200, json: [...data] });
}

async function GetUserStatus(searchProps: SearchProps) {
  const data = await GetUserRaw(searchProps);

  if (data === null) {
    return 204;
  }

  return 200;
}

async function sf_get(request: NextApiRequest, response: NextApiResponse) {
  response
    .status(308)
    .redirect(`./get/all?${request.url.split('?')[1] ?? ''}`)
    .end();

  return;
}

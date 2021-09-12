import type { NextApiRequest, NextApiResponse } from 'next';

import { ResponseDealer } from '@sf-utils/response';
import type { SearchProps } from '@sf-database/mongo/get';
import { GetUserStatus } from '@sf-database/mongo/get';
import { GetCurrentDbCollection } from '@sf-database/mongo/connect';

export type { AddBodyType };

type AddBodyType = SetUserDataType & { secretKey: string };

type SetUserDataType = {
  login: string;
  name: string;

  level: number;
  tasks: number;
  exp: number;
};

type SetDataType = {
  userData: SetUserDataType;
};

type AddProps = {
  searchProps: SearchProps;
} & SetDataType;

async function AddUser({ userData, searchProps }: AddProps) {
  const { collection } = searchProps;

  const userExist = (await GetUserStatus(searchProps)) === 200;

  if (userExist) {
    return (response: NextApiResponse) =>
      ResponseDealer({
        response,
        status: 406,
        json: { warn: 'Already Exists!' },
      });
  }

  const { ok: successfulInsertion } = (await collection.insertOne(userData))
    .result;

  if (successfulInsertion) {
    return (response: NextApiResponse) =>
      ResponseDealer({
        response,
        status: 201,
        json: { warn: 'User Successfully Added!' },
      });
  }

  return (response: NextApiResponse) =>
    ResponseDealer({
      response,
      status: 502,
      json: { error: 'Something went wrong, try again later!' },
    });
}

export default async function (
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    ResponseDealer({ response, status: 405 });
    return;
  }

  const { secretKey, login, ...userData }: AddBodyType = request.body;

  if (process.env.SECRET_SF_KEY !== secretKey) {
    ResponseDealer({
      response,
      status: 403,
      json: { error: 'Secret key is missing!' },
    });
    return;
  }

  if (!login) {
    ResponseDealer({
      response,
      status: 400,
      json: { error: 'Login is required!' },
    });
    return;
  }

  const collection = await GetCurrentDbCollection();

  if (collection instanceof Error) {
    ResponseDealer({
      response,
      status: 503,
      json: { error: collection.message },
    });
    return;
  }

  const completeUserData: SetUserDataType = Object.assign({}, userData, {
    login,
  });

  const searchProps: SearchProps = { filter: { login }, collection };
  const responseIt = await AddUser({ userData: completeUserData, searchProps });

  responseIt(response);
  return;
}

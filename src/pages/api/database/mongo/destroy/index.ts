import type { NextApiRequest, NextApiResponse } from 'next';

import { EnumAcceptedMode } from '@sf-utils/request/database/mode';
import { ResponseDealer } from '@sf-utils/response';
import type { FilterProps, SearchProps } from '@sf-database/mongo/get';
import { GetUserRaw } from '@sf-database/mongo/get';

export type { DeleteBodyType };
export { DestroyUser };
export default sf_destroy;

type DeleteBodyType = FilterProps;

async function DestroyManyUsers(searchProps: SearchProps) {
  const { collection, filter } = searchProps;

  const { ok: successfulManyDestroy } = (await collection.deleteMany(filter))
    .result;

  if (successfulManyDestroy) {
    return (response: NextApiResponse) =>
      ResponseDealer({
        response,
        status: 202,
        json: { warn: 'Users Deleted!' },
      });
  }

  return new Error('Users Not Deleted!');
}

async function DestroySingleUser(searchProps: SearchProps) {
  const { collection, filter } = searchProps;

  const { ok: successfulSingleDestroy } = (await collection.deleteOne(filter))
    .result;

  if (successfulSingleDestroy) {
    return (response: NextApiResponse) =>
      ResponseDealer({
        response,
        status: 202,
        json: { warn: 'User Deleted!' },
      });
  }

  return new Error('User Not Deleted!');
}

async function DestroyUser(searchProps: SearchProps, mode: EnumAcceptedMode) {
  const data = await GetUserRaw(searchProps);

  if (!data) {
    return (response: NextApiResponse) =>
      ResponseDealer({ response, status: 204 });
  }

  /* SINGLE */ if (mode === EnumAcceptedMode.single) {
    const result = await DestroySingleUser(searchProps);

    if (result instanceof Function) {
      return result;
    }
  }

  /* MANY */ {
    const result = await DestroyManyUsers(searchProps);

    if (result instanceof Function) {
      return result;
    }
  }

  return (response: NextApiResponse) =>
    ResponseDealer({
      response,
      status: 502,
      json: { error: 'Something went wrong, try again later!' },
    });
}

async function sf_destroy(request: NextApiRequest, response: NextApiResponse) {
  response.status(308).redirect('./destroy/none').end();
  return;
}

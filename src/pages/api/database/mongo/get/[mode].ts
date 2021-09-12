import type { NextApiRequest, NextApiResponse } from 'next';

import {
  EnumAcceptedMode,
  ModeFilter,
  IsModeAcceptable,
} from '@sf-utils/request/database/mode';
import { ResponseDealer } from '@sf-utils/response';
import { GetCurrentDbCollection } from '@sf-database/mongo/connect';
import type { GetDataType, ApiSearchOptionsType, SearchProps } from '.';
import { GetUser } from '.';

export default sf_get_mode;

async function sf_get_mode(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    ResponseDealer({ response, status: 405 });
    return;
  }

  const { query } = request;

  const mode: EnumAcceptedMode = IsModeAcceptable(query.mode as string)(
    response,
  );
  if (!mode) return;

  const { mode: aidParam, ...filterParams } = query;

  if (Object.keys(filterParams).length === 0)
    if (mode === EnumAcceptedMode.single) {
      ResponseDealer({
        response,
        status: 400,
        json: { error: 'Filter is Null!' },
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

  const { limit, skip, sort, ...rest } = filterParams as ApiSearchOptionsType &
    GetDataType;

  console.log();

  const searchProps: SearchProps = {
    filter: ModeFilter(rest, mode) as GetDataType,
    collection,
    options: {
      limit: limit ? Number(limit) : null,
      skip: skip ? Number(skip) : null,
      sort: sort ? JSON.parse(sort) : null,
    },
  };
  const responseIt = await GetUser(searchProps);

  responseIt(response);
  return;
}

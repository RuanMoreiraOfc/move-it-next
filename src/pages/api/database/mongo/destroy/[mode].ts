import type { NextApiRequest, NextApiResponse } from 'next';

import { ResponseDealer } from '@sf-utils/response';
import {
  EnumAcceptedMode,
  ModeFilter,
  IsModeAcceptable,
} from '@sf-utils/request/database/mode';
import { GetCurrentDbColleciton } from '@sf-database/mongo/connect';
import type {
  FilterProps,
  GetDataType,
  SearchProps,
} from '@sf-database/mongo/get';
import { DestroyUser } from '.';

export default sf_destroy_mode;

async function sf_destroy_mode(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'DELETE') {
    response.setHeader('Allow', 'DELETE');
    ResponseDealer({ response, status: 405 });
    return;
  }

  // TODO: SAFETY VERIFY

  const { query, body } = request;

  const mode: EnumAcceptedMode = IsModeAcceptable(query.mode as string)(
    response,
  );
  if (!mode) return;

  const { filter }: FilterProps = body;

  const collection = await GetCurrentDbColleciton();

  if (collection instanceof Error) {
    ResponseDealer({
      response,
      status: 503,
      json: { error: collection.message },
    });
    return;
  }

  const searchProps: SearchProps = {
    filter: ModeFilter(filter, mode) as GetDataType,
    collection,
  };
  const responseIt = await DestroyUser(searchProps, mode);

  responseIt(response);
  return;
}

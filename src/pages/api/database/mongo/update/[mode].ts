import type { NextApiRequest, NextApiResponse } from 'next';

import {
  EnumAcceptedMode,
  ModeFilter,
  IsModeAcceptable,
} from '@sf-utils/request/database/mode';
import { ResponseDealer } from '@sf-utils/response';
import type { GetDataType, SearchProps } from '@sf-database/mongo/get';
import { GetCurrentDbCollection } from '@sf-database/mongo/connect';
import type { PutDataType } from '.';
import { UpdateUser } from '.';

export default sf_update_mode;

async function sf_update_mode(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'PUT') {
    response.setHeader('Allow', 'PUT');
    ResponseDealer({ response, status: 405 });
    return;
  }

  // TODO: SAFETY VERIFY

  const { query, body } = request;

  const mode: EnumAcceptedMode = IsModeAcceptable(query.mode as string)(
    response,
  );
  if (!mode) return;

  const { filter, userData }: PutDataType = body;

  const collection = await GetCurrentDbCollection();

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
  const responseIt = await UpdateUser({ userData, searchProps }, mode);

  responseIt(response);
  return;
}

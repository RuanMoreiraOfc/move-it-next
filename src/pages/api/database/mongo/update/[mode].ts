import type { NextApiRequest, NextApiResponse } from 'next';

import {
  EnumAcceptedMode,
  ModeFilter,
  IsModeAcceptable,
} from '@sf-utils/request/database/mode';
import { ResponseDealer } from '@sf-utils/response';
import { ValidateToken } from '@sf-auth/github/validate';
import type { SearchProps } from '@sf-database/mongo/get';
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

  const { query, body, cookies } = request;

  const mode: EnumAcceptedMode = IsModeAcceptable(query.mode as string)(
    response,
  );
  if (!mode) {
    ResponseDealer({
      response,
      status: 400,
      json: { error: 'Mode is required!' },
    });
    return;
  }

  const { filter, userData }: PutDataType = body;

  if (!('login' in filter) || !filter.login) {
    ResponseDealer({
      response,
      status: 400,
      json: { error: 'Login is required!' },
    });
    return;
  }

  // TODO: STUDY ABOUT E-TAGS TO AVOID MULTIPLE VALIDATIONS
  if (
    filter.login !==
    ((await ValidateToken(cookies.token_type, cookies.token)) || null)?.data
      ?.login
  ) {
    ResponseDealer({
      response,
      status: 403,
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

  const searchProps: SearchProps = {
    filter: ModeFilter(filter, mode),
    collection,
  };
  const responseIt = await UpdateUser({ userData, searchProps }, mode);

  responseIt(response);
  return;
}

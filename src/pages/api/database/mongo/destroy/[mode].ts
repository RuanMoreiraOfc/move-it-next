import type { NextApiRequest, NextApiResponse } from 'next';

import {
  EnumAcceptedMode,
  ModeFilter,
  IsModeAcceptable,
} from '@sf-utils/request/database/mode';
import { ResponseDealer } from '@sf-utils/response';
import { ValidateToken } from '@sf-auth/github/validate';
import { GetCurrentDbCollection } from '@sf-database/mongo/connect';
import type {
  FilterOptionsType,
  FilterProps,
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

  const { filter }: FilterProps = body;

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
  const responseIt = await DestroyUser(searchProps, mode);

  responseIt(response);
  return;
}

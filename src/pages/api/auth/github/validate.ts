import type { NextApiRequest, NextApiResponse } from 'next';

import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';

import api from '@services/api';
import {
  SetResponseCookies,
  ClearResponseCookies, //
} from '@sf-utils/response';
import type { AddBodyType } from '@sf-database/mongo/add';

export default sf_validate;
export { ValidateToken };

// ---- STEP 3

async function sf_validate(request: NextApiRequest, response: NextApiResponse) {
  const { env: environment } = process;
  const { query, cookies } = request;

  /* ---- REQUEST VALIDATION */ {
    const { GITHUB_STATE: state } = environment;
    const { state: stateParam } = query;

    if (stateParam !== state) {
      response.status(403).redirect(`/login?redirect=${'unsafe'}`).end();
      return;
    }
  }

  /* ---- ADD TO DATABASE */ {
    const { token, token_type } = cookies;

    const validatedData: AxiosResponse =
      (await ValidateToken(token_type, token).catch(console.log)) || null;

    if (!validatedData) {
      ClearResponseCookies(response)([{ token }, { token_type }]);

      response.status(401).redirect(`/login?redirect=${'database'}`).end();
      return;
    }

    const { login, name } = validatedData.data;

    const { status } = await api
      .post('/database/mongo/add', {
        login,
        name,
        level: 1,
        tasks: 0,
        exp: 0,
      } as AddBodyType)
      .catch((error: AxiosError) => {
        if (error.response.status !== 406) {
          console.log(error);
          return { status: error.response.status || 404 };
        }

        return {};
      });

    if (!status) {
      response.status(200).redirect('/').end();
      return;
    }

    if (status >= 400) {
      ClearResponseCookies(response)([{ token }, { token_type }]);

      if (status !== 401) {
        response
          .status(status)
          .redirect(`/login?redirect=${`generic-${status}`}`)
          .end();
        return;
      }

      response.status(401).redirect(`/login?redirect=${'database'}`).end();
      return;
    }
  }

  response.status(201).redirect('/').end();
  return;
}

async function ValidateToken(tokenType: string, token: string) {
  if (!token || !tokenType) {
    throw new Error('Token or Token Type is not defined!');
  }

  const authHeader: AxiosRequestConfig = {
    headers: {
      Authorization: `${tokenType} ${token}`,
    },
  };

  const requestedData: AxiosResponse =
    (await axios
      .get('https://api.github.com/user', authHeader)
      .catch(console.log)) || null;

  return requestedData;
}

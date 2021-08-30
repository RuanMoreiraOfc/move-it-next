import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';

import { SetResponseCookies } from '@sf-utils/response';

export default sf_callback;

async function sf_callback(request: NextApiRequest, response: NextApiResponse) {
  const { env: environment } = process;
  const { query, headers } = request;

  // ---- STEP 2

  const { code } = query;
  const { GITHUB_STATE: state } = environment;

  /* ---- REQUEST VALIDATION */ {
    const { state: stateParam, error: errorGet } = query;

    if (!code || errorGet) {
      response.status(401).redirect(`/login?redirect=${'denied'}`).end();
      return;
    }

    if (stateParam !== state) {
      response.status(403).redirect(`/login?redirect=${'unsafe'}`).end();
      return;
    }
  }

  /* ---- REQUEST EXECUTION */ {
    const { GITHUB_CLIENT_ID: id, GITHUB_CLIENT_SECRET: secret } = environment;

    const { data } = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: id,
          client_secret: secret,
          state,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      },
    );

    // SET COOKIES

    /* ---- REQUEST VALIDATION */ {
      const { error: errorPost } = data;

      if (errorPost) {
        response.status(401).redirect(`/login?redirect=${'timeout'}`).end();
        return;
      }
    }

    /* ---- REQUEST EXECUTION */ {
      const { access_token: token, token_type } = data;

      SetResponseCookies('lax')(response)([{ token }, { token_type }]);

      response.status(307).redirect(`./validate?state=${state}`).end();
      return;
    }
  }
}

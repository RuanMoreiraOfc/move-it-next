import type { NextApiResponse } from 'next';
import type { ServerResponse } from 'node:http';

import type { CookieSerializeOptions } from 'cookie';
import cookie from 'cookie';

export default null;
export {
  SetResponseCookies,
  ClearResponseCookies, //
};

function GetCookieConfig(sameSite: 'lax' | 'strict') {
  const { NODE_ENV } = process.env;

  const cookieConfig: CookieSerializeOptions = {
    secure: NODE_ENV !== 'development',
    path: '/',
    sameSite,
  };

  return cookieConfig;
}

function CookieDealer(config?: CookieSerializeOptions) {
  return (data: object) => {
    const dataEntries = Object.entries(data)[0];

    return cookie.serialize(dataEntries[0], dataEntries[1], config);
  };
}

function SetCookieDealer(config?: CookieSerializeOptions) {
  const setCookie = CookieDealer(config);

  return (response: NextApiResponse | ServerResponse) => (cookies: object[]) => {
    if (cookies.length === 0) {
      return;
    }

    const serializeCookies = (cookie: object) => {
      const [key, value] = Object.entries(cookie)[0];

      return setCookie({ [key]: value });
    };

    response.setHeader('Set-Cookie', cookies.map(serializeCookies));
  };
}

function SetResponseCookies(sameSite: 'lax' | 'strict' = 'strict') {
  return (response: NextApiResponse | ServerResponse) =>
    SetCookieDealer(GetCookieConfig(sameSite))(response);
}

function ClearResponseCookies(response: NextApiResponse | ServerResponse) {
  return SetCookieDealer({
    ...GetCookieConfig('strict'),
    expires: new Date(0),
  })(response);
}

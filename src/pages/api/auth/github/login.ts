import type { NextApiRequest, NextApiResponse } from 'next';

export default sf_login;

function sf_login(request: NextApiRequest, response: NextApiResponse) {
  const username = request.query.username;
  const { GITHUB_STATE: state, GITHUB_CLIENT_ID: id } = process.env;

  const url = `https://github.com/login/oauth/authorize
      ?client_id=${id}
      &state=${state}
      &login=${username ?? ''}
    `.replace(/\s/g, '');

  response.status(200).redirect(url).end();
}

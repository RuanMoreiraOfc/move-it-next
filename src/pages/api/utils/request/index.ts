import type { NextApiRequest } from 'next';
import type { IncomingMessage } from 'node:http';

export { ProtocolBase, ApiUrl };
export default null;

function ProtocolBase() {
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http://' : 'https://';

  return protocol;
}

function ApiUrl(request: NextApiRequest | IncomingMessage, path: string) {
  const { host } = request.headers;

  const protocol = ProtocolBase();
  const url = protocol + host + '/api' + path;

  return url;
}

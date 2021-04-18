import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage } from 'node:http';

import { ResponseDealer } from '../response';

export function ProtocolBase() {
    const { NODE_ENV } = process.env;

    const protocol = NODE_ENV === 'development' ? 'http://' : 'https://';

    return protocol;
}

export function ApiUrl( request: NextApiRequest | IncomingMessage , path: string ) {
    const { host } = request.headers;

    const protocol = ProtocolBase();
    const url = protocol + host + '/api' + path;

    return url;
}

export default null;
import type { NextApiResponse } from 'next';

export { ResponseDealer };

export default null;

type RequestDealerType = {
  response: NextApiResponse;
  status?: number;
  json?: object | any[];
};

function ResponseDealer({ response, status, json }: RequestDealerType) {
  response.status(status || 404);

  if (!json) {
    response.end();
    return;
  }

  response.json(json);
}

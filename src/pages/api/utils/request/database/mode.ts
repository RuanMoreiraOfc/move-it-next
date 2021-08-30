import type { NextApiResponse } from 'next';

import { ResponseDealer } from '@sf-utils/response';

export { EnumAcceptedMode, IsModeAcceptable, ModeFilter };

export default null;

enum EnumAcceptedMode {
  all = 1,
  single,
  multiple,
}

/** Has a response dealer built-in! */
function IsModeAcceptable(mode: string) {
  const modesAsArray = Object.values(EnumAcceptedMode);
  const acceptedModes = modesAsArray.filter((current) =>
    isNaN(Number(current)),
  ) as string[];

  if (acceptedModes.find((current) => current === mode)) {
    return (response: NextApiResponse) => EnumAcceptedMode[mode];
  }

  return (response: NextApiResponse) =>
    ResponseDealer({
      response,
      status: 400,
      json: {
        error: 'Mode is Unavailable!',
        acceptedValues: acceptedModes,
      },
    });
}

function ModeFilter(filter: object, mode: EnumAcceptedMode) {
  if (mode === EnumAcceptedMode.all) {
    return {};
  }

  if (filter) {
    return filter;
  }

  throw new Error('Needs filter for this request!');
}

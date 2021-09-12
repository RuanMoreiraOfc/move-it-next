import type { NextApiResponse } from 'next';

import { ResponseDealer } from '@sf-utils/response';
import type { FilterOptionsType } from '@sf-database/mongo/get';

export default null;
export { EnumAcceptedMode, IsModeAcceptable, ModeFilter };

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

function ModeFilter(
  filter: FilterOptionsType,
  mode: EnumAcceptedMode,
): {} | FilterOptionsType {
  if (mode === EnumAcceptedMode.all) {
    return {};
  }

  if (filter) {
    return filter;
  }

  throw new Error('Needs filter for this request!');
}

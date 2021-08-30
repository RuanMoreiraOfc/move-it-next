import { NextApiRequest, NextApiResponse } from 'next';

import { EnumAcceptedMode } from '@sf-utils/request/database/mode';
import { ResponseDealer } from '@sf-utils/response';
import { GetUserStatus, FilterProps, GetDataType, SearchProps } from '../get';

export type { UpdateBodyType, PutProps as PutProps, PutDataType };
export { UpdateUser };
export default sf_update;

type UpdateBodyType = PutDataType;

type UserDataType = {
  userData: GetDataType;
};

type PutProps = {
  searchProps: SearchProps;
} & UserDataType;

type PutDataType = UserDataType & FilterProps;

async function UpdateManyUsers({ userData, searchProps }: PutProps) {
  const { collection, filter } = searchProps;

  const { ok: successfulManyUpdate } = (
    await collection.updateMany(filter, { $set: userData })
  ).result;

  if (successfulManyUpdate) {
    return (response: NextApiResponse) =>
      ResponseDealer({
        response,
        status: 200,
        json: { warn: 'Users Updated!' },
      });
  }

  return new Error('Users Not Updated!');
}

async function UpdateSingleUser({ userData, searchProps }: PutProps) {
  const { collection, filter } = searchProps;

  const { ok: successfulSingleUpdated } = (
    await collection.updateOne(filter, { $set: userData })
  ).result;

  if (successfulSingleUpdated) {
    return (response: NextApiResponse) =>
      ResponseDealer({
        response,
        status: 200,
        json: { warn: 'User Updated!' },
      });
  }

  return new Error('User Not Updated!');
}

async function UpdateUser(props: PutProps, mode: EnumAcceptedMode) {
  const { searchProps } = props;

  const userExist = (await GetUserStatus(searchProps)) === 200;

  if (!userExist) {
    return (response: NextApiResponse) =>
      ResponseDealer({ response, status: 204 });
  }

  /* SINGLE */ if (mode === EnumAcceptedMode.single) {
    const result = await UpdateSingleUser(props);

    if (result instanceof Function) {
      return result;
    }
  }

  /* MANY */ {
    const result = await UpdateManyUsers(props);

    if (result instanceof Function) {
      return result;
    }
  }

  return (response: NextApiResponse) =>
    ResponseDealer({
      response,
      status: 502,
      json: { error: 'Something went wrong, try again later!' },
    });
}

async function sf_update(request: NextApiRequest, response: NextApiResponse) {
  response.status(308).redirect('./update/none').end();
  return;
}

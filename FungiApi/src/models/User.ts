import { isString } from 'jet-validators';
import { parseObject, TParseOnError } from 'jet-validators/utils';
import bcrypt from 'bcryptjs';

import { isRelationalKey, transIsDate } from '@src/common/util/validators';
import { IModel } from './common/types';

/******************************************************************************
                                 Constants
******************************************************************************/

const DEFAULT_USER_VALS = (): IUser => ({
  id: -1,
  name: '',
  created: new Date(),
  email: '',
  password: '',
  role: 'user'
});

/******************************************************************************
                                  Types
******************************************************************************/

export interface IUser extends IModel {
  name: string;
  email: string;
  password?: string;
  role?: string;
}

/******************************************************************************
                                  Setup
******************************************************************************/

// Initialize the "parseUser" function
const parseUser = parseObject<IUser>({
  id: isRelationalKey,
  name: isString,
  email: isString,
  created: transIsDate,
  password: isString,
  role: isString
});

/******************************************************************************
                                 Functions
******************************************************************************/

/**
 * New user object.
 */
function newUser(user?: Partial<IUser>): IUser {
  const retVal = { ...DEFAULT_USER_VALS(), ...user };
  return parseUser(retVal, errors => {
    throw new Error('Setup new user failed ' + JSON.stringify(errors, null, 2));
  });
}

/**
 * Check is a user object. For the route validation.
 */
function testUser(arg: unknown, errCb?: TParseOnError): arg is IUser {
  return !!parseUser(arg, errCb);
}

/**
 * Hash a password
 */
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Compare password
 */
async function comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, hashedPassword);
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  new: newUser,
  test: testUser,
  hashPassword,
  comparePassword
} as const;

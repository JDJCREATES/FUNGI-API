import jetEnv, { num } from 'jet-env';
import { isEnumVal } from 'jet-validators';

import { cleanEnv, str, port, host } from 'envalid';
import { NodeEnvs } from '.';


/******************************************************************************
                                 Setup
******************************************************************************/

const ENV = cleanEnv(process.env, {
  // existing validators
  NodeEnv: str({
    choices: ['development', 'production', 'test'] as const,
    desc: 'The application environment',
  }),
  Port: port({
    default: 3000,
    desc: 'Port to bind the HTTP server to',
  }),

  // Add this validator for your Mongo URI:
  MONGODB_URI: str({
    desc: 'MongoDB connection string',
  }),



});

/******************************************************************************
                            Export default
******************************************************************************/

export default ENV;

import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().default(3000),
  SQL_MEMORY_DB_SHARED: Joi.string().required(),
  API_BEARER: Joi.string().required(),
});

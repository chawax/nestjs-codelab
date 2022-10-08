export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    path: process.env.SQL_MEMORY_DB_SHARED,
  },
  security: {
    apiBearer: process.env.API_BEARER,
  },
});

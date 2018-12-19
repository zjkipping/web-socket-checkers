export default {
  port: 8080,
  saltRounds: 10,
  accessSecret: '',
  accessLife: '10m',
  refreshSecret: '',
  refreshLife: '7d',
  dbConfig: {
    host: '',
    user: '',
    password: '',
    database: '',
    connectTimeout: 1000000,
    connectionLimit: 100
  }
}

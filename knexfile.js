// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'Cluckr',
      username: 'jigs',
      password: 'supersecret'
    },
    migrations: {
      directory: './db/migrations'
    }
  }

};
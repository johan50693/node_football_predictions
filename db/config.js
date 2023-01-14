import mysql from 'mysql2/promise';

export const connection = await mysql.createPool({
  host: 'us-east.connect.psdb.cloud',
  user: '3vag23v9e449t78rxe12',
  password: 'pscale_pw_uHMtyDzzGK1n2en84xTqJ0GmB18A3f9CO4S6lfkfcH1',
  database: 'soccer_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

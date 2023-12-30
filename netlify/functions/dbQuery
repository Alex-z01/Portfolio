// netlify/functions/dbQuery.js

const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL);

exports.handler = async function (event, context) {
  try {
    // Example query to fetch data from a 'users' table
    const data = await db.any('SELECT * FROM projects');

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    console.error('Error executing database query:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

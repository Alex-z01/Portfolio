// netlify/functions/projectsByLetter.js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Only for development. Don't use in production without proper SSL setup.
  },
});

exports.handler = async function (event, context) {
  try {
    const { letter } = event.queryStringParameters;

    if (!letter || letter.length !== 1 || !/^[a-zA-Z]$/.test(letter)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid or missing letter parameter' }),
      };
    }

    const client = await pool.connect();

    try {
      // Example query to fetch projects starting with the specified letter
      const result = await client.query(
        'SELECT * FROM projects WHERE name ILIKE $1',
        [`${letter}%`]
      );
      const projects = result.rows;

      return {
        statusCode: 200,
        body: JSON.stringify({ projects }),
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error executing database query:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

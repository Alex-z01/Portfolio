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

    console.log('Received letter:', letter);

    let query;

    if (letter && letter.length === 1 && /^[a-zA-Z]$/.test(letter)) {
      query = {
        text: 'SELECT * FROM projects WHERE title ILIKE $1',
        values: [`${letter}%`],
      };
    } else {
      query = {
        text: 'SELECT * FROM projects',
      };
    }

    const client = await pool.connect();

    try {
      const result = await client.query(query);
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
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};

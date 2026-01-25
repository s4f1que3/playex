// Database connection pooling and optimization
// backend/utils/dbPool.js

const mysql = require('mysql2/promise');

let pool = null;

/**
 * Create a database connection pool for efficient connection management
 */
const createPool = async () => {
  if (pool) {
    return pool;
  }

  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'playex',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelayMs: 0,
      // Connection timeout
      connectionTimeout: 10000,
      // Idle timeout
      idleTimeout: 60000,
      // Max connection idle time before recycling
      maxIdle: 5 * 60 * 1000
    });

    console.log('Database connection pool created successfully');
    return pool;
  } catch (error) {
    console.error('Failed to create database pool:', error);
    throw error;
  }
};

/**
 * Get a connection from the pool
 */
const getConnection = async () => {
  if (!pool) {
    await createPool();
  }

  return pool.getConnection();
};

/**
 * Execute query with connection from pool
 */
const query = async (sql, values = []) => {
  const connection = await getConnection();

  try {
    const [results] = await connection.execute(sql, values);
    return results;
  } finally {
    connection.release();
  }
};

/**
 * Execute multiple queries in a transaction
 */
const transaction = async (queries) => {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const results = [];
    for (const [sql, values] of queries) {
      const [result] = await connection.execute(sql, values);
      results.push(result);
    }

    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Close the connection pool
 */
const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database connection pool closed');
  }
};

/**
 * Get pool statistics
 */
const getPoolStats = async () => {
  if (!pool) {
    return null;
  }

  return {
    activeConnections: pool._allConnections.length,
    idleConnections: pool._freeConnections.length,
    queuedRequests: pool._connectionQueue.length
  };
};

module.exports = {
  createPool,
  getConnection,
  query,
  transaction,
  closePool,
  getPoolStats
};

import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.error(`Redis client not connected to server: ${error}`);
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected to Redis server');
    } catch (error) {
      console.error(`Error connecting to Redis server: ${error}`);
    }
  }

  isAlive() {
    return this.client.connected;
  }

  async set(key, value) {
    try {
      await this.client.set(key, value);
      console.log(`Key "${key}" set in Redis`);
    } catch (error) {
      console.error(`Error setting key "${key}" in Redis: ${error}`);
    }
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      console.log(`Value for key "${key}": ${value}`);
      return value;
    } catch (error) {
      console.error(`Error getting value for key "${key}" from Redis: ${error}`);
      return null;
    }
  }

  async hSet(key, hash) {
    try {
      await this.client.hmset(key, hash);
      console.log(`Hash set for key "${key}" in Redis`);
    } catch (error) {
      console.error(`Error setting hash for key "${key}" in Redis: ${error}`);
    }
  }

  async hGetAll(key) {
    try {
      const hash = await this.client.hgetall(key);
      console.log(`Hash for key "${key}":`, JSON.stringify(hash, null, 2));
      return hash;
    } catch (error) {
      console.error(`Error getting hash for key "${key}" from Redis: ${error}`);
      return {};
    }
  }

  async close() {
    try {
      await this.client.quit();
      console.log('Closed connection to Redis server');
    } catch (error) {
      console.error(`Error closing connection to Redis server: ${error}`);
    }
  }
}

const example = async () => {
  const client = new RedisClient();

  try {
    // Ensure the client is connected
    await client.connect();

    // Set a key-value pair
    await client.set('key', 'value');

    // Get the value for a key
    const value = await client.get('key');

    // Set a hash for a key
    await client.hSet('user-session:123', {
      name: 'John',
      surname: 'Smith',
      company: 'Redis',
      age: 29,
    });

    // Get all fields and values of a hash
    const userSession = await client.hGetAll('user-session:123');
  } finally {
    // Close the connection when done
    await client.close();
  }
};

example();

// Note: You may want to handle errors and close the connection appropriately in a production scenario.
const redisClient = new RedisClient();

module.exports = redisClient;
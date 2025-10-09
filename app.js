// app.js

const fastify = require("fastify")({ logger: true });
const { Pool } = require("pg");
require("dotenv").config();

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test DB connection route
fastify.get("/test", async (request, reply) => {
  try {
    const res = await pool.query("SELECT NOW()");
    return { status: "success", timestamp: res.rows[0] };
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});

// CRUD Example for "users" table

// GET all users
fastify.get("/jobs", async (request, reply) => {
  try {
    const res = await pool.query("SELECT * FROM towing_jobs_2");
    return { users: res.rows };
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});

// GET user by ID
fastify.get("/users/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return { user: res.rows[0] };
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});

// POST create user
fastify.post("/jobs", async (request, reply) => {
  try {
    const { name, email } = request.body;
    const res = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    reply.code(201).send({ user: res.rows[0] });
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});

// PUT update user
fastify.put("/jobs/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    const { name, email } = request.body;
    const res = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    return { user: res.rows[0] };
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});

// DELETE user
fastify.delete("/jobs/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    reply.code(204).send();
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});

// Start server
fastify.listen({ port: 4000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on ${address}`);
});

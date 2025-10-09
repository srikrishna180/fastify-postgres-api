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
fastify.get("/quotes", async (request, reply) => {
  try {
    const res = await pool.query("SELECT * FROM quotes");
    return { quotes: res.rows };
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});

// GET user by ID
fastify.get("/quotes/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    const res = await pool.query("SELECT * FROM quotes WHERE id = $1", [id]);
    return { user: res.rows[0] };
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});

// POST create user
fastify.post("/quotes", async (request, reply) => {
  try {
    const {
      fullName,
      emailAddress,
      phone,
      regoNumber,
      pickupAddress,
      notes,
      status = "pending",
    } = request.body;

    const res = await pool.query(
      `INSERT INTO quotes (
        quote_full_name,
        quote_email_address,
        quote_phone,
        quote_rego_number,
        quote_pickup_address,
        quote_notes,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        fullName,
        emailAddress,
        phone,
        regoNumber,
        pickupAddress,
        notes,
        status || "pending",
      ]
    );

    reply.code(201).send({ quote: res.rows[0] });
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});

// PUT update user
fastify.put("/quotes/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    const {
      fullName,
      emailAddress,
      phone,
      regoNumber,
      pickupAddress,
      notes,
      status,
    } = request.body;

    const res = await pool.query(
      `UPDATE quotes SET
        quote_full_name = $1,
        quote_email_address = $2,
        quote_phone = $3,
        quote_rego_number = $4,
        quote_pickup_address = $5,
        quote_notes = $6,
        status = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *`,
      [
        fullName,
        emailAddress,
        phone,
        regoNumber,
        pickupAddress,
        notes,
        status,
        id,
      ]
    );

    if (res.rows.length === 0) {
      return reply.code(404).send({ error: "Quote not found" });
    }

    return { quote: res.rows[0] };
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});

// DELETE user
fastify.delete("/quotes/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    await pool.query("DELETE FROM quotes WHERE id = $1", [id]);
    reply.code(204).send();
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});

// Start server
fastify.listen({ port: 4000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on ${address}`);
});

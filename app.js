// app.js

const fastify = require("fastify")({ logger: true });
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body;

    try {
        const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = res.rows[0];

        if (!user) {
            return reply.code(401).send({ error: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return reply.code(401).send({ error: "Invalid credentials" });
        }

        // Create JWT payload
        const token = fastify.jwt.sign(
            { id: user.id, email: user.email },
            { expiresIn: "1h" }
        );

        reply.send({ token });
    } catch (err) {
        reply.status(500).send({ error: err.message });
    }
});

fastify.decorate("authenticate", async (request, reply) => {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) throw new Error("Missing token");

        const token = authHeader.split(" ")[1]; // "Bearer <token>"
        const decoded = await fastify.jwt.verify(token);
        request.user = decoded;
    } catch (err) {
        reply.code(401).send({ error: "Unauthorized" });
    }
});

fastify.post("/register", async (request, reply) => {
    const { fullName, email, password } = request.body;

    const hashed = await bcrypt.hash(password, 10);

    try {
        const res = await pool.query(
            `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, full_name, email`,
            [fullName, email, hashed]
        );

        reply.code(201).send({ user: res.rows[0] });
    } catch (err) {
        reply.status(500).send({ error: err.message });
    }
});


fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'supersecretkey' // Use .env for real
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
// fastify.get("/quotes", async (request, reply) => {
//   try {
//     const res = await pool.query("SELECT * FROM quotes");
//     return { quotes: res.rows };
//   } catch (err) {
//     reply.status(500).send({ error: err.message });
//   }
// });

fastify.get("/quotes", { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
    const updates = request.body;

    if (!id) {
      return reply.code(400).send({ error: "Missing quote ID" });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return reply.code(400).send({ error: "No fields provided to update" });
    }

    // Build dynamic SET clause
    const setClauses = [];
    const values = [];
    let index = 1;

    for (const [field, value] of Object.entries(updates)) {
      setClauses.push(`${field} = $${index}`);
      values.push(value);
      index++;
    }

    // Add updated_at timestamp
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

    // Final query
    const query = `
      UPDATE quotes
      SET ${setClauses.join(", ")}
      WHERE id = $${index}
      RETURNING *`;

    values.push(id);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return reply.code(404).send({ error: "Quote not found" });
    }

    return { quote: result.rows[0] };
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Internal Server Error" });
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

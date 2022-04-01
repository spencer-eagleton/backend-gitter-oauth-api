const pool = require('../utils/pool');

module.exports = class Post {
  id;
  body;
  user_id;

  constructor(row) {
    this.body = row.body;
    this.id = row.id;
    this.userId = row.user_id
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
          SELECT *
          FROM posts
          `
    );
    return rows.map((row) => new Post(row));
  }

  static async create({ body, id }) {
    const { rows } = await pool.query(
      `
          INSERT INTO posts (body, user_id)
          VALUES ($1, $2)
          RETURNING *
          `,
      [body, id]
    );
    return new Post(rows[0]);
  }
};

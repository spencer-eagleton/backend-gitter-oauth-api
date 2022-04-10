const pool = require('../utils/pool');

module.exports = class Post {
  id;
  body;
  user_id;

  constructor(row) {
    this.body = row.body;
    this.id = row.id;
    this.userId = row.user_id;
  }

  static async getAll() {
    return pool
      .query(
        `
          SELECT *
          FROM posts
          `
      )
      .then(({ rows }) => rows.map((row) => new Post(row)));
  }

  static async create({ body, id }) {
    return pool
      .query(
        `
          INSERT INTO posts (body, user_id)
          VALUES ($1, $2)
          RETURNING *
          `,
        [body, id]
      )
      .then(({ rows }) => new Post(rows[0]));
  }
};

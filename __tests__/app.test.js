const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const GithubUser = require('../lib/models/GithubUser');

jest.mock('../lib/utils/github');

describe('backend-gitter-oauth-api routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('redirects user to the github login oauth page', async () => {
    const req = await request(app).get('/api/v1/github/login');

    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });

  it('should login and redirect users to /api/v1/github/', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    expect(res.req.path).toEqual('/api/v1/posts');
  });

  it('logs out a user', async () => {
    const agent = request.agent(app);

    const res = await agent
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    expect(res.req.path).toEqual('/api/v1/posts');

    const expected = await agent.delete('/api/v1/github/logout');

    expect(expected.body).toEqual({ message: 'you have been logged out' });
  });

  it('allows the logged in user to view list of posts', async () => {
    const agent = request.agent(app);

    let res = await agent.get('/api/v1/posts');
    expect(res.status).toEqual(401);

    await agent
      .get('/api/v1/github/login/callback?code=42');

    res = await agent.get('/api/v1/posts');
    expect(res.status).toEqual(200);
  });
});

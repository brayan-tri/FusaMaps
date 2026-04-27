const request = require('supertest');
const app = require('../app');

describe('POST /api/auth/register', () => {
    it('registra un usuario nuevo y retorna tokens', async () => {
    const res = await request(app)
        .post('/api/auth/register')
        .send({
        nombre: 'Usuario Test',
        email: `test_${Date.now()}@fusamaps.co`,
        password: 'Test1234!'
        });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data.usuario).not.toHaveProperty('password_hash');
    });

    it('rechaza email duplicado con 409', async () => {
    const email = `dup_${Date.now()}@fusamaps.co`;

    await request(app)
        .post('/api/auth/register')
        .send({ nombre: 'Dup', email, password: 'Test1234!' });

    const res = await request(app)
        .post('/api/auth/register')
        .send({ nombre: 'Dup', email, password: 'Test1234!' });

    expect(res.status).toBe(409);
    });

    it('rechaza registro sin password con 400', async () => {
    const res = await request(app)
        .post('/api/auth/register')
        .send({ nombre: 'Sin pass', email: 'nopass@fusamaps.co' });

    expect(res.status).toBe(400);
    });
});

describe('POST /api/auth/login', () => {
    const email = `login_${Date.now()}@fusamaps.co`;
    const password = 'Login1234!';

    beforeAll(async () => {
    await request(app)
        .post('/api/auth/register')
        .send({ nombre: 'Login Test', email, password });
    });

    it('login con credenciales válidas retorna 200 y tokens', async () => {
    const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    });

    it('login con contraseña incorrecta retorna 401', async () => {
    const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'Incorrecta123!' });

    expect(res.status).toBe(401);
    });

    it('login con email inexistente retorna 401', async () => {
    const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'noexiste@fusamaps.co', password: 'Test1234!' });

    expect(res.status).toBe(401);
    });
});
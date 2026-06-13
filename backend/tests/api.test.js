const jwt = require('jsonwebtoken');
const request = require('supertest');

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
  transaction: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('../src/config/prisma', () => mockPrisma);
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const bcrypt = require('bcrypt');

process.env.JWT_SECRET = 'test-secret';

const app = require('../src/app');

describe('backend api', () => {
  const token = jwt.sign({ id: 1, username: 'admin' }, process.env.JWT_SECRET);

  beforeEach(() => {
    jest.clearAllMocks();

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 1,
      username: 'admin',
      password: 'hashed-password',
    });

    mockPrisma.transaction.findMany.mockResolvedValue([]);
    mockPrisma.transaction.findUnique.mockResolvedValue(null);
    mockPrisma.transaction.create.mockImplementation(async ({ data }) => ({
      id: 10,
      ...data,
      createdAt: new Date('2026-06-12T10:00:00.000Z'),
      updatedAt: new Date('2026-06-12T10:00:00.000Z'),
    }));
    mockPrisma.transaction.update.mockImplementation(async ({ where, data }) => ({
      id: where.id,
      kode: 'T-UPDATED123456',
      ...data,
      createdAt: new Date('2026-06-12T10:00:00.000Z'),
      updatedAt: new Date('2026-06-12T11:00:00.000Z'),
    }));
    mockPrisma.transaction.delete.mockResolvedValue({ id: 10 });

    bcrypt.compare.mockResolvedValue(true);
  });

  test('GET /api/health returns ok', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('POST /api/auth/login validates payload', async () => {
    const response = await request(app).post('/api/auth/login').send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username wajib diisi.');
  });

  test('POST /api/auth/login rejects invalid password', async () => {
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrong' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Username atau password salah.');
  });

  test('POST /api/auth/login returns token and user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login berhasil.');
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toEqual({ id: 1, username: 'admin' });
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'admin' },
    });
  });

  test('GET /api/transactions requires token', async () => {
    const response = await request(app).get('/api/transactions');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token tidak ditemukan.');
  });

  test('GET /api/transactions returns list', async () => {
    mockPrisma.transaction.findMany.mockResolvedValue([
      {
        id: 1,
        kode: 'T-ABC123DEF456',
        transactionDatetime: new Date('2026-06-12T08:00:00.000Z'),
        productType: 'Oli',
        quantity: 2,
        unitPrice: 20000,
        paymentType: 'Cash',
        createdAt: new Date('2026-06-12T08:00:00.000Z'),
        updatedAt: new Date('2026-06-12T08:00:00.000Z'),
      },
    ]);

    const response = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      id: 1,
      kode: 'T-ABC123DEF456',
      productType: 'Oli',
      paymentType: 'Cash',
      totalPrice: 40000,
    });
  });

  test('GET /api/transactions/:id validates id', async () => {
    const response = await request(app)
      .get('/api/transactions/abc')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('ID tidak valid.');
  });

  test('GET /api/transactions/:id returns not found', async () => {
    const response = await request(app)
      .get('/api/transactions/10')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Transaksi tidak ditemukan.');
  });

  test('GET /api/transactions/:id returns data', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValueOnce({
      id: 10,
      kode: 'T-ABC123DEF456',
      transactionDatetime: new Date('2026-06-12T08:00:00.000Z'),
      productType: 'Tambal_Ban',
      quantity: 3,
      unitPrice: 10000,
      paymentType: 'E_money',
      createdAt: new Date('2026-06-12T08:00:00.000Z'),
      updatedAt: new Date('2026-06-12T08:00:00.000Z'),
    });

    const response = await request(app)
      .get('/api/transactions/10')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: 10,
      kode: 'T-ABC123DEF456',
      productType: 'Tambal Ban',
      paymentType: 'e-money',
      totalPrice: 30000,
    });
  });

  test('POST /api/transactions validates payload', async () => {
    const response = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Tanggal transaksi wajib diisi.');
  });

  test('POST /api/transactions creates transaction', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        transactionDatetime: '2026-06-12T10:00:00.000Z',
        productType: 'Oli',
        quantity: 2,
        unitPrice: 20000,
        paymentType: 'Cash',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Transaksi berhasil ditambahkan.');
    expect(response.body.data).toMatchObject({
      productType: 'Oli',
      paymentType: 'Cash',
      quantity: 2,
      unitPrice: 20000,
      totalPrice: 40000,
    });
    expect(mockPrisma.transaction.create).toHaveBeenCalled();
  });

  test('PUT /api/transactions/:id validates id', async () => {
    const response = await request(app)
      .put('/api/transactions/abc')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('ID tidak valid.');
  });

  test('PUT /api/transactions/:id returns not found', async () => {
    const response = await request(app)
      .put('/api/transactions/10')
      .set('Authorization', `Bearer ${token}`)
      .send({
        transactionDatetime: '2026-06-12T10:00:00.000Z',
        productType: 'Oli',
        quantity: 2,
        unitPrice: 20000,
        paymentType: 'Cash',
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Transaksi tidak ditemukan.');
  });

  test('PUT /api/transactions/:id updates transaction', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValueOnce({ id: 10 });

    const response = await request(app)
      .put('/api/transactions/10')
      .set('Authorization', `Bearer ${token}`)
      .send({
        transactionDatetime: '2026-06-12T10:00:00.000Z',
        productType: 'Oli',
        quantity: 4,
        unitPrice: 20000,
        paymentType: 'Cash',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Transaksi berhasil diperbarui.');
    expect(response.body.data).toMatchObject({
      id: 10,
      quantity: 4,
      productType: 'Oli',
      paymentType: 'Cash',
      totalPrice: 80000,
    });
  });

  test('DELETE /api/transactions/:id validates id', async () => {
    const response = await request(app)
      .delete('/api/transactions/abc')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('ID tidak valid.');
  });

  test('DELETE /api/transactions/:id returns not found', async () => {
    mockPrisma.transaction.delete.mockRejectedValueOnce({ code: 'P2025' });

    const response = await request(app)
      .delete('/api/transactions/10')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Transaksi tidak ditemukan.');
  });

  test('DELETE /api/transactions/:id deletes transaction', async () => {
    const response = await request(app)
      .delete('/api/transactions/10')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Transaksi berhasil dihapus.');
  });
});
const request = require('supertest');
const express = require('express');
const fileUploadRoutes = require('../server/routes/fileUpload');

const app = express();
app.use('/upload', fileUploadRoutes);

describe('POST /upload', () => {
  it('should upload a file and return success', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', 'tests/sample.txt');

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('File processed');
  });
});

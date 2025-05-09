const express = require('express');
const router = express.Router();
const pool = require('../services/db');

router.get('/test-db', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM restaurants');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

module.exports = router;
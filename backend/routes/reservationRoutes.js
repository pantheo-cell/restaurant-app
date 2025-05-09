
const express = require('express');
const pool = require('../services/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Δημιουργία νέας κράτησης
router.post('/reservations', authMiddleware, async (req, res) => {
  const { restaurant_id, reservation_date, reservation_time, people_count } = req.body;
  const user_id = req.user.userId;

  try {
    const conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO reservations (user_id, restaurant_id, reservation_date, reservation_time, people_count) VALUES (?, ?, ?, ?, ?)',
      [user_id, restaurant_id, reservation_date, reservation_time, people_count]
    );
    conn.release();
    res.status(201).json({ message: 'Reservation created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// Προβολή κρατήσεων χρήστη
router.get('/user/reservations', authMiddleware, async (req, res) => {
  const user_id = req.user.userId;

  try {
    const conn = await pool.getConnection();
    const reservations = await conn.query(
      `SELECT r.*, rest.name AS restaurant_name, rest.location 
       FROM reservations r
       JOIN restaurants rest ON r.restaurant_id = rest.restaurant_id
       WHERE r.user_id = ?`,
      [user_id]
    );
    conn.release();
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Τροποποίηση κράτησης
router.put('/reservations/:id', authMiddleware, async (req, res) => {
  const reservationId = req.params.id;
  const userId = req.user.userId;
  const { reservation_date, reservation_time, people_count } = req.body;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      `UPDATE reservations 
       SET reservation_date = ?, reservation_time = ?, people_count = ? 
       WHERE reservation_id = ? AND user_id = ?`,
      [reservation_date, reservation_time, people_count, reservationId, userId]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found or unauthorized' });
    }

    res.json({ message: 'Reservation updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

// Διαγραφή κράτησης
router.delete('/reservations/:id', authMiddleware, async (req, res) => {
  const reservationId = req.params.id;
  const userId = req.user.userId;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      'DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?',
      [reservationId, userId]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found or unauthorized' });
    }

    res.json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});

module.exports = router;

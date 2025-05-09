const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Προστατευμένο route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Access granted!',
    userId: req.user.userId,
  });
});

module.exports = router;
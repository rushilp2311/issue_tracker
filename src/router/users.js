const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    res.send('Hello User');
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;

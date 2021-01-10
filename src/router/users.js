const express = require('express');
const bcrypt = require('bcrypt');
import { validateRegister } from '../service/user';

const router = express.Router();
router.get('/', (req, res) => {
  try {
    res.send('Hello User');
  } catch (error) {
    console.error(error);
  }
});

router.post('/', async (req, res) => {
  const { error } = validateRegister(req.body);

  //Call Database to check if the user already exists.

  const salt = await bcrypt.genSalt(10);
  //Encrypt user's password

  //Genrate token
});

/* Register Function is used by Admin. 
  TODO: Add Authorization for admin.After successful registration send email to member for password reset.
*/

/**
 * TODO: Password Reset function checks for the user. Resets the password for the member.
 */

/**
 * TODO: Function to Get User Info
 */

module.exports = router;

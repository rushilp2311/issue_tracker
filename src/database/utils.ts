/* eslint-disable @typescript-eslint/no-explicit-any */
import db from './db';

async function getAllStatus(): Promise<any> {
  return await db.then(async pool => {
    try {
      const { rows } = await pool.query('SELECT * FROM status');
      return rows;
    } catch (error) {
      console.log(error);
    }
  });
}
async function getAllRoles(): Promise<any> {
  return await db.then(async pool => {
    try {
      const { rows } = await pool.query('SELECT * FROM role');
      return rows;
    } catch (error) {
      console.log(error);
    }
  });
}

export { getAllStatus, getAllRoles };

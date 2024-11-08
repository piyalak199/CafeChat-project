const mysql = require("mysql");

module.exports = {
  createUser: async (pool, username, password, roleID, petTypeID) => {
    var sql =
      "INSERT INTO user ( username, password, roleID, petTypeID) " +
      "VALUES (?, MD5(?), ?, 1) ";
    sql = mysql.format(sql, [username, password, roleID, petTypeID]);

    return await pool.query(sql);
  },

  getByuserId: async (pool, userID) => {
    var sql = "SELECT * FROM user WHERE userID = ?";
    sql = mysql.format(sql, [userID]);

    return await pool.query(sql);
  },

  updateUser: async (
    pool,
    userID,
    username,
    password,
    displayName,
    petTypeID
  ) => {
    var sql =
      "UPDATE user SET " +
      "username=?, " +
      "password=MD5(?), " +
      "displayName=?, " +
      "petTypeID=?, " +
      "WHERE user.userID = ? ";

    sql = mysql.format(sql, [
      userID,
      username,
      password,
      displayName,
      petTypeID,
    ]);

    return await pool.query(sql);
  },

  updateDisplayName: async (pool, displayName, userID) => {
    var sql = "UPDATE user SET displayName = ? WHERE userID = ?";
    sql = mysql.format(sql, [displayName, userID]);

    return await pool.query(sql);
  },

  deleteUser: async (pool, userID) => {
    var sql = "DELETE FROM user WHERE userID = ?";
    sql = mysql.format(sql, [userID]);

    return await pool.query(sql);
  },

  addUserHat: async (pool, userID, hatID) => {
    var sql =
      'INSERT INTO user_hat (userID, hatID, hat_active) VALUES (?, ?, "n")';
    sql = mysql.format(sql, [userID, hatID]);

    return await pool.query(sql);
  },

  updateCoins: async (pool, hatID, userID) => {
    var sql =
      "UPDATE user u " +
      " JOIN hat h ON h.hatID = ? " +
      " SET u.coin = u.coin - h.hatCoin " +
      " WHERE u.userID = ? ";

    sql = mysql.format(sql, [hatID, userID]);

    return await pool.query(sql);
  },

  addUserCloth: async (pool, userID, clothID) => {
    var sql =
      'INSERT INTO user_cloth (userID, clothID, cloth_active) VALUES (?, ?, "n")';
    sql = mysql.format(sql, [userID, clothID]);

    return await pool.query(sql);
  },

  updateCoinsCloth: async (pool, clothID, userID) => {
    var sql =
      "UPDATE user u " +
      " JOIN cloth c ON c.clothID = ? " +
      " SET u.coin = u.coin - c.clothCoin " +
      " WHERE u.userID = ? ";

    sql = mysql.format(sql, [clothID, userID]);

    return await pool.query(sql);
  },

  addUserCloth: async (pool, userID, clothID) => {
    var sql =
      'INSERT INTO cloth( clothName, clothImg, clothCoin) VALUES (?,?,?)';
    sql = mysql.format(sql, [userID, clothID]);

    return await pool.query(sql);
  },
  
};

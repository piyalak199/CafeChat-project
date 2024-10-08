const mysql = require("mysql");

module.exports = {
  createUser: async (pool, username, password, roleID, petTypeID) => {
    var sql =
      "INSERT INTO user ( username, password, roleID) " +
      "VALUES (?, MD5(?), ?) ";
    sql = mysql.format(sql, [username, password, roleID]);

    return await pool.query(sql);
  },

  getByuserId: async (pool, userID) => {
    var sql = "SELECT * FROM user WHERE userID = ?";
    sql = mysql.format(sql, [userID]);

    return await pool.query(sql);
  },

  updateUser: async (pool, userID, username, password, displayName, petTypeID) => {
    var sql =
      "UPDATE user SET " +
      "username=?, " +
      "password=MD5(?), " +
      "displayName=?, " +
      "petTypeID=?, "+
      "WHERE user.userID = ? ";

    sql = mysql.format(sql, [userID, username, password, displayName, petTypeID]);

    return await pool.query(sql);
  },

  deleteUser: async (pool, userID) => {
    var sql = "DELETE FROM user WHERE userID = ?";
    sql = mysql.format(sql, [userID]);

    return await pool.query(sql);
  },

};

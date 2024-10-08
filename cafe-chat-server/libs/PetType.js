const mysql = require("mysql");

module.exports = {
  getByPetTypeID: async (pool, petTypeID) => {
    var sql = "SELECT * FROM pettype WHERE petTypeID = ? ";
    sql = mysql.format(sql, [petTypeID]);

    return await pool.query(sql);
  },

  updatePetType: async (pool, petTypeID, userID) => {
    var sql = "UPDATE user SET petTypeID = ? WHERE user.userID = ? ";
    sql = mysql.format(sql, [petTypeID, userID]);

    return await pool.query(sql);
  },
};

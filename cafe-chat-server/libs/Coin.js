const mysql = require("mysql");

module.exports = {
  updateAddCoin: async (pool, coinID, userID) => {
    var sql =
      "UPDATE USER u " +
      " JOIN typecoin tc ON tc.coinID = ? " +
      " SET u.coin = u.coin + tc.coin " +
      " WHERE u.userID = ? ";

    sql = mysql.format(sql, [coinID, userID]);

    return await pool.query(sql);
  },
};

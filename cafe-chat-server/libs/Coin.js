const mysql = require("mysql");

module.exports = {
  getByTypeCoin: async (pool, coinID) => {
    var sql = "SELECT coinID, coin, price FROM typecoin WHERE coinID = ?";
    sql = mysql.format(sql, [coinID]);

    // ใช้ await เพื่อรอการ query ให้เสร็จสิ้น
    const results = await pool.query(sql);

    return results;  // ควรส่งคืน array หรือ iterable
  },

  
};


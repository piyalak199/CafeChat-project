const mysql = require("mysql");

module.exports = {
    
    getByRoomID: async (pool, roomID) => {
        var sql = "SELECT * FROM chatroom WHERE roomID = ? ";
        sql = mysql.format(sql, [roomID]);

        return await pool.query(sql);
    },

  
};

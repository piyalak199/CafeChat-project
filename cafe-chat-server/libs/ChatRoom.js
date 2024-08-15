const mysql = require("mysql");

module.exports = {
    
    getByRoomId: async (pool, roomID) => {
        const sql = "SELECT * FROM chatroom WHERE roomID = ?";
        const formattedSql = mysql.format(sql, [roomID]);

        return new Promise((resolve, reject) => {
            pool.query(formattedSql, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    },
};

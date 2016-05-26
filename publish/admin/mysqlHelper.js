var mysql = require('mysql'),
    pool = mysql.createPool({
        connectionLimit: 10,
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: '111111',
        database: 'lyric'
    });
var query = function (sqlStr) {
    return new Promise((resolve, reject) => {
        if (!sqlStr) {
            reject('参数不能为空');
            return;
        }
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }
            connection.query(sqlStr, function (err) {
                connection.release();
                if (err) {
                    reject(err);
                    return;
                }
                resolve.apply(this, Array.prototype.slice.call(arguments, 1));
            });
        });
    });
};

exports.query = query;
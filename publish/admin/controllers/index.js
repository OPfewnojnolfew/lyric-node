module.exports = function (app) {
    var mysqlHelper = require('../mysqlHelper');
    app.get('/', function (req, res) {
        var pageIndex = req.query.p || 0,
            pageSize = 20,
            sql = `SELECT a.*,b.nickname FROM ly_music a 
                 LEFT JOIN ly_oauth_user b ON a.openid = b.openid
                 ORDER BY a.update_time DESC LIMIT ${pageIndex * pageSize},${pageSize}
                `;
        Promise.all([mysqlHelper.query(sql), mysqlHelper.query('SELECT COUNT(*) AS count FROM ly_music')]).then(function (values) {
            res.render('index', {
                rows: values[0],
                pageParams: {
                    maxentries: values[1][0].count,
                    current_page: pageIndex
                }
            });
        });
    });
};
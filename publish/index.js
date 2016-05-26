'use strict';

var express = require('express'),
    exphbs = require('express-handlebars');

var app = express();
/**
 * 名称.html， res.render('index')会用到该默认扩展名
 * app.engine(ext, callback)
 * Registers the given template engine callback as ext.

 * By default, Express will require() the engine based on the file extension. For example, if you try to render a “foo.pug” file, Express invokes the following internally, and caches the require() on subsequent calls to increase performance.
 */
app.engine('html', exphbs({ extname: 'html', defaultLayout: 'main', layoutsDir: 'publish/views', partialsDir: 'publish/views' }));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.get('/', function (req, res) {
    res.render('index');
});

app.listen(4000, function () {
    console.log('server listening on: 4000');
});

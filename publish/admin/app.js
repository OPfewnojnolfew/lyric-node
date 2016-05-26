'use strict';

var express = require('express'),
    path = require('path'),
    exphbs = require('express-handlebars');


var defaultPageOptions = require('./config').pageConfig;
var app = express();
console.log(path.join(__dirname, '/static'));
app.use(express.static(path.join(__dirname, '/static')));
/**
 * 名称.html， res.render('index')会用到该默认扩展名
 * app.engine(ext, callback)
 * Registers the given template engine callback as ext.

 * By default, Express will require() the engine based on the file extension. For example, if you try to render a “foo.pug” file, Express invokes the following internally, and caches the require() on subsequent calls to increase performance.
 */
app.engine('html', exphbs({
    extname: 'html',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials',
    // layoutsDir: 'publish/admin/views/layouts',
    // partialsDir: 'publish/admin/views/partials',
    helpers: {
        rootPath: function () {
            return ___dirname;
        },
        pagination: function (pageParams, options) {
            var resultArr = [];

            var opts = Object.assign({}, defaultPageOptions, pageParams || {});
            opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;
            // Extract current_page from options
            var current_page = opts.current_page,
                // Create a sane value for maxentries and items_per_page
                maxentries = (!opts.maxentries || opts.maxentries < 0) ? 1 : opts.maxentries,
                numPages = function () {
                    return Math.ceil(maxentries / opts.items_per_page);
                },

                /**
                 * Calculate start and end point of pagination links depending on
                 * current_page and num_display_entries.
                 * @return {Array}
                 */
                getInterval = function () {
                    var ne_half = Math.ceil(opts.num_display_entries / 2);
                    var np = numPages();
                    var upper_limit = np - opts.num_display_entries;
                    var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
                    var end = current_page > ne_half ? Math.min(current_page + ne_half, np) : Math.min(opts.num_display_entries, np);
                    return [start, end];
                },
                // Helper function for generating a single link (or a span tag if it's the current page)
                appendItem = function (page_id, appendopts) {
                    page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1); // Normalize page id to sane value
                    appendopts = Object.assign({ text: page_id + 1, classes: "" }, appendopts || {});
                    if (page_id == current_page) {
                        appendopts.isCurrent = true;
                    }
                    else {
                        appendopts.link_to = opts.link_to;
                        appendopts.pageIndex = page_id;
                        // var lnk = jQuery("<a>" + (appendopts.text) + "</a>")
                        //     .bind("click", getClickHandler(page_id))
                        //     .attr('href', opts.link_to.replace(/__id__/, page_id));
                    }
                    // if (appendopts.classes) { lnk.addClass(appendopts.classes); }
                    resultArr.push(appendopts);
                };
            var interval = getInterval();
            var np = numPages();


            if ((current_page > 0 || opts.prev_show_always)) {
                appendItem(current_page - 1, { text: opts.prev_text, classes: "prev pagination-icon-prev" });
            }

            // Generate "Previous"-Link
            if ((current_page > 0 || opts.prev_show_always)) {
                appendItem(current_page - 1, { text: opts.prev_text, classes: "prev pagination-icon-prev" });
            }
            // Generate starting points
            if (interval[0] > 0 && opts.num_edge_entries > 0) {
                var end = Math.min(opts.num_edge_entries, interval[0]);
                for (var i = 0; i < end; i++) {
                    appendItem(i);
                }
                if (opts.num_edge_entries < interval[0] && opts.ellipse_text) {
                    resultArr.push({
                        isEllipse: true,
                        ellipse_text: opts.ellipse_text
                    });
                    // jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
                }
            }
            // Generate interval links
            for (var i = interval[0]; i < interval[1]; i++) {
                appendItem(i);
            }
            // Generate ending points
            if (interval[1] < np && opts.num_edge_entries > 0) {
                if (np - opts.num_edge_entries > interval[1] && opts.ellipse_text) {
                    resultArr.push({
                        isEllipse: true,
                        ellipse_text: opts.ellipse_text
                    });
                    // jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
                }
                var begin = Math.max(np - opts.num_edge_entries, interval[1]);
                for (var i = begin; i < np; i++) {
                    appendItem(i);
                }

            }
            // Generate "Next"-Link
            if ((current_page < np - 1 || opts.next_show_always)) {
                appendItem(current_page + 1, { text: opts.next_text, classes: "next pagination-icon-next" });
            }
            return options.fn(resultArr);
        }
    }
}));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

require('./controllers')(app);

app.listen(4000, function () {
    console.log('server listening on: 4000');
});

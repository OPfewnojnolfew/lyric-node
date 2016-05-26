$(function () {
    var isFirst;
    $('.pagination').pagination(56, {
        num_edge_entries: 2,
        num_display_entries: 4,
        link_to: '?',
        current_page: 1,
        items_per_page: 1,
        prev_text: '<',
        next_text: '>',
        callback: function (a) {
            if (isFirst) {
                location.href = '?pageIndex=' + a;
            }
            isFirst = true;
        }
    });
});
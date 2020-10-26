function _typeahead_filter_analiz(filter) {

    var obj = {};
    if (typeof filter != 'undefined' && filter.length > 0) {

        var filter_ids = filter.split(',');
        for (key in filter_ids) {

            var text = filter_ids[key].trim();
            if (text.search(" as ") > 0) {

                $r = text.split(' as ');
                obj[$r[0]] = $r[1];
            } else {
                obj[text] = text;
            }
        }
    }

    return obj;
}

function  _typeahead_closestFilterSerial($element, filter) {
    var seri = '';
    if (typeof filter !== 'undefined' && filter.length > 0) {
        var $f_analiz = _filter_analiz(filter);

        for (var fieldName in $f_analiz) {
            seri += $f_analiz[fieldName] + '=' + $element.closest("form").find('[name="' + fieldName + '"]').val() + '&';
        }

    }
    return seri;
}

function init_typeahead_js() {


 $(".typeahead_js").each(function (index) {

                        var rvaluefield = $(this).data('rvaluefield');
                        var rkeyfield = $(this).data('rkeyfield');
                        var fieldname = $(this).data('fieldname');
                        var tags = $(this).data('tags');

                        var url = $(this).data('ajax--url');
                        var $typeahead_element = $(this);
                        var selected_value = $(this).val();

                        var filter = $(this).data('filter');
                        var filterids = $(this).data('filterids');


                        var newinputname = $(this).data('newinputname');

                        var id = $(this).attr('id');
                        var inputName = $(this).data('inputname');
                        var viewName = $(this).attr('name');

                        var typeahead_js = $(this).typeahead(
                                {
                                    hint: true,
                                    highlight: true,
                                    minLength: 0,
                                    autoSelect: true,
                                    items: 10,
                                },
                                {
                                    name: [rvaluefield],
                                    limit: 20,
                                    display: [rvaluefield],
                                    source: new Bloodhound({
                                        datumTokenizer: Bloodhound.tokenizers.whitespace,
                                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                                        prefetch: url,
                                        remote: {
                                            url: url,
                                            prepare: function (query, settings) {

                                                settings.url += '?search=' + query + '&filter=' + _typeahead_closestFilterSerial($typeahead_element, filter);
                                                return settings;
                                            }
                                        }
                                    }
                                    )
                                }).bind('typeahead:select', function (ev, suggestion) {

                            //Selected suggestion value
                            selected_value = suggestion[rvaluefield];

                            $(this).closest("form").find('[name="' + inputName + '"]').val(suggestion[rkeyfield]);

                        }).bind('typeahead:change', function (ev, suggestion) {

                            $(this).closest("form").find('[name="' + newinputname + '"]').val(0);

                            if (suggestion !== selected_value) {

                                $(this).closest("form").find('[name="' + newinputname + '"]').val(1);
                                $(this).closest("form").find('[name="' + inputName + '"]').val(suggestion);

                                if (tags === false) {

                                    //disable non selected value if  CreateNew is false
                                    $typeahead_element.val('');
                                    $(this).closest("form").find('[name="' + inputName + '"]').val('');
                                }
                            }

                        });

                        if (typeof filterids !== 'undefined' && filterids.length > 0) {

                            var $f_analiz = _typeahead_filter_analiz(filterids);

                            for (var filterFieldID in $f_analiz) {
                                $(this).closest("form").find('#' + filterFieldID).on('change', function () {

                                    $typeahead_element.typeahead('val', '');
                                    $typeahead_element.val('');
                                    $(this).closest("form").find('[name="' + viewName + '"]').val('');
                                    $(this).closest("form").find('[name="' + inputName + '"]').val('');


                                    $typeahead_element.typeahead("open");
                                    setTimeout(function () {
                                        $typeahead_element.typeahead("close");
                                    }, 100);
                                });
                            }
                        }

                        $(this).attr('autocomplete', 'nope');
                    });
}
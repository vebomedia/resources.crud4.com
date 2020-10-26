function _select2_filter_analiz(filter) {
    
    console.log('_select2_filter_analiz');
    
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

function _select2_closestFilterSerial($element, filter) {

    console.log('_select2_closestFilterSerial');
    
    var seri = '';
    if (typeof filter !== 'undefined' && filter.length > 0) {
        var $f_analiz = _select2_filter_analiz(filter);

        for (var fieldName in $f_analiz) {
            seri += $f_analiz[fieldName] + '=' + $element.closest("form").find('[name="' + fieldName + '"]').val() + '&';
        }

    }
    return seri;
}


function init_select2_js() {
    
    $(".select2_js:not(.select2-hidden-accessible)").each(function () {

        var rvaluefield = $(this).data('rvaluefield');
        var rvaluefield2 = $(this).data('rvaluefield2');
        var rkeyfield = $(this).data('rkeyfield');
        var formname = $(this).data('formname');
        var fieldname = $(this).data('fieldname');
        var inputName = $(this).attr('name');
        var tags = $(this).data('tags');
        var minimuminputlength = $(this).data('minimuminputlength');
        var placeholder = $(this).data('placeholder');
        var filter = $(this).data('filter');
        var required = $(this).data('required');
        var newinputname = $(this).data('newinputname');

        var optionviewTemplate = $(this).data('optionview');
        var selectedViewTemplate = $(this).data('selectedview');
        var titleViewTemplate = $(this).data('titleview');

        var $selected2 = $(this).select2({
            width: '100%',
            selectOnClose: true,
            theme: 'bootstrap4',
            tags: tags,
            language: "tr",
            placeholder: placeholder,
            minimumInputLength: minimuminputlength,

            createTag: function (params) {

                var term = $.trim(params.term);
                if (term === '') {
                    return null;
                }

                if (tags) {
                    return {
                        title: term + ' (NEW RECORD!)',
                        id: term,
                        text: term + '<code style="float:right; margin-right: 15px; background: #ebedf2;">NEW</code>' + '',
                        newTag: tags // add additional parameters
                    };
                } else {

                    return {
                        title: term,
                        id: term,
                        text: term,
                        newTag: tags // add additional parameters
                    };
                }
            },
            templateSelection: function (data) {

                if (isEmpty(data.id)) {
                    return placeholder;
                }
                if (!isEmpty(data.selectedview)) {
                    return data.selectedview;
                }

                return data.text;
            },
            escapeMarkup: function (m) {
                return m;
            },
            ajax: {
                url: $(this).data('ajax--url'),
                dataType: 'json',
                type: "POST",
                delay: 250,
                cache: true,
                data: function (params) {

                    var query = {
                        search: params.term,
                        filter: _select2_closestFilterSerial($(this), filter)
                    };

                    // Query parameters will be ?search=[term]&type=public
                    return query;
                },
                processResults: function (data) {

                    if (required === 'permit_empty')
                    {

//                                        var $n = {};
//                                        $n[rkeyfield] = '0';
//                                        $n[rvaluefield] = homeLang('select');
//                                        data.unshift($n);

                        data.unshift({'emptySelect': 'emptySelect'});
                    }

                    return {
                        results: $.map(data, function (item) {

                            if (typeof item['emptySelect'] !== 'undefined') {
                                id = ' ';
                                text = homeLang('select');
                            } else {
                                var id = item[rkeyfield];
                                var text = item[rvaluefield];

                                if (!isEmpty(rvaluefield2)) {
                                    text = item[rvaluefield] + ' ' + item[rvaluefield2];
                                }
                            }

                            text = escapeHtml(text);
                            id = escapeHtml(id);

                            // Option View ---------------------
                            var optionview = text;

                            if (!isEmpty(optionviewTemplate)) {
                                var tempOpt = optionviewTemplate;

                                for (key in item) {
                                    tempOpt = tempOpt.replace('{' + key + '}', item[key]);
                                }
                                optionview = tempOpt;
                            }

                            // Selected View -------------------
                            var selectedview = text;

                            if (!isEmpty(selectedViewTemplate)) {
                                var tempOpt = selectedViewTemplate;

                                for (key in item) {
                                    tempOpt = tempOpt.replace('{' + key + '}', item[key]);
                                }
                                selectedview = tempOpt;
                            }

                            // titleView -----------------------
                            var titleview = text + ' ID: ' + id;

                            if (!isEmpty(titleViewTemplate)) {
                                var tempOpt = titleViewTemplate;

                                for (key in item) {
                                    tempOpt = tempOpt.replace('{' + key + '}', item[key]);
                                }
                                titleview = tempOpt;
                            }

                            if (tags) {
                                return {
                                    text: optionview + '<code style="float:right; margin-right: 15px; background: #ebedf2; color: #247500"></code>' + '',
                                    id: id,
                                    title: titleview,
                                    selectedview: selectedview
                                };
                            } else {
                                return {
                                    text: optionview,
                                    id: id,
                                    title: titleview,
                                    selectedview: selectedview
                                };
                            }
                        })
                    };
                }
            }

        }).on('select2:select', function (e) {
            var data = e.params.data;
            if (data.newTag === true) {
                //Set newinputname to 1 if new input added..
                $(this).closest("form").find('[name="' + newinputname + '"]').val('1');
            } else {
                $(this).closest("form").find('[name="' + newinputname + '"]').val('0');
            }
        });

        if (typeof filter !== 'undefined' && filter.length > 0) {

            var $f_analiz = _select2_filter_analiz(filter);

            for (var filterField in $f_analiz) {

                $(this).closest("form").find('[name="' + filterField + '"]').on('change', function () {

                    var filterValue = $(this).val();

                    if (filterValue === '') {

                        $selected2.val(null).trigger('change');
                        $(this).closest("form").find('[name="' + inputName + '"]').val('');

                    } else {

                        setTimeout(function () {
                            $selected2.select2("open");
                        }, 100);

                        setTimeout(function () {
                            $selected2.select2("close");
                        }, 1000);

                    }
                });

            }
        }
    });
}
function _select2_filter_analiz(filter) {

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

        var minimuminputlength = $(this).data('minimuminputlength');
        var placeholder = $(this).data('placeholder');
        var filter = $(this).data('filter');
        var required = $(this).data('required');
        var newinputname = $(this).data('newinputname');

        var getrelationurl = $(this).data('getrelationurl');
        var rprimarykey = $(this).data('rprimarykey');
        var id = $(this).attr('id');


        //View
        var optionviewTemplate = $(this).data('optionview');
        var selectedViewTemplate = $(this).data('selectedview');
        var titleViewTemplate = $(this).data('titleview');

        //CreateNew
        var tags = $(this).data('tags');
        var relationformid = $(this).data('relationformid');

        //fill fields
        var fillto = $(this).data('fillto');

        if (!isEmpty(fillto)) {
            //return string to object
            var fillto = _select2_filter_analiz(fillto);
        }

        var $selectOnClose = true;

        if (required === 'permit_empty') {
            $selectOnClose = false;
        }

        if (isEmpty(placeholder)) {
            placeholder = 'Select..';
        }

        var $allowClear = false;
        
        if (required === 'permit_empty') {
            
            $allowClear = true;
        }

        console.log(placeholder, 'placeholderplaceholder');

        var $selected2 = $(this).select2({
            width: '100%',
            selectOnClose: $selectOnClose,
            theme: 'bootstrap4',
            language: getLocale(),
            placeholder: placeholder,
            minimumInputLength: minimuminputlength,
            allowClear: $allowClear,
            minimumInputLength: 2,
            
          

            templateSelection: function (data) {

                console.log(data, 'templateSelection');

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

                    console.log(data, 'processResults');

//                    if (required === 'permit_empty')
//                    {
//                         data.unshift({'emptySelect': 'emptySelect'});
//                    }

                    return {
                        results: $.map(data, function (item) {

                            console.log(item, '$.map');

                            if (typeof item['emptySelect'] !== 'undefined') {
                                id = ' ';
                                text = homeLang('select');

                                return {
                                    text: text,
                                    id: id,
                                    title: text,
                                    selectedview: text,
                                    item: item
                                };

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

                            return {
                                text: optionview,
                                id: id,
                                title: titleview,
                                selectedview: selectedview,
                                item: item
                            };

                        })
                    };
                }
            }

        }).on('select2:select', function (e) {
            
            console.log('select2:select');
            
            var data = e.params.data;
            
            console.log(data, 'select2:select data ');

            if (!isEmpty(fillto)) {
                for (key in fillto) {
                    if (typeof data.item[key] != 'undefined') {

                        var fName = fillto[key];
                        $('[name="' + fName + '"]').val(data.item[key]).trigger("change");
                    } else {
                        console.log(key, 'no key exist');
                    }
                }
            }

        }).on("select2:open", function (data) {

            console.log(data, 'select2:open');

            if (tags && $("#createbutton_" + id).length < 1 && $('[data-createbutton="' + id + '"]').length > 0) {
                $(".select2-results").append('<div class="" id="createbutton_' + id + '">' +
                        $('[data-createbutton="' + id + '"]').html() + "</div>");
            }

        }).on('select2:unselect', function (e) {

            console.log(e, 'select2:unselect');

            $(this).val('').trigger('change.select2');
            $(this).select2("close");
            
            
//                $selected2.append(option).trigger('change');
//
//                        $selected2.trigger({
//                            type: 'select2:select',
//                            params: {
//                                data: savedData
//                            }
//                        });
                        

        });

        if (tags) {
            $(document).on("onFormDone", function (event, data) {

//                console.log(data, 'data');
//                console.log(relationformid, 'relationformid');
//                  var $formData = data['formData']; //Not saved data. Only FormData. Saved data will come from ajax!..

                if (data.formid !== relationformid) {
                    return '';
                }

                var $savedID = data['returnData']['id'];

                if (1) {
                    $.ajax({
                        url: panel_url(getrelationurl),
                        method: "POST",
                        data: {filter: rprimarykey + '=' + $savedID},
                        cache: true
                    }).done(function (data) {

                        var savedData = data[0];
                        var selectedID = savedData[rkeyfield]; //nearly same $savedID

                        console.log(savedData, '++savedData');
                        console.log(rvaluefield, '++rvaluefield');


                        var selectedview = '';

                        if (!isEmpty(selectedViewTemplate)) {
                            var tempOpt = selectedViewTemplate;

                            for (key in savedData) {
                                tempOpt = tempOpt.replace('{' + key + '}', savedData[key]);
                            }
                            selectedview = tempOpt;
                        } else {

                            selectedview = selectedID;

                            if (!isEmpty(savedData[rvaluefield])) {
                                selectedview = savedData[rvaluefield];
                            }
                        }

                        var option = new Option(selectedview, selectedID, true, true);
                        $selected2.append(option).trigger('change');

                        $selected2.trigger({
                            type: 'select2:select',
                            params: {
                                data: savedData
                            }
                        });

                    });
                }
                return true;
            });
        }

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

$(document).on('click', '[data-action="openselect2modal"]', function () {
    event.preventDefault();

    var $select2id = $(this).data('select2id');

    $('#' + $select2id).select2('close');

    $('body').append(`<div class="modal fade" role="dialog" id="openselect2modal"  aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    Loading...
                </div>
            </div>
        </div>`);

    var $g2 = new General();

    $g2.setModalBackDrop($(this).data('modalbackdrop'))
            .setModalSize($(this).data('modalsize'))
            .setModalView($(this).data('modalview'))
            .setModalContainer('#openselect2modal')
            .showFormModal($(this).data('modalurl'), $(this).data('modaldata'));


});
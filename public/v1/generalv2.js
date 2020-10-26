var cacheID = '1.1';




// -----------------------------------------------------------------------------
/**
 * Load javascript File From Url 
 * @param string src 
 * @return {Promise}
 * Usage : loadScript("jsurl").then(function(jsurl){ doSomething()});
 */

var loadedScripList = [];
var loadingScriptList = []; //scripts waiting for loading

function loadScript(src) {
    return new Promise(function (resolve, reject) {

        if (jQuery.inArray(src, loadedScripList) > -1) {

            console.log(src + ' Already Loaded');
            resolve(src);

        } else if (jQuery.inArray(src, loadingScriptList) > -1) {

            $(document).on("on_script_loaded", function (event, sName) {

                if (sName === src) {
                    console.log(src + ' on_script_loaded Loaded');
                    resolve(src);
                }
            });
        } else {

            loadingScriptList.push(src);

            $.ajax({
                url: src + '?cacheID=' + cacheID,
                dataType: "script",
                async: false,
                cache: true
            }).done(function (data) {

                loadedScripList.push(src);
                $(document).trigger("on_script_loaded", src);
                resolve(src);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                reject(new Error(`Script load error for ${src}`));
            });
        }

    });
}

function loadJSArray(arrayList, onload, index) {

    if (typeof index === 'undefined') {
        index = 0;
    }

    if (typeof arrayList === 'string') {
        var arrayList = [arrayList];
    }

    if (!$.isEmptyObject(arrayList[index])) {

        var $lastJS = arrayList[arrayList.length - 1];
        let scriptUrl = arrayList[index];

        loadScript(scriptUrl).then(function (scriptUrl) {
            if (scriptUrl === $lastJS) {
                if (typeof onload === 'function') {
                    onload();
                }
            } else {
                loadJSArray(arrayList, onload, index + 1);
            }
        });

//
//        console.log(scriptUrl + '?cacheID=' + cacheID, 'inload JSArray loadJSArray')
//
//        $.ajax({
//            url: scriptUrl + '?cacheID=' + cacheID,
//            dataType: "script",
//            async: false,
//            cache: true
//        }).done(function (data) {
//
//
//            console.log(scriptUrl, 'done  loadJSArray js');
//
//            if (scriptUrl === $lastJS) {
//
//                if (typeof onload === 'function') {
//                    onload();
//                }
//            } else {
//                loadJSArray(arrayList, onload, index + 1);
//            }
//
//        }).fail(function (jqXHR, textStatus, errorThrown) {
//            console.log(scriptUrl + " JS NOT loaded");
//            if (typeof onload === 'function') {
//                onload();
//            }
//        });

    } else {
        if (typeof onload === 'function') {
            onload();
        }
    }

}

// -----------------------------------------------------------------------------

/**
 * Load css file from url
 * @param {string} href
 */
function loadStyle(href) {
    if ($('link[href="' + href + '"]').length === 0) {
        $('<link rel="stylesheet" type="text/css" href="' + href + '" >').appendTo("head");
    }
}

// -----------------------------------------------------------------------------

function getLocale() {
    var local = homeLang('panel_language');

    if (typeof local === 'undefined') {
        local = 'en';
    }
    return local;
}
function site_url(param) {

    var url = document.location.origin;
    if (typeof param != 'undefined') {
        url += '/' + param
    }
    return url;
}
function initReCAPTCHAv3() {

    if ($('[name="reCaptchaToken"]').length === 0) {
        return;
    }

    var recaptcha_sitekey = $('[name="recaptcha_sitekey"]').attr("content");
    var reCaptchaAction = $('[name="reCaptchaAction"]').val();

    if (isEmpty(reCaptchaAction)) {
        reCaptchaAction = 'login';
    }

    general.addWidget_pack('reCAPTCHAv3', {'js': ['https://www.google.com/recaptcha/api.js?render=' + recaptcha_sitekey]});

    general.loadPackage('reCAPTCHAv3', function () {

        grecaptcha.ready(function () {
            grecaptcha.execute(recaptcha_sitekey, {action: reCaptchaAction}).then(function (token) {
                $('[name="reCaptchaToken"]').val(token);
            });
        });
    });

}
function getLang(tableName, param, paramsub) {

    var $langList = window['LANG_' + tableName];

    if (typeof $langList === 'undefined') {

        return param;
    }

    if (!isEmpty($langList[param])) {
        if (typeof $langList[param] === 'string') {
            return $langList[param];
        } else {

            if (typeof paramsub === 'undefined') {
                return $langList[param];
            }

            if (!isEmpty($langList[param][paramsub])) {
                return $langList[param][paramsub];
            } else {
                return param + ' ' + paramsub;
            }

        }
    }
    if (typeof paramsub !== 'undefined') {
        return  paramsub;
    } else {
        return param;
    }

}
function homeLang(param, paramsub) {
    return getLang('home', param, paramsub);
}
function createToast(title, content) {

    if ($('#toastFrame').length === 0) {

        $('body').append(' <div id="toastFrame" style="position: absolute; bottom: 50px; right: 0;"></div>');
    }

    var $html = `
    <div class="toast mr-3" role="alert" aria-live="polite" aria-animation="true"  aria-atomic="true" data-delay="3000" data-autohide="true">
        <div class="toast-header bg-danger text-white">
            <strong class="mr-auto"><i class="fa fa-globe"></i> ` + title + `</strong>
             
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="toast-body" style="min-width:350px">` + content + `</div>
    </div>
`;

    $('#toastFrame').prepend($html);
//    $('body').append($html);

    $(".toast").toast('show').on('hidden.bs.toast', function () {
        $(this).remove();
    });
}
function panel_url(param) {

    var panel_url = homeLang('panel_url');

    if (typeof param != 'undefined') {
        panel_url += '/' + param
    }
    return panel_url;
}
function escapeHtml(text) {

    if (typeof text === 'undefined') {
        return '';
    }

    if (typeof text === 'number') {
        return text;
    }

    if (typeof text === 'string') {
        var map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'};

        return text.replace(/[&<>"']/g, function (m) {
            return map[m];
        });
    }
}
function randomID() {

    return Math.floor((Math.random() * 10000000) + 1)
}

/**
 * Only Crud4.com usage. You can delete this function 
 * @param {type} param
 * @return {String}
 */
function crud4coreUrl(param) {

    var url = document.location.origin + '/crud4core/' + getLocale() + '/crud';

    if (typeof param != 'undefined') {
        url += '/' + param
    }

    return url;
}

function _returnJsonData(jqXHR) {

    if (typeof jqXHR.responseJSON !== 'undefined') {
        var jsonData = jqXHR.responseJSON;
    } else if (typeof jqXHR.responseText !== 'undefined') {
        jsonData = jQuery.parseJSON(jqXHR.responseText);
    } else if (typeof jqXHR === 'object') {
        var jsonData = jqXHR;
    }

    return jsonData;
}

/**
 * Get Datatable Language Url according to panelLang
 * @return {String}
 */
var datatable_langUrl = function () {

    var panel_language = getLocale();

    var table_lang_url = "https://resources.crud4.com/v1/datatable/1.10.20/i18n/English.lang";

    if (panel_language === 'tr') {
        table_lang_url = "https://resources.crud4.com/v1/datatable/1.10.20/i18n/Turkish.lang";
    }

    return table_lang_url;
}

function checkResponse(jqXHR) {

    var jsonData = _returnJsonData(jqXHR);

    var redirectURL = null;
    var htmlContent = null;

    if (typeof jsonData.redirectURL !== 'undefined') {
        redirectURL = jsonData.redirectURL;
    } else if (typeof jsonData.messages !== 'undefined' && typeof jsonData.messages.redirectURL !== 'undefined') {
        redirectURL = jsonData.messages.redirectURL;
    }

    if (redirectURL !== null) {

        var waitTime = 1500;

        if (typeof jsonData.waitTime !== 'undefined') {
            waitTime = jsonData.waitTime;
        }

        setTimeout(function () {
            window.location.href = redirectURL;
        }, waitTime);
    }


    if (typeof jsonData.htmlContent !== 'undefined') {
        htmlContent = jsonData.htmlContent;
    } else if (typeof jsonData.messages !== 'undefined' && typeof jsonData.messages.htmlContent !== 'undefined') {
        htmlContent = jsonData.messages.htmlContent;
    }

    if (htmlContent !== null) {

        var selector = this.modalContainer;
        var modalSize = this.modalSize;

        if (typeof selector !== 'string' || selector === '') {
            selector = '#general_modal';
        }

        if (typeof modalSize === 'undefined' || modalSize === '') {
            modalSize = 'lg';
        }

        setTimeout(function () {

            var $container = $(selector);

            $container.find('.modal-content').html(htmlContent);
            $container.modal({
                show: true,
                backdrop: this.modalbackdrop,
            });
        }, 2000);

    }

}



function initDateRangeFilter() {

    general.loadPackage('daterangepicker', function () {

        setTimeout(function () {

            $('.daterangefilter').daterangepicker({
                autoUpdateInput: false,
                locale: {
                    format: 'YYYY-MM-DD',
                    cancelLabel: 'Clear'
                },
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
                $(this).trigger("change");
            }).on('cancel.daterangepicker', function (ev, picker) {
                $(this).val('');
                $(this).trigger("change");
            });

        }, 1000);

    });

}



function _getApiErrorString(jqXHR) {

    if (typeof jqXHR === 'string') {
        return jqXHR;
    }

    var jsonData = _returnJsonData(jqXHR);

    if (typeof jsonData === 'undefined') {

        console.log('error json data is undefined');
        return '';
    }

    var error = '';
    if (typeof jsonData.error !== 'undefined' && !(!isNaN(parseFloat(jsonData.error)) && isFinite(jsonData.error))) {
        error = jsonData.error;
    } else if (typeof jsonData.message !== 'undefined') {
        error = jsonData.message;
    } else if (typeof jsonData.messages === 'string') {
        if (error != jsonData.messages) {
            error += '<br/>' + jsonData.messages;
        }
    }

    var errorsToString = '';
    if (typeof jsonData.messages === 'object' && (Object.keys(jsonData.messages).length > 0)) {
// Array Errors
        for (var key in jsonData.messages) {
            errorsToString += jsonData.messages[key] + "\n";
        }
    }

    if (error.length === 0) {
        error = errorsToString;
    }

    return error;
}
function _getApiSuccessString(jqXHR) {

    var jsonData = _returnJsonData(jqXHR);

    var messagesToString = '';
    if (typeof jsonData.message === 'string') {
        messagesToString = jsonData.message;
    } else if (typeof jsonData.messages === 'object' && (Object.keys(jsonData.messages).length > 0)) {
// Array Errors
        for (var key in jsonData.messages) {
            messagesToString += jsonData.messages[key] + "\n";
        }
    } else if (typeof jsonData.messages === 'string') {
        messagesToString = jsonData.messages;
    } else {
        messagesToString = 'Saved!';
    }

    return messagesToString;
}
/**
 * 
 * Send Delete Request
 * 
 * @param {String} url
 * @param {function} onSuccess
 * @param {function} onFail
 * 
 */

function ajaxDelete(url, onSuccess, onFail) {

    $.ajax({
        url: url,
        method: "DELETE",
        dataType: "json"
    }).done(function (data) {

        if (typeof onSuccess === "function") {
            onSuccess(data);
        } else {
            alertSuccess('Deleted');
        }

    }).fail(function (jqXHR, textStatus, errorThrown) {

        if (typeof onFail === "function") {

            onFail(jqXHR);
        } else {

            alertFail(_getApiErrorString(jqXHR));

        }

    });
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function alertSuccess(title, timer) {

    if (typeof timer === 'undefined') {
        timer = 1500;
    }

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: title,
        showConfirmButton: false,
        timer: 1500,
        heightAuto: false
    }).then(function (result) {



    });

}
function alertFail(error, timer) {

    if (typeof timer === 'undefined') {
        timer = 1500;
    }

    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: error,
        showConfirmButton: false,
        timer: timer,
        heightAuto: false
    }).then(function (result) {



    });
}
function hide_ajax_modal(selector) {
    if (typeof selector === 'undefined' || selector === '') {
        selector = '#general_modal';
    }
    $(selector).modal('hide');
}
function destroyToolTip() {
    $('[data-toggle="tooltip"]').tooltip('dispose');
}
function initToolTip() {

    $('[data-toggle="tooltip"]').tooltip();
}
function initInlineEdit() {

    if ($('[data-toggle="toggle"]').length > 0) {

        general.loadPackage('bootstrap-toggle', function () {

            $('[data-toggle="toggle"]').bootstrapToggle('destroy').bootstrapToggle();
        });
    }
}
function initSelectpicker() {

    if ($(".selectpicker").length > 0) {

        general.loadPackage('selectpicker', function () {

            $.fn.selectpicker.Constructor.BootstrapVersion = '4';

            $(".selectpicker").selectpicker();
        });
    }
}
/**
 * Called From SubDatatable After Each Drawed
 *
 */
function _callback_subdatatable_drawed() {

    initToolTip();
    initInlineEdit();



}
/**
 * Called From Datatable After Each Drawed
 */
function _callback_datatable_drawed() {
    initToolTip();
    initInlineEdit();
}
// -------------------------------------------------------------------------- //
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
// -------------------------------------------------------------------------- //
/**
 * 
 * Girilen Degeri floatNumber Formatına Cevirir
 */
function returnNumber(number) {

    if (typeof number === 'undefined' || number === '' || typeof number != 'string' || number === '0' || number === 0) {
        return parseFloat(0);
    }


    if (isNumber(number)) {
        return parseFloat(number);
    }

    if (number.length < 1) {
        return parseFloat(0);
    }

    var split = number.split(/[,.]/);
    var text = '';
    //console.log(split);

    //Noktalı virgullu bir yapıdaysa...
    if (split.length > 1) {
        var last_element = split[split.length - 1];
        if (last_element.length == 0) {
            last_element = 0;
        }
//Son Elemanı Kusuratır
        for (i = 0; i < split.length - 1; i++) {
            if (split[i].length > 0) {
                text += split[i];
            }

        }


        text += '.' + last_element; //Kusuratı Nokta ile Ayır

    } else {
        text = number;
    }
    number = parseFloat(text);
    if (!isNumber(number)) {
        number = parseFloat(0);
    }

    return number;
}
// -------------------------------------------------------------------------- //
/**
 * 
 * Input Degerinde gosterilecek sekilde Ayarlar
 * 
 */
function returnInputNumber(number, return_positive) {

    number = returnNumber(number); //Rakama Cevir.

    if (return_positive === 1 && number < 0) {
        number = -1 * number;
    }

    var money = new Intl.NumberFormat('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 4}).format(number);
    return money;
}
// -------------------------------------------------------------------------- //
function change_input2money(class_name, return_positive) {

    $("." + class_name).each(function () {
        $(this).val(returnInputNumber($(this).val(), return_positive));
    }).on('change', function () {

        $(this).val(returnInputNumber($(this).val(), return_positive));
    });
}
// -------------------------------------------------------------------------- //
function isEmpty(obj) {

    if (typeof obj === 'undefined' || obj === null || typeof obj === 'null' || obj === '' || obj === ' ') {
        return true;
    }

    if (typeof obj === 'number') {
        return false;
    }

    if (typeof obj === 'object') {
        return jQuery.isEmptyObject(obj);
    }

    if (typeof obj === 'string') {
        return obj.length > 0 ? false : true;
    }

    return false;
}

// -------------------------------------------------------------------------- //
/**
 * Load and Extend Datatable.net Language..
 * @param {type} onLoad
 * @return {undefined}
 */
function loadDatatableLang(onLoad) {

    var panel_language = getLocale();

    if (panel_language === 'en') {

        if (typeof onLoad === 'function') {
            onLoad();
        }

        return;
    }

    var table_lang_url = "https://resources.crud4.com/v1/datatable/1.10.20/i18n/English.lang";

    if (panel_language === 'tr') {

        table_lang_url = "https://resources.crud4.com/v1/datatable/1.10.20/i18n/Turkish.lang";

    } else {

        if (typeof onLoad === 'function') {
            onLoad();
        }

        return;
    }

    $.ajax({
        url: table_lang_url,
        dataType: "script",
        cache: true
    }).done(function (data) {

        $.extend(true, $.fn.dataTable.defaults, {
            language: datatableLang
        });
        if (typeof onLoad === 'function') {
            onLoad();
        }

    });

}

function checkStatisticCard() {

    if ($('[data-action="readStatistic"]').length > 0) {
        general.initPackage('statisticCard');
    }
}

/**
 * Some Widget use this function to calculate width of column
 */
var columnWidth = function (param, min_value_length) {

    if (typeof min_value_length === 'undefined') {
        min_value_length = 5;
    }

    var size = param.length * 10;
    var minsize = min_value_length * 10;
    return size > minsize ? size : minsize;
};







//General loaded Pack List to avoiding twice loadind
var _loadedPackList = [];
var _onloadingPackList = [];


var General = function () {

    this.modalSize = 'lg';
    this.modalview = 'centermodal';
    this.modalbackdrop = true;
    this.datatable = '';
    this.jsname = '';
    this.modalContainer = '#general_modal';
    this.loadedPackList = [];
    this.submitButton = '';
    this.dismissButton = '';
    this.widget_pack = {

        'summernote': {
            'css': ['https://resources.crud4.com/v1/summernote/0.8.16/summernote-bs4.min.css'],
            'js': [
                'https://resources.crud4.com/v1/summernote/0.8.16/summernote-bs4.min.js',
                'https://resources.crud4.com/v1/summernote/0.8.16/summernote-fontawesome.js',
            ]
        },
        'dropzone': {
            'css': ['https://resources.crud4.com/v1/dropzone/5.5.1/dropzone.min.css'],
            'js': [
                'https://resources.crud4.com/v1/dropzone/5.5.1/dropzone.min.js',
                'https://resources.crud4.com/v1/dropzone/dropzone.init.js',
            ]
        },
        'select2_js': {
            'css': ['https://resources.crud4.com/v1/select2/4.0.1/css/select2.min.css',
                'https://resources.crud4.com/v1/select2/select2-bootstrap4.min.css'],
            'js': [
                'https://resources.crud4.com/v1/select2/4.0.1/js/select2.min.js',
                'https://resources.crud4.com/v1/select2/select2_js_init_v3.js',
            ]
        },

        'datetimepicker': {
            'css': ['https://resources.crud4.com/v1/datetimepicker/4.17.47/bootstrap-datetimepicker.min.css'],
            'js': ['https://resources.crud4.com/v1/datetimepicker/4.17.47/bootstrap-datetimepicker.min.js']
        },
        'datepicker': {
            'css': ['https://resources.crud4.com/v1/datetimepicker/4.17.47/bootstrap-datetimepicker.min.css'],
            'js': ['https://resources.crud4.com/v1/datetimepicker/4.17.47/bootstrap-datetimepicker.min.js']
        },
        'daterangepicker': {
            'css': ['https://resources.crud4.com/v1/daterangepicker/3.0.5/daterangepicker.css'],
            'js': ['https://resources.crud4.com/v1/daterangepicker/3.0.5/daterangepicker.min.js']
        },
        'jquery-ui': {
            'css': ['https://resources.crud4.com/v1/jquery-ui/1.12.0/jquery-ui.min.css'],
            'js': ['https://resources.crud4.com/v1/jquery-ui/1.12.0/jquery-ui.min.js']
        },
        'typeahead_js': {
            'js': [
                'https://resources.crud4.com/v1/typeahead_js/0.11.1/typeahead.bundle.min.js',
                'https://resources.crud4.com/v1/typeahead_js/typeahead_js.init.js',
            ]
        },
        'dataTable': {
            'js': ['https://resources.crud4.com/v1/datatable/1.10.20/datatables.min.js'],
            'css': ['https://resources.crud4.com/v1/datatable/1.10.20/datatables.min.css']
        },
        'moment': {
            'js': ['https://resources.crud4.com/v1/moment/2.24.0/moment-with-locales.min.js']
        },
        'codemirror': {
            'css': ['https://resources.crud4.com/v1/codemirror/5.52.0/lib/codemirror.css',
                'https://resources.crud4.com/v1/codemirror/5.52.0/theme/monokai.css'],
            'js': [
                'https://resources.crud4.com/v1/codemirror/5.52.0/lib/codemirror.js',
                'https://resources.crud4.com/v1/codemirror/5.52.0/mode/javascript/javascript.js',
                'https://resources.crud4.com/v1/codemirror/5.52.0/addon/selection/active-line.js',
                'https://resources.crud4.com/v1/codemirror/5.52.0/addon/edit/matchbrackets.js',
                'https://resources.crud4.com/v1/codemirror/5.52.0/addon/display/autorefresh.js',
            ]
        },
        'INVOICE_ITEM_CALCULATION': {
            'js': ['https://resources.crud4.com/v1/accounting/INVOICE_ITEM_CALCULATION.js']
        },
        'uisortable': {
            'js': ['https://resources.crud4.com/v1/uiSortable/jquery-ui.sortable.js']
        },
        'amcharts': {
            'js': [
                'https://resources.crud4.com/v1/amcharts/4.9.1/core.js',
                'https://resources.crud4.com/v1/amcharts/4.9.1/charts.js',
                'https://resources.crud4.com/v1/amcharts/4.9.1/themes/animated.js',
                'https://resources.crud4.com/v1/amcharts/4.9.1/lang/tr_TR.js'
            ]
        },
        'statisticCard': {
            'js': [
                'https://resources.crud4.com/v1/statisticCard/initStatisticCard.js',
            ]
        },
        'selectpicker': {
            'css': [
                'https://resources.crud4.com/v1/bootstrap-select/1.13.9/css/bootstrap-select.min.css',
            ],
            'js': [
                'https://resources.crud4.com/v1/bootstrap-select/1.13.9/js/bootstrap-select.min.js',
            ]
        },
        'input_slug': {
            'js': ['https://resources.crud4.com/v1/input_slug/input_slug.js']
        },
        'bootstrap-toggle': {
            'css': [
                'https://resources.crud4.com/v1/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css',
            ],
            'js': [
                'https://resources.crud4.com/v1/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js',
            ]
        },
        'calendar': {
            'css': [
                'https://resources.crud4.com/v1/calendar/4.4.0/packages/core/main.min.css',
                'https://resources.crud4.com/v1/calendar/4.4.0/packages/daygrid/main.min.css',
                'https://resources.crud4.com/v1/calendar/4.4.0/packages/timegrid/main.min.css',
                'https://resources.crud4.com/v1/calendar/4.4.0/packages/list/main.min.css',
                'https://resources.crud4.com/v1/calendar/4.4.0/packages/bootstrap/main.min.css',
            ],
            'js': [
                'https://resources.crud4.com/v1/calendar/4.4.0/packages/core/main.min.js',
                'https://resources.crud4.com/v1/calendar/4.4.0/packages/core/locales-all.min.js',
                'https://resources.crud4.com/v1/calendar/4.4.0/packages/interaction/main.min.js',
                'https://resources.crud4.com/v1/calendar/4.4.0/packages/daygrid/main.min.js',
                'https://resources.crud4.com/v1/calendar/4.4.0/packages/timegrid/main.min.js',
                'https://resources.crud4.com/v1/calendar/4.4.0/packages/list/main.min.js',
                'https://resources.crud4.com/v1/calendar/4.4.0/packages/bootstrap/main.min.js',
            ]
        },
        'cropperjs': {
            'css': [
                'https://resources.crud4.com/v1/cropperjs/v1/cropper.min.css',
            ],
            'js': [
                'https://resources.crud4.com/v1/cropperjs/v1/cropper.min.js',
                'https://resources.crud4.com/v1/cropperjs/v1/jquery-cropper.min.js',
                'https://resources.crud4.com/v1/cropperjs/v1/init_cropper.js',
            ]
        },
        'i18nflag': {
            'css': [
                'https://resources.crud4.com/v1/i18nflag/i18nflag.css',
            ],
        },

    };

};
//============================================================================//
General.prototype.addWidget_pack = function (name, value) {
    this.widget_pack[name] = value;
}
General.prototype.batchProcessing = function (postData, row, $actionurl) {

    if (typeof window[this.jsname] === 'undefined') {
        alertFail(this.jsname + ' object no exist on batchProcessing');
        return;
    }

    var JSObject = window[this.jsname];

    //selected ids
    var ids = JSObject.get_selectedIds();

    if (ids.length < 1) {

        JSObject.reload_datatable();
        //$datatable.ajax.reload(null, false);
        return this;
    }

    if (!Swal.isVisible()) {
        //Stop Button Clicked
//        $datatable.ajax.reload(null, false);

        JSObject.reload_datatable();
        return this;
    }

    var update_element = document.getElementById("update_element");
    var percentage = (((row + 1) * 100) / (ids.length + row));

    var $id = ids[0]; //always select first

    $.ajax({
        method: "POST", //for PUT not yet CI is not ready 
        url: $actionurl + '/' + $id,
        data: postData
    }).done(function () {

        if (Swal.isVisible()) {
            update_element.innerHTML = row + 1;
            document.getElementById("update_bar").style.width = percentage + "%";
        }

        $('.selectedCount').html(ids.length);

        if (typeof ids[1] != 'undefined') {
            //nex iteration
            JSObject.getDT1().row('#' + $id).deselect();

            general.batchProcessing(postData, row + 1, $actionurl);

        } else {

            setTimeout(function () {
                Swal.close();
            }, 1000);

            JSObject.getDT1().row('#' + $id).deselect();
            JSObject.reload_datatable();

            alertSuccess(homeLang('completed'));

            checkStatisticCard();
        }

    }).fail(function (jqXHR, textStatus, errorThrown) {

        var jsonData = _returnJsonData(jqXHR);

        var $breakLoop = false;

        if (typeof jsonData.breakLoop != 'undefined' && jsonData.breakLoop === 1) {
            $breakLoop = true;
        }

        if ($breakLoop)
        {
            alertFail(_getApiErrorString(jqXHR));
            JSObject.reload_datatable();

        } else {

            alertFail(jsonData.error);

            if (Swal.isVisible()) {
                update_element.innerHTML = row + 1;
                document.getElementById("update_bar").style.width = percentage + "%";
            }

            $('.selectedCount').html(ids.length);

            if (typeof ids[1] !== 'undefined') {
                //nex iteration
                JSObject.getDT1().row('#' + $id).deselect();

                general.batchProcessing(postData, row + 1, $actionurl);

            } else {

                setTimeout(function () {
                    Swal.close();
                }, 1000);

                JSObject.reload_datatable();

                alertSuccess(homeLang('completed'));
            }

        }

    });

    return this;
};
General.prototype.loadPackage = function (name, onload) {

    //Load only once
    if (jQuery.inArray(name, _loadedPackList) > -1) {

        if (typeof onload !== 'undefined') {
            onload();
        }
        return this;
    }

    if (jQuery.inArray(name, _onloadingPackList) > -1) {
        
        $(document).on("on_package_loaded", function (event, sName) {
            if (sName === name) {
                if (typeof onload !== 'undefined') {
                    onload();                    
                }
            }
        });
        return this;
    }

    //Add package into list
    _onloadingPackList.push(name);
   
    if (!$.isEmptyObject(this.widget_pack[name])) {

        var $package = this.widget_pack[name];

        // Load css files of package
        if (!$.isEmptyObject($package['css'])) {
            for (var key in $package['css']) {
                
                var cssUrl = $package['css'][key] + '?cacheID=' + cacheID;
                loadStyle(cssUrl);                
            }
        }

        // Load JS file of package
        if (!$.isEmptyObject($package['js'])) {

            loadJSArray($package['js'], function () {

                _loadedPackList.push(name);
                $(document).trigger("on_package_loaded", name);
                                
                if (typeof onload !== 'undefined') {
                    onload();
                }

            });
        }
    } else {

        console.log(name, 'There is no package');

        if (typeof onload === "function") {
            onload();
        }
    }
    return this;
};
General.prototype.initPackage = function (packageList) {

    if (typeof packageList === 'undefined') {
        return this;
    } else if (typeof packageList === 'string') {
        packageList = packageList.split(",");
    }

    if ($.isEmptyObject(packageList)) {
        return this;
    }

    for (var key in packageList) {

        var packageName = packageList[key].trim();

        //--------------------------------------------------------------------
        // codemirror
        if (packageName === 'codemirror') {
            this.loadPackage('codemirror', function () {
                if ($('.code_mirror').length > 0) {
                    $('.code_mirror').each(function (index) {
                        CodeMirror.fromTextArea(document.getElementById($(this).attr('id')), {
                            lineNumbers: true,
                            indentUnit: 4,
                            indentWithTabs: true,
                            theme: 'monokai',
                            styleActiveLine: true,
                            matchBrackets: true,
                            autoRefresh: true
                        }).on('change', editor => {
                            editor.save();
                        });
                    });
                }
            });
        }
        //--------------------------------------------------------------------
        // input_number
        else if (packageName === 'input_number') {
            change_input2money('input_number');
        }
        //--------------------------------------------------------------------
        // SummerNote
        else if (packageName === 'summernote') {

            this.loadPackage('summernote', function () {

                if ($('.summernote').length > 0) {

                    setTimeout(function () {
                        $('.summernote').summernote({
                            dialogsInBody: true,
                            height: 100,
                            width: '100%',
                            tabsize: 2
                        });
                    }, 500);

                    //Destroy summernote on model hidden
                    $('#general_modal').on('hide.bs.modal', function () {
                        $('.summernote').summernote('destroy');
                        $('.note-popover').remove();
                    });
                }

            });
        }
        //--------------------------------------------------------------------
        // datetimepicker
        else if (packageName === 'datetimepicker') {

            this.loadPackage('datetimepicker', function () {

                if ($('.datetimepicker').length > 0) {

                    $('.datetimepicker').datetimepicker({
                        format: 'YYYY-MM-DD HH:mm',
                        keepOpen: false,
                        icons: {
                            time: 'fas fa-clock',
                        },
                    });
                }

            });
        }
        //--------------------------------------------------------------------
        // datepicker
        else if (packageName === 'datepicker') {

            this.loadPackage('datepicker', function () {

                if ($('.datepicker').length > 0) {
                    $('.datepicker').datetimepicker({
                        format: 'YYYY-MM-DD',
                        keepOpen: false,
                        ignoreReadonly: true,
                        icons: {
                            time: 'fas fa-clock',
                        },
                    });
                }

            });
        }
        //--------------------------------------------------------------------
        // dropzone
        else if (packageName === 'dropzone') {

            this.loadPackage('uisortable', function () {

                general.loadPackage('dropzone', function () {
                    init_dropzone();
                });
            });
        }
        //--------------------------------------------------------------------
        // selectpicker
        else if (packageName === 'selectpicker') {

            initSelectpicker();

        }
        //--------------------------------------------------------------------
        // select2_js
        else if (packageName === 'select2_js') {

            this.loadPackage('select2_js', function () {
                
                if ($('.select2_js').length > 0) {

                    init_select2_js();

                }

            });
        }
        //--------------------------------------------------------------------
        else if (packageName === 'checkAndShow') {

            this.loadPackage('checkAndShow', function () {

                function toogleGrups($element, show) {

                    var toogleIDs = $element.data('toogleids');
                    var arr = toogleIDs.split(',');

                    for (key in arr) {

                        if (show) {
                            $('#groupField_' + arr[key]).show();
                        } else {
                            $('#groupField_' + arr[key]).hide();
                        }

                    }

                    if (show === false) {

                        for (key in arr) {

                            var $subGroup = $('#groupField_' + arr[key]);
                            if ($subGroup.find('.checkAndShow').length > 0) {

                                $subGroup.find('.checkAndShow').prop('checked', false);
                                $subGroup.find('.checkAndShow').each(function () {
                                    toogleGrups($(this), false);
                                });
                            }
                        }
                    }
                }

                $(".checkAndShow").each(function () {
                    toogleGrups($(this), $(this).is(":checked"));
                }).on('change', function () {
                    toogleGrups($(this), $(this).is(":checked"));
                });

            });
        }
        //--------------------------------------------------------------------
        // selectAndShow
        else if (packageName === 'selectAndShow') {

            this.loadPackage('selectAndShow', function () {

                $(".selectAndShow").each(function () {

                    var selectandshow = $(this).data('selectandshow');
                    var hidelist = $(this).data('hidelist');
                    var value = $(this).val();

                    //Hide All
                    if (!isEmpty(hidelist)) {
                        for (key in hidelist) {
                            console.log('#groupField_' + key, 'hidden');
                            $('#groupField_' + key).hide();
                        }
                    }

                    // Show Checked Value
                    if (!isEmpty(selectandshow) && !isEmpty(selectandshow[value])) {
                        for (key in selectandshow[value]) {
                            var n = selectandshow[value][key];
                            $('#groupField_' + n).show();
                        }
                    }

                }).on('change', function () {

                    var selectandshow = $(this).data('selectandshow');
                    var hidelist = $(this).data('hidelist');
                    var value = $(this).val();
                    //Hide All
                    if (!isEmpty(hidelist)) {
                        for (key in hidelist) {
                            console.log('#groupField_' + key, 'hidden');
                            $('#groupField_' + key).hide();
                        }
                    }
                    // Show Checked Value
                    if (!isEmpty(selectandshow) && !isEmpty(selectandshow[value])) {
                        for (key in selectandshow[value]) {
                            var n = selectandshow[value][key];
                            $('#groupField_' + n).show();
                        }
                    }
                });
            });
        }
        //--------------------------------------------------------------------
        // typeahead_js
        else if (packageName === 'typeahead_js') {
            this.loadPackage('typeahead_js', function () {
                if ($('.typeahead_js').length > 0) {
                    init_typeahead_js();
                }
            });
        }
        //--------------------------------------------------------------------
        // INVOICE_ITEM_CALCULATION
        else if (packageName === 'INVOICE_ITEM_CALCULATION') {
            this.loadPackage('INVOICE_ITEM_CALCULATION', function () {
                INIT_INVOICE_ITEM_CALCULATION();
            });
        }
        //--------------------------------------------------------------------
        else if (packageName === 'uisortable') {
            this.loadPackage('uisortable', function () {

            });
        }
        //--------------------------------------------------------------------
        else if (packageName === 'amcharts') {
            this.loadPackage('amcharts', function () {


            });
        }
        //--------------------------------------------------------------------
        //statisticCard depend on amcharts
        else if (packageName === 'statisticCard') {
            this.loadPackage('amcharts', function () {
                general.loadPackage('statisticCard', function () {
                    initStatisticCard();
                });
            });
        }
        //--------------------------------------------------------------------
        else if (packageName === 'dataTable') {
            this.loadPackage('dataTable', function () {
                loadDatatableLang();
            });
        }
        //--------------------------------------------------------------------
        else if (packageName === 'input_slug') {
            this.loadPackage('input_slug', function () {
                initSlug();
            });
        }
        //--------------------------------------------------------------------
        else if (packageName === 'databasedesigner') {
            /**
             * This package for CRUD4 usage. You can delete..
             */
            general.addWidget_pack('databasedesigner', {'js': [
                    'https://resources.crud4.com/crud4/jqueryHtml.js',
                    'https://resources.crud4.com/crud4/databaseDesigner.js'
                ]});

            this.loadPackage('databasedesigner', function () {});
        }
        //--------------------------------------------------------------------
        else if (packageName === 'bootstrap-toggle') {
            this.loadPackage('bootstrap-toggle', function () {
                $('[data-toggle="toggle"]').bootstrapToggle('destroy').bootstrapToggle();
            });
        }
        //--------------------------------------------------------------------
        else if (packageName === 'reCAPTCHAv3') {
            initReCAPTCHAv3();
        }
        //--------------------------------------------------------------------
        else if (packageName === 'popover') {
            $('[data-toggle="popover"]').popover();
        } else if (packageName === 'tooltip') {
            destroyToolTip();
            initToolTip();
        }
        //--------------------------------------------------------------------
        else if (packageName === 'cropperjs') {
            this.loadPackage(packageName, function () {

            });
        }
        //--------------------------------------------------------------------
        else {
            this.loadPackage(packageName, function () {
                console.log(packageName, 'packageName loaded');
            });
        }
    }
    return this;
};
//============================================================================//
General.prototype.setModalContainer = function (modalContainer) {
    this.modalContainer = modalContainer;
    return this;
};
General.prototype.showModal = function (url, postData, onShowed) {

    if (typeof postData === 'undefined') {
        postData = {};
    } else if (typeof postData === 'string' && postData.length > 1) {

        try {
            postData = JSON.parse(postData);
        } catch (e) {
            postData = {};
        }
    }

    var selector = this.modalContainer;
    var modalSize = this.modalSize;

    if (typeof selector !== 'string' || selector === '') {
        selector = '#general_modal';
    }

    if (typeof modalSize === 'undefined' || modalSize === '') {
        modalSize = 'lg';
    }
    var $container = $(selector);

    $container.find('.modal-dialog').removeClass('modal-sm').removeClass('modal-md').removeClass('modal-xl').removeClass('modal-lg').css("maxWidth", '');

    if (modalSize === 'xl') {
        $container.find('.modal-dialog').addClass('modal-xl');
    } else if (modalSize === 'lg') {
        $container.find('.modal-dialog').addClass('modal-lg');
    } else if (modalSize === 'md') {
        $container.find('.modal-dialog').addClass('modal-md');
    } else if (modalSize === 'sm') {
        $container.find('.modal-dialog').addClass('modal-sm');
    } else if (modalSize === 'xl') {
        $container.find('.modal-dialog').removeClass('modal-sm').addClass('modal-lg').css("maxWidth", '966px');
    } else {
        $container.find('.modal-dialog').css("maxWidth", modalSize);
    }

    $container.removeClass('centermodal').removeClass('leftmodal').removeClass('rightmodal').removeClass('topmodal').addClass(this.modalview);

    $container.find('.modal-content').html(`<div class="text-center m-5">
        <div class="spinner-border text-center" style="width: 4rem; height: 4rem;" role="status"><span class="sr-only">Loading...</span></div>
    </div>
`);

    console.log(this.modalbackdrop, 'this.modalbackdrop');

    $container.modal({
        show: true,
        backdrop: this.modalbackdrop,
    });

//     $container.on('shown.bs.modal', function () {
//     });

    $.ajax({
        url: url,
        type: "POST",
        data: postData,
        dataType: 'html',
    }).done(function (data) {

        $container.find('.modal-content').html(data);

        if (typeof onShowed === "function") {
            onShowed();
        }

        return this;

    }).fail(function (jqXHR, textStatus, errorThrown)
    {

        checkResponse(jqXHR);

        $container.find('.modal-content').html('<div class="alert alert-danger mt-3">' + _getApiErrorString(jqXHR) + '</div>');

        return this;

    });


};
General.prototype.showFormModal = function (url, postData) {

    var $this = this;

    this.showModal(url, postData, function () {

        $this.initForm($($this.modalContainer).find('form'));
    });

    return this;
};
General.prototype.initForm = function ($formElement, onDone, onFail) {

    var $packagelist = $formElement.data('packagelist');
    var $this = this;


    this.initPackage($packagelist);

    /**
     * Triger on onFormInit
     * listening 
     * $(document).on("onFormInit", function (event, data) {});
     * 
     */
    $(document).trigger("onFormInit", {'id': $formElement.attr('id'), 'action': $formElement.attr('action')});

    $formElement.submit(function (event) {

        event.preventDefault();

        var $formAction = $formElement.attr('action');
        var $submitButton = $formElement.find('[type=submit]');
        var $dismissButton = $formElement.find('[data-dismiss]');
        var $formAlert = $formElement.find('.formAlert');
        var $closeonsave = $formElement.data('closeonsave');
        var $jsname = $formElement.data('jsname');

        if (typeof $closeonsave === 'undefined') {
            $closeonsave = true;
        }

        var modalContainer = this.modalContainer;

        if ($submitButton.length > 0) {
            $this.setSubmitButton($submitButton);
        }
        if ($dismissButton.length > 0) {
            $this.setDismissButton($dismissButton);
        }

        if ($formAlert.length === 0) {
            //Prepare alert are if not exist.

            var $alertDiv = `
                <div class="alert alert-danger alert-dismissible formAlert d-none" role="alert" >
                    <div class=""><span class="sr-only">Errors...</span></div>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;

            $formElement.prepend($alertDiv);
            $formAlert = $formElement.find('.formAlert');
        }

        // Hide the Alert Div
        $formAlert.removeClass('d-none').removeClass('alert-danger').removeClass('alert-success').addClass('d-none');

        $('.invalid-feedback').remove();
        $('.is-valid').removeClass('is-valid').removeClass('is-invalid');

        $this.buttonDisable();

        $.post($formAction, $formElement.serialize(), "json")
                .done(function (jqXHR, textStatus, errorThrown) {

                    /**
                     * Triger on Form Done
                     * listen 
                     * $(document).on("onFormDone", function (event, data) {});
                     * 
                     */
                    $(document).trigger("onFormDone", {
                        'formid': $formElement.attr('id'),
                        'returnData': jqXHR,
                        'formData': $formElement.serializeArray()
                    });

                    var messagesToString = _getApiSuccessString(jqXHR);

                    //show the alert
                    $formAlert.removeClass('d-none').addClass('alert-success').find('div').html(messagesToString);

                    alertSuccess(messagesToString);

                    if (typeof onDone === "function") {
                        // Call it, since we have confirmed it is callable
                        onDone(jqXHR, textStatus, errorThrown);
                    }

                    if (!isEmpty($this.datatable) && $('#' + $this.datatable).length > 0) {

                        if ($.fn.DataTable.isDataTable('#' + $this.datatable)) {

                            $('#' + $this.datatable).DataTable().ajax.reload(null, false);


                        } else {

                            if (typeof window[$jsname] !== 'undefined') {
                                window[$jsname].reload_datatable();
                            }
                        }
                    }

                    if ($($this.modalContainer).is(':visible') && $closeonsave) {
                        setTimeout(function () {
                            hide_ajax_modal($this.modalContainer);
                            $this.modalContainer = '#general_modal';
                        }, 1500);
                    } else {
                        //if not modal, refreshRecaptcha
                        initReCAPTCHAv3();
                    }

                    checkStatisticCard();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {

                    //if you dont use google recaptcha, you can delete..
                    initReCAPTCHAv3();

                    var jsonData = _returnJsonData(jqXHR);
                    var error = _getApiErrorString(jqXHR);

                    if (typeof jsonData.messages === 'object' && (Object.keys(jsonData.messages).length > 0)) {
                        /**
                         * Show Error Under Form Input if name exist!.
                         */
                        $('.is-valid').removeClass('is-valid');
                        $('.is-invalid').removeClass('is-invalid');

                        // Array Errors
                        for (var key in jsonData.messages) {

                            var $element = $('[name="' + key + '"]');

                            if ($element.length > 0 && $element.attr('type') != 'hidden') {

                                $element.addClass('is-invalid');
                                $element.last().parent('div').append('<div class="invalid-feedback">' + jsonData.messages[key] + '</div>');
                            } else if (key.search('\\.\\*') > 0) {
                                //for multiple inputs like checkbox[]
                                var simpleKey = key.split('.')[0];
                                $('#groupField_' + simpleKey).find('input').addClass('is-invalid');
                                $('#groupField_' + simpleKey).find('input:last').parent('div').append('<div class="invalid-feedback">' + jsonData.messages[key] + '</div>');
                            } else {

                                if (key === 'error') {
                                    error = jsonData.messages['error'];
                                    break;
                                } else {
                                    error += '<br/>' + jsonData.messages[key];
                                }
                            }
                        }
                    }

                    // Show The Alert Div
                    $formAlert.removeClass('d-none').addClass('alert-danger').find('div').html(error);

                    if (typeof onFail === "function") {
                        // Call it, since we have confirmed it is callable
                        onFail(jqXHR, textStatus, errorThrown);
                    }

                })
                .always(function (jqXHR, textStatus, errorThrown) {
                    //Remove spinner                    
                    $this.buttonEnable();
                    //$formElement.unblock();
                    checkResponse(jqXHR);

                });
    });

    return this;
};
//============================================================================//
General.prototype.setModalSize = function (modalSize) {

    if (typeof modalSize !== 'undefined') {
        this.modalSize = modalSize;
    }

    return this;
};
General.prototype.setModalView = function (modalview) {

    if (!isEmpty(modalview)) {
        this.modalview = modalview;
    } else {
        this.modalview = 'centermodal';
    }

    return this;
};
General.prototype.setModalBackDrop = function (modalbackdrop) {

    this.modalbackdrop = true;

    if (!isEmpty(modalbackdrop)) {
        this.modalbackdrop = modalbackdrop;
    }

    return this;
};
General.prototype.setDatatable = function (datatable) {

    if (typeof datatable !== 'undefined') {
        this.datatable = datatable;
    }

    return this;
};
General.prototype.setJsname = function (jsname) {

    if (typeof jsname !== 'undefined') {
        this.jsname = jsname;
    }

    return this;
};
General.prototype.getDatatable = function () {

    if (typeof window[this.jsname] !== 'undefined') {

        window[this.jsname].getDT1();
    }

    return $('#' + this.datatable).DataTable();

};
//============================================================================//
General.prototype.buttonEnable = function () {

    if (this.submitButton.length > 0 && typeof this.submitButton === 'object') {
        this.submitButton.attr("disabled", false).find('.spinner').remove();
    }
    if (this.dismissButton.length > 0 && typeof this.dismissButton === 'object') {
        this.dismissButton.attr("disabled", false).find('.spinner').remove();
    }

    return this;
}
General.prototype.buttonDisable = function () {

    if (this.submitButton.length > 0 && typeof this.submitButton === 'object') {
        this.submitButton.prepend('<div class="text-center spinner"><span class="spinner-border spinner-border-sm  float-left" role="status" aria-hidden="true"></span></div>');
        this.submitButton.attr("disabled", true);
    }

    if (this.dismissButton.length > 0 && typeof this.dismissButton === 'object') {
        this.dismissButton.prepend('<div class="text-center spinner"><span class="spinner-border spinner-border-sm  float-left" role="status" aria-hidden="true"></span></div>');
        this.dismissButton.attr("disabled", true);
    }

    return this;
}
General.prototype.setSubmitButton = function ($buttonElement) {

    if (typeof $buttonElement === 'object') {

    }
    this.submitButton = $buttonElement;

    return;
}
General.prototype.setDismissButton = function ($buttonElement) {

    if (typeof $buttonElement === 'object') {

    }
    this.dismissButton = $buttonElement;

    return;
}
//============================================================================//

var general = new General();

document.addEventListener('DOMContentLoaded', function () {

    // -------------------------------------------------------------------------
    /**
     * SECURITY is KING :))
     * CSRF protection
     * 
     */
    var $csrf_meta = $('#csrf_header');

    $.ajaxSetup({
        headers: {
            [$csrf_meta.attr("name")]: $csrf_meta.attr("content")
        }
    });

    // -------------------------------------------------------------------------
    /**
     * openformmodal 
     * Run when Click openformmodal button 
     */
    $(document).on('click', '[data-action="openformmodal"]', function () {
        event.preventDefault();


        general.setModalBackDrop($(this).data('modalbackdrop'))
                .setModalSize($(this).data('modalsize'))
                .setModalView($(this).data('modalview'))
                .setDatatable($(this).data('datatable'))
                .showFormModal($(this).data('modalurl'), $(this).data('modaldata'));


    });

    // -------------------------------------------------------------------------
    /**
     * Used in Dropzone File Delete
     * <a href="#" data-action="showdeletefile" data-fileid="28" data-datatable="table_user" data-actionurl="ajaxurl"></a>
     * DEPRECATED ..  WILL BE DELETED
     */
//    $(document).on('click', '[data-action="showdeletefile"]', function () {
//
//        event.preventDefault();
//
//        var actionUrl = $(this).data('actionurl');
//        var file_id = $(this).data('fileid');
//        var datatable = $(this).data('datatable');
//
//        Swal.fire({
//            title: homeLang('areyousure_deletefile'),
//            icon: 'warning',
//            html: '<span class="badge badge-danger">' + homeLang('can_not_be_undone') + '</span>',
//            showCancelButton: true,
//            confirmButtonText: homeLang('yes_go_on'),
//            cancelButtonText: homeLang('cancel'),
//            heightAuto: false
//        }).then(function (result) {
//            if (result.value) {
//
//                ajaxDelete(actionUrl, function (data) {
//                    $("#file_" + file_id).closest('.dz-preview').remove();
//                    alertSuccess(homeLang('file_deleted'));
//                });
//            }
//        });
//
//    });

    // -------------------------------------------------------------------------
    /**
     * showdelete Record
     * Used in datatable delete button.. 
     * Show Delete alert and refresh the datatable..
     * <a href="" data-datatable="table_file" data-ajaxurl="" data-action="showdelete">Delete</a> 
     * Deprecated!. use data-action="apirequest"
     *   
     * DEPRECATED ..  WILL BE DELETED
     */

//    $(document).on('click', '[data-action="showdelete"]', function () {
//
//        event.preventDefault();
//
//        var $ajaxUrl = $(this).data('ajaxurl');
//        var $datatable = $(this).data('datatable');
//
//        var $this = this;
//
//        Swal.fire({
//            title: homeLang('areyousure'),
//            text: homeLang('will_be_deleted'),
//            icon: 'warning',
//            showCancelButton: true,
//            confirmButtonText: homeLang('delete'),
//            confirmButtonColor: '#d33',
//            cancelButtonText: homeLang('cancel'),
//            reverseButtons: true,
//            heightAuto: false
//        }).then(function (result) {
//
//            if (result.value) {
//                ajaxDelete($ajaxUrl, function (data) {
//
//                    // ---------------------------------------------------------
//                    /**
//                     * Triger on Form Done
//                     * listen 
//                     * $(document).on("onDeleted", function (event, data) {});
//                     * 
//                     */
//                    $(document).trigger("onDeleted", data);
//
//                    // ---------------------------------------------------------
//
//                    alertSuccess(homeLang('deleted'));
//
//                    if (!isEmpty($datatable)) {
//                        if ($.fn.DataTable.isDataTable('#' + $datatable)) {
//                            $('#' + $datatable).DataTable().ajax.reload();
//                        }
//                    } else {
//
//                        $($this).closest('tr').remove();
//                    }
//
//                    checkStatisticCard();
//                });
//            }
//
//        });
//    });

    // -------------------------------------------------------------------------
    /**
     * Used in batch Processing of Datatable.
     * 
     * <a data-action="show_dt_replace" data-actionurl="" data-datatable="table_user" data-question="Are You Sure?" 
     * data-subtitle="Recod Will Be Deleted" data-processingtitle="Deleted" data-postdata="{deleted_at:1}">Delete</a>
     */
    $(document).on('click', '[data-action="show_dt_replace"]', function () {

        event.preventDefault();

        var $actionurl = $(this).data('actionurl');
        var $datatableID = $(this).data('datatable');
        var $jsname = $(this).data('jsname');

        var $postformid = $(this).data('postformid');
        var $postdata = $(this).data('postdata');

        var $question = $(this).data('question');
        var $subtitle = $(this).data('subtitle');
        var $processingtitle = $(this).data('processingtitle');

        if ($('#' + $datatableID).length === 0) {
            alertFail($datatableID + ' no exist on show_dt_replace');
            return;
        }

        if (typeof window[$jsname] === 'undefined') {
            alertFail($jsname + ' function no exist');
            return;
        }

        general.setJsname($jsname).setDatatable($datatableID);

        var JSObject = window[$jsname];

        var selectedIds = JSObject.get_selectedIds();
        var length = selectedIds.length;

        if (selectedIds.length < 1) {
            JSObject.reload_datatable();
            //$datatable.ajax.reload(null, false);
            return this;
        }

        $question = !isEmpty($question) ? $question : homeLang('areyousure');
        $subtitle = !isEmpty($subtitle) ? $subtitle : '';
        $processingtitle = !isEmpty($processingtitle) ? $processingtitle : homeLang('processing');

        if (!isEmpty($postdata)) {
            if (typeof $postdata === 'string' && $postdata.length > 1) {
                try {
                    $postdata = JSON.parse($postdata);
                } catch (e) {
                    $postdata = {};
                }
            }
        } else if (!isEmpty($postformid)) {
            $postdata = $('#' + $postformid).serialize();
        }


        Swal.fire({
            title: $question,
            html: $subtitle,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: homeLang('yes_go_on'),
            confirmButtonColor: '#d33',
            cancelButtonText: homeLang('cancel'),
            reverseButtons: true,
            heightAuto: false
        }).then(function (result) {
            if (result.value) {

                Swal.fire({
                    allowOutsideClick: false,
                    title: $processingtitle,
                    icon: 'warning',
                    html: `<strong id="update_element">0</strong> / <strong id="update_total">` + length + `</strong> ` + homeLang('processing') + `
                                        <div class="progress">
                                            <div id="update_bar" style="width: 1%" aria-valuenow="100" class="progress-bar progress-bar-striped bg-danger" role="progressbar"   aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>`,
                    confirmButtonText: 'Stop',
                    heightAuto: false
                });

                general.batchProcessing($postdata, 0, $actionurl);
            }
        });

    });

    // -------------------------------------------------------------------------
    /**
     * Click submit button which is outside of the form
     *  
     *  Usage
     * <button type="button" data-buttontype="submitbutton" data-target="#form_create"></button>
     */

    $(document).on('click', '[data-buttontype="submitbutton"]', function () {

        var target = $(this).data('target');
        general.setSubmitButton($(this));

        $(target).attr("type", "submit");

        $(target).submit(); //Send Submit Event
    });

    // -------------------------------------------------------------------------
    /**
     * inlineEditToogle On Changed
     */
    $(document).on('change', '[data-action="inlineEditToogle"]', function () {

        var actionurl = $(this).data('actionurl');
        var p_data = {};

        if (!isEmpty($(this).data('toggle'))) {

            p_data[$(this).attr('name')] = $(this).prop('checked') ? 1 : 0;
        } else {
            p_data[$(this).attr('name')] = $(this).val();
        }

        $.ajax({
            url: actionurl,
            type: "POST",
            data: p_data,
            dataType: 'json',
        }).done(function (data) {

            alertSuccess(_getApiSuccessString(data));
            checkStatisticCard();

        }).fail(function (jqXHR, textStatus, errorThrown) {
            checkResponse(jqXHR);
            alertFail(_getApiErrorString(jqXHR));
        });
    });

    // -------------------------------------------------------------------------
    /**
     * 
     */
    $(document).on('click', '[data-action="adddate"]', function () {

        event.preventDefault();

        var lengthvalue = $(this).data('lengthvalue');
        var length = $(this).data('length');
        var startdatefield = $(this).data('startdatefield');
        var field = $(this).data('field');
        var isdatetime = $(this).data('isdatetime');

        if (isEmpty(isdatetime)) {
            isdatetime = false;
        }

        var format = isdatetime ? 'YYYY-MM-DD H:i:s' : 'YYYY-MM-DD';
        var startdate = null;

        if (!isEmpty(startdatefield)) {
            startdate = $('[name="' + startdatefield + '"]').val();
        }

        if (isEmpty(startdate)) {
            startdate = moment().format(format);
        }

        var new_value = moment(startdate).add(lengthvalue, length).format(format);
        $('[name="' + field + '"]').val(new_value);

    });
    // -------------------------------------------------------------------------
    /**
     *   Usage E.g
     *   data-action="apirequest"
     *   data-actionurl="http://" =>if empty system get href=""
     *   data-timer="5000" => time in milisecond to showing swall alert
     *   data-question="Are you sure?" 
     *   data-subtitle="Admin Panel will be created"
     *   data-usehomelang="true" => means question="areyousure" equal to question="homeLang('areyousure')"
     *   
     *   data-datatable="table_crud4_project" 
     *   data-deleteline="#sss" 
     *   data-refreshcards="true"
     *   data-ajaxmethod="POST" =>GET|POST|DELETE
     *   data-icon="warning" => warning|error|success|info
     *   data-position="center" =>'top', 'top-start', 'top-end', 'center', 'center-start', 'center-end', 'bottom', 'bottom-start', or 'bottom-end'
     *   
     */

    $(document).on('click', '[data-action="apirequest"]', function () {

        event.preventDefault();

        var $this = $(this);

        var $actionurl = $(this).data('actionurl');
        var $ajaxmethod = $(this).data('ajaxmethod');
        var $postdata = $(this).data('postdata');
        var $question = $(this).data('question');
        var $subtitle = $(this).data('subtitle');
        var $timer = $(this).data('timer');
        var $icon = $(this).data('icon');
        var $deleteline = $(this).data('deleteline');
        var $datatable = $(this).data('datatable');
        var $jsname = $(this).data('jsname');
        var $refreshcards = $(this).data('refreshcards');
        var $position = $(this).data('position');
        var $usehomelang = $(this).data('usehomelang');


        if (isEmpty($ajaxmethod)) {
            $ajaxmethod = "GET"; //GET POST DELETE PUT
        }

        console.log($ajaxmethod, '$ajaxmethod$ajaxmethod');

        if (isEmpty($actionurl)) {
            $actionurl = $(this).attr('href');
        }

        if (isEmpty($icon)) {
            $icon = 'warning';
        }

        if (isEmpty($timer)) {
            $timer = 1500;
        }

        if (isEmpty($position)) {
            $position = 'center';
        }

        if (!isEmpty($postdata)) {

            $ajaxmethod = "POST";

            if (typeof $postdata === 'string' && $postdata.length > 1) {
                try {
                    $postdata = JSON.parse($postdata);
                } catch (e) {
                    $postdata = {};
                }
            }
        }

        if (!isEmpty($(this).data('toggle'))) {
            $postdata[$(this).attr('name')] = $(this).prop('checked') ? 1 : 0;
        }

        if (!isEmpty($usehomelang)) {

            if (!isEmpty($question)) {
                $question = homeLang($question);
            }
            if (!isEmpty($subtitle)) {
                $subtitle = homeLang($subtitle);
            }
        }


        if (!isEmpty($question)) {

            Swal.fire({
                title: $question,
                html: $subtitle,
                position: $position,
                icon: $icon,
                showCancelButton: true,
                confirmButtonText: homeLang('yes_go_on'),
                confirmButtonColor: '#d33',
                cancelButtonText: homeLang('cancel'),
                reverseButtons: true,
                heightAuto: false
            }).then(function (result) {
                if (result.value) {

                    Swal.fire({
                        title: homeLang('loading') + '...',
                        html: 'Please Wait',
                        timerProgressBar: true,
                        onBeforeOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    $.ajax({
                        url: $actionurl,
                        type: $ajaxmethod,
                        data: $postdata,
                        dataType: 'json',
                    }).done(function (data) {

                        alertSuccess(_getApiSuccessString(data), $timer);

                        if ($refreshcards) {
                            checkStatisticCard();
                        }

                        if (!isEmpty($datatable) && typeof $.fn.DataTable !== 'undefined') {
                            if ($.fn.DataTable.isDataTable('#' + $datatable)) {
                                $('#' + $datatable).DataTable().ajax.reload();
                            }
                        }

                        if (!isEmpty($deleteline)) {
                            $this.closest($deleteline).first().hide();
                        }

                        if ($ajaxmethod.toLowerCase() === 'delete')
                        {
                            $(document).trigger("onDeleted", data);
                        }

                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        checkResponse(jqXHR);
                        alertFail(_getApiErrorString(jqXHR), $timer);
                    });
                }
            });

        } else {

            Swal.fire({
                title: homeLang('loading') + '...',
                html: 'Please Wait',
                timerProgressBar: true,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });

            $.ajax({
                url: $actionurl,
                type: $ajaxmethod,
                data: $postdata,
                dataType: 'json',
            }).done(function (data) {

                alertSuccess(_getApiSuccessString(data), $timer);

                if ($refreshcards) {
                    checkStatisticCard();
                }

                if (!isEmpty($datatable) && typeof $.fn.DataTable !== 'undefined') {
                    if ($.fn.DataTable.isDataTable('#' + $datatable)) {
                        $('#' + $datatable).DataTable().ajax.reload();
                    }
                }

                if (!isEmpty($deleteline)) {
                    $this.closest($deleteline).first().hide();
                }

                if ($ajaxmethod.toLowerCase() === 'delete')
                {
                    $(document).trigger("onDeleted", data);
                }

            }).fail(function (jqXHR, textStatus, errorThrown) {
                checkResponse(jqXHR);
                alertFail(_getApiErrorString(jqXHR), $timer);

            });
        }
    });


    // -------------------------------------------------------------------------
    //Clear modal content on modal hide..
    $('#general_modal').on('hide.bs.modal', function () {
        $('#general_modal').find('.modal-content').html("Destoring!...");
    });

    // -------------------------------------------------------------------------

    /**
     * initilize crud4form if form not inside modal
     * used in login, auth, forgotpassword page etc.
     */

    if ($('.crud4form').length > 0) {
        $('.crud4form').each(function () {
            general.initForm($(this));
        });
    }

    // -------------------------------------------------------------------------
    // Google Analytics
    var gtagid = $("#ganalytic").data('ganalyticid');
    if (!isEmpty(gtagid)) {

        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', gtagid);
    }

    // -------------------------------------------------------------------------
    checkStatisticCard();

    // -------------------------------------------------------------------------
    /**
     * selectpicker Used in datatable search form
     */
    initSelectpicker();

    // -------------------------------------------------------------------------
    if ($('.daterangefilter').length > 0) {


        initDateRangeFilter();



    }
    // -------------------------------------------------------------------------

    /**
     * For search bar...
     */
    general.initPackage('select2_js');
    
    // -------------------------------------------------------------------------

});

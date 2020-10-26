function auto_incrementInputToogle(randomID, isChecked) {

    var checkedTxt = isChecked ? ' checked="checked" ' : '';

    return  `<input name="auto_increment[` + randomID + `]" type="checkbox" ` + checkedTxt + ` value="YES"
                            data-toggle="toggle" data-onstyle="success" data-offstyle="danger" data-size="mini"
                            data-on="YES" data-off="No" id="auto_increment_` + randomID + `"/>`;
}

function isNULLInputToogle(randomID, value) {

    var isNullArray = {'NO': 'NO', 'YES': 'YES'};
    var isChecked = (value === 'YES') ? true : false;
    var checkedTxt = isChecked ? ' checked="checked" ' : '';

//    return  `<input name="isNULL[` + randomID + `]" type="checkbox" ` + checkedTxt + ` value="YES"
//                            data-toggle="toggle" data-onstyle="success" data-offstyle="danger" data-size="mini"
//                            data-on="YES" data-off="No" id="isNULL_` + randomID + `"/>`;

    return  `` + htmlSelect('isNULL[' + randomID + ']', isNullArray, value, 'class="form-control"') + ``;

}

function isNULLInputText(randomID, isChecked) {

    var text = 'NO';
    var value = 'NO';
    var classText = 'badge badge-danger';

    if (isChecked === true) {
        text = 'YES';
        value = 'YES';
        classText = 'badge badge-success';
    }

    return '<span class="' + classText + '"> ' + text + ' </span>' + htmlInput('isNULL[' + randomID + ']', value, '', 'hidden');
}

function addManagerRow(dbManagerRow, isnew) {

    if (typeof isnew != 'undefined') {
        if ($('[data-rowname="status"]').length > 0) {

            $('[data-rowname="status"]').before(dbManagerRow);

        } else {

            $('#dbmanager_row_area').append(dbManagerRow);
        }
    } else {
        $('#dbmanager_row_area').append(dbManagerRow);
    }

}

function dbManagerRow(columndata, typlist)
{
    var randomID = Math.floor((Math.random() * 10000000) + 1);

    //----------------isNULL are
    var checkedTxt = (columndata.isNULL === 'YES') ? 'checked="checked"' : '';

    var $isNull = isNULLInputToogle(randomID, columndata.isNULL);

    //----------------

    var isNullArray = {'NO': 'NO', 'YES': 'YES'};
    var indexArray = {'': '---', 'primary': 'primary', 'unique': 'unique', 'index': 'index'};

    var readonly = '';

    if (columndata.name === 'status') {
        typlist = {};
        typlist['top'] = {};
        typlist['top'][1] = {name: 'TINYINT', title: ''};
        readonly = ' readonly';
        isNullArray = {'NO': 'NO'};
        indexArray = {'index': 'index'};

        $isNull = isNULLInputText(randomID, false);

    } else if (columndata.name === 'created_at' || columndata.name === 'updated_at') {
        typlist = {};
        typlist['top'] = {};
        typlist['top'][1] = {name: 'DATETIME', title: ''};
        readonly = ' readonly';
        isNullArray = {'NO': 'NO'};
        indexArray = {'': '---'};

        $isNull = isNULLInputText(randomID, false);

    } else if (columndata.name === 'deleted_at') {
        typlist = {};
        typlist['top'] = {};
        typlist['top'][1] = {name: 'DATETIME', title: ''};
        readonly = ' readonly';
        isNullArray = {'YES': 'YES'};
        indexArray = {'index': 'index'};

        $isNull = isNULLInputText(randomID, true);
    }

    // ------------- Auto Icrement
    var hideTxt = ' style="display:none" ';
    if (columndata.indexType === 'primary') {
        hideTxt = '';
    }
//    var checkedTxt = (columndata.extra === 'auto_increment' === '1') ? 'checked="checked"' : '';

//    var $auto_increment = `<input style="display:none" name="auto_increment[` + randomID + `]" type="checkbox" ` + checkedTxt + ` value="1"  
//                            data-toggle="toggle" data-onstyle="success" data-offstyle="danger" data-size="mini"
//                            data-on="YES" data-off="No" id="auto_increment_` + randomID + `"/>`;

    var $auto_increment = auto_incrementInputToogle(randomID, columndata.extra === 'auto_increment' ? true : false);

    // ------------- Auto Icrement  END





    var $html = `<div class="form-row mb-2 tablerow" data-rowname="` + columndata.name + `" data-rowid="` + randomID + `" id="tablerow_` + randomID + `" >`;
    $html += `<div class="col-md-1"><div ` + hideTxt + ` id="increment_col_` + randomID + `">` + $auto_increment + `</div></div>`;

    $html += `<div class="col-md-2">
                        ` + htmlInput('old_name[' + randomID + ']', columndata.name, '', 'hidden') + `
                        <div class="input-group"><div class="input-group-prepend"><span class="input-group-text"> <i class="fa fa-arrows-alt"> </i></span></div>
                        ` + htmlSelect('index[' + randomID + ']', indexArray, columndata.indexType, 'class="form-control indexType" data-id="' + randomID + '"') + `                          
                        </div>
                    </div>`;

    $html += `<div class="col-md-2">` + htmlInput('field_name[' + randomID + ']', columndata.name, 'class="form-control" required pattern="[a-zA-Z0-9_]+"' + readonly) + `</div>`;
    $html += `<div class="col-md-2">` + htmlSelectWithTitle('type[' + randomID + ']', typlist, columndata.type, 'class="form-control"') + `</div>`;
    $html += `<div class="col-md-2">` + htmlInput('constraint[' + randomID + ']', columndata.constraint, 'class="form-control" placeHolder="Length/Values" ' + readonly) + `</div>`;
    $html += `<div class="col-md-1">` + htmlInput('default[' + randomID + ']', columndata.default, 'class="form-control" placeHolder="DEFAULT"' + readonly) + `</div>`;
//    $html += `<div class="col-md-1">` + htmlSelect('isNULL[' + randomID + ']', isNullArray, columndata.isNULL, 'class="form-control"') + `</div>`;
    $html += `<div class="col-md-1">` + $isNull + `</div>`;
    $html += `<div class="col-md-1"><button type="button"  title="Remove Field" data-rowid="` + randomID + `" class="delete_db_row close float-left text-danger">
        <span aria-hidden="true">−</span>
    </button></div>`;

    $html += `</div>`;

    return $html;
}

function initDatabaseDesigner() {


    if ($('#databasedesigner').length === 0) {
        return;
    }

    var COLUMNS = jQuery.parseJSON($('input[name="COLUMNS"]').val());
    var typlist = jQuery.parseJSON($('input[name="typlist"]').val());

    if (isEmpty(COLUMNS)) {

        addManagerRow(dbManagerRow({name: 'status', type: 'TINYINT', indexType: 'index', constraint: '1', default: '1', isNULL: 'NO'}, typlist));
        addManagerRow(dbManagerRow({name: 'created_at', type: 'DATETIME', indexType: '', constraint: '', default: '', isNULL: 'NO'}, typlist));
        addManagerRow(dbManagerRow({name: 'updated_at', type: 'DATETIME', indexType: '', constraint: '', default: '', isNULL: 'NO'}, typlist));
        addManagerRow(dbManagerRow({name: 'deleted_at', type: 'DATETIME', indexType: 'index', constraint: '', default: '', isNULL: 'YES'}, typlist));


    } else {
        $.each(COLUMNS, function (key, columndata) {
            addManagerRow(dbManagerRow(columndata, typlist));
        });
    }

    $('.sortable').sortable({});
    general.initPackage('bootstrap-toggle');
//    initToolTip();
}

$(document).on("onFormInit", function (event, arg1) {

    // ---------------------------------------------------------------------
    /**
     * Database Manager Modal Acıldıgında
     */
    if (arg1.id === 'databasedesigner') {

        initDatabaseDesigner();
    }
// ---------------------------------------------------------------------

    $('.sortable').sortable({});

});




$(document).on('click', '.delete_db_row', function () {
    var rowid = $(this).data('rowid');
    $('#tablerow_' + rowid).remove();
});

$(document).on('click', '#add_db_row', function () {

    var typlist = jQuery.parseJSON($('input[name="typlist"]').val());

    addManagerRow(dbManagerRow({name: '', type: '', constraint: '', default: '', isNULL: 'NO'}, typlist), 1);

    general.initPackage('bootstrap-toggle');
//    initToolTip();

});

$(document).on('change', '.indexType', function () {



    var value = $(this).val();
    var id = $(this).data('id');

    console.log(value, 'value');
    console.log(id, 'id');

    if (value === 'primary') {
        $('#increment_col_' + id).show();

        $('#auto_increment_' + id).bootstrapToggle('on');

    } else {
        $('#increment_col_' + id).hide();
        $('#auto_increment_' + id).bootstrapToggle('of');
    }

});

initDatabaseDesigner();
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
    } else if (columndata.name === 'created_at' || columndata.name === 'updated_at') {
        typlist = {};
        typlist['top'] = {};
        typlist['top'][1] = {name: 'DATETIME', title: ''};
        readonly = ' readonly';
        isNullArray = {'NO': 'NO'};
        indexArray = {'': '---'};
    } else if (columndata.name === 'deleted_at') {
        typlist = {};
        typlist['top'] = {};
        typlist['top'][1] = {name: 'DATETIME', title: ''};
        readonly = ' readonly';
        isNullArray = {'YES': 'YES'};
        indexArray = {'index': 'index'};
    }


    var $html = `<div class="form-row mb-2 tablerow" data-rowname="` + columndata.name + `" data-rowid="` + randomID + `" id="tablerow_` + randomID + `" >
                    <div class="col-md-2">
                        ` + htmlInput('old_name[' + randomID + ']', columndata.name, '', 'hidden') + `
                        <div class="input-group"><div class="input-group-prepend"><span class="input-group-text"> <i class="fa fa-arrows-alt"> </i></span></div>
                        ` + htmlSelect('index[' + randomID + ']', indexArray, columndata.indexType, 'class="form-control"') + `                          
                        </div>
                    </div>`;

    $html += `<div class="col-md-2">` + htmlInput('field_name[' + randomID + ']', columndata.name, 'class="form-control" required pattern="[a-zA-Z0-9_]+"' + readonly) + `</div>`;
    $html += `<div class="col-md-2">` + htmlSelectWithTitle('type[' + randomID + ']', typlist, columndata.type, 'class="form-control"') + `</div>`;
    $html += `<div class="col-md-2">` + htmlInput('constraint[' + randomID + ']', columndata.constraint, 'class="form-control" placeHolder="Length/Values" ' + readonly) + `</div>`;
    $html += `<div class="col-md-2">` + htmlInput('default[' + randomID + ']', columndata.default, 'class="form-control" placeHolder="DEFAULT"' + readonly) + `</div>`;
    $html += `<div class="col-md-1">` + htmlSelect('isNULL[' + randomID + ']', isNullArray, columndata.isNULL, 'class="form-control"') + `</div>`;
    $html += `<div class="col-md-1"><button type="button" data-rowid="` + randomID + `" class="delete_db_row close float-left"><span aria-hidden="true">−</span></button></div>`;

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

});

initDatabaseDesigner();
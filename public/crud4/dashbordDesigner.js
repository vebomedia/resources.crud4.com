var array2HtmlData = function (data) {

    var $t = '';

    for (key in data) {
        $t += 'data-' + key + '="' + data[key] + '" ';
    }

    return $t;

}
function _getHtmlData($element) {

    $data = $element.data();
    $temp = {};

    for (key in $data) {

        if (key !== 'uiSortable' && key !== 'sortableItem' && key !== '__proto__') {
            $temp[key] = $data[key];
        }
    }

    return $temp;
}


var CONTAINER_ROW = function () {

    //Default Properties
    this.properties = {
        type: 'CONTAINER_ROW',
        rowid: randomID(),
        rowname: ''
    };

    this.columns = [];
};
CONTAINER_ROW.prototype.htmlView = function () {

    var $return = $(`<div class="row CONTAINER_ROW shadow mb-3 p-2 bg-white rounded" ` + array2HtmlData(this.properties) + ` style="min-height: 200px;">

            <div class="CONTAINER_ROW_CONFIG">
                <div class="btn-group-vertical btn-group-sm" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-light text-info"  data-action="showRowProperties" data-rowid="` + this.properties.rowid + `" title="Show Row Properties"><i class="fas fa-cog"></i></button>
                    <button type="button" class="btn btn-light text-info"   data-columnclass="col" data-action="addColumn" data-rowid="` + this.properties.rowid + `" title="Add Column"><i class="fa fa-plus"></i></button>
                    <button type="button" class="btn btn-light text-danger" data-action="deleteRow" data-rowid="` + this.properties.rowid + `" title="Delete ROW"><i class="fas fa-trash"></i></button>
                </div>
            </div>    
</div>`);

    if (!isEmpty(this.columns)) {

        for (key in this.columns) {
            $return.append(this.columns[key].htmlView());

        }
    }
    return $return[0].outerHTML;
};
CONTAINER_ROW.prototype.propertiesForm = function () {
    var $return = `<form style="">`;

    $return += htmlInput('activeROWID', this.properties.rowid, '', 'hidden');
    $return += htmlInput('activeROWType', this.properties.type, '', 'hidden');

    $return += `<div class="form-group"><label for="class">rowname</label>
        ` + htmlInput('rowname', this.properties.rowname, 'class="form-control row_properties"  id="rowname" ') + `
  </div>`;

    $return += `</form>`;


    return $return;
};
CONTAINER_ROW.prototype.changePropertiesData = function (data) {
    for (key in data) {
        if (typeof this.properties[key] != 'undefined') {
            this.properties[key] = data[key];
        }
    }
    return this;

};
CONTAINER_ROW.prototype.changeProperties = function (key, value) {
    this.properties[key] = value;
    return this;
};
CONTAINER_ROW.prototype.setElement = function (rowid) {
    this.properties['rowid'] = rowid;
    this.changePropertiesData($('.CONTAINER_ROW[data-rowid="' + rowid + '"]').data());
    return this;
};
CONTAINER_ROW.prototype.addColumn = function (column_object) {

    this.columns.push(column_object);
    return this;
};
CONTAINER_ROW.prototype.serialize = function ($element) {

    this.properties = _getHtmlData($element);

    var obj = {};
    $element.children('.CONTAINER_COL').each(function (index2, value2) {
        obj['col_' + index2] = new COLUMN().serialize($(this));

    });

    this.columns.push(obj);

    return this;
};


var COLUMN = function () {

    //Default Properties
    this.properties = {
        type: 'CONTAINER_COL',
        columnclass: 'col-sm',
        columnname: 'column Properties',
        columnid: randomID()

    };

    this.elements = [];

};
COLUMN.prototype.htmlView = function () {

    return `<div class="` + this.properties.columnclass + ` CONTAINER_COL OBJECT_AREA border border-secondary p-2 pt-5 pb-3"
                ` + array2HtmlData(this.properties) + `>

                                <div class="CONTAINER_COL_CONFIG">
                                    <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
                                        <button type="button" class="btn btn-light text-info" data-action="showColumnProperties" data-columnid="` + this.properties.columnid + `"><i class="fas fa-cog"></i></button>
                                        <button type="button" class="btn btn-light text-danger" data-action="deletecolumn" data-columnid="` + this.properties.columnid + `"><i class="fa fa-trash"></i></button>
                                    </div>
                                </div>
                            </div>`

};
COLUMN.prototype.propertiesForm = function () {
    var $return = `<form style="">`;

    $return += htmlInput('activeColumnID', this.properties.columnid, '', 'hidden');
    $return += htmlInput('activeColumnType', this.properties.type, '', 'hidden');

    $return += `<div class="form-group"><label for="class">columnclass</label>
        ` + htmlInput('columnclass', this.properties.columnclass, 'class="form-control column_properties"  id="columnclass" ') + `
  </div>`;

    $return += `</form>`;


    return $return;
};
COLUMN.prototype.changePropertiesData = function (data) {
    for (key in data) {
        if (typeof this.properties[key] != 'undefined') {
            this.properties[key] = data[key];
        }
    }
    return this;

};
COLUMN.prototype.changeProperties = function (key, value) {
    this.properties[key] = value;
    return this;
};
COLUMN.prototype.setElement = function (columnid) {
    this.properties['columnid'] = columnid;
    this.changePropertiesData($('.CONTAINER_COL[data-columnid="' + columnid + '"]').data());
    return this;
};
COLUMN.prototype.serialize = function ($element) {

    this.properties = _getHtmlData($element);

    // GET ELEMENT
    var out = {};
    $element.children('.ELEMENT').each(function (index3, value3) {
        var elementType = $(this).data().type;
        var JSOBJECT = returnElementObject(elementType);
        out['element_' + index3] = JSOBJECT.serialize($(this));

    });
    this.elements.push(out);

    return this;
};

var ELEMENT_ALERT = function () {

    //Default Properties
    this.properties = {
        type: 'ELEMENT_ALERT',
        elementname: 'Bootstrap Alert View',
        elementid: randomID(),
        csscolor: 'alert-primary',
        alerttext: 'Alert Text',
    };
};
ELEMENT_ALERT.prototype.htmlView = function () {

    var $return = `<div class="ELEMENT" ` + array2HtmlData(this.properties) + `>`;

    $return += `<div class="ELEMENT_CONFIG mt-0">
                    <div class="btn-group-vertical btn-group-sm" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-light text-info"   data-action="showElementProperties" data-elementid="` + this.properties.elementid + `"><i class="fas fa-cog"></i></button>
                        <button type="button" class="btn btn-light text-danger"   data-action="deleteelement" data-elementid="` + this.properties.elementid + `"><i class="fa fa-trash"></i></button>
                    </div>
                </div>`;

    $return += `<div class="ELEMENT_CONTENT alert ` + this.properties.csscolor + ` m-0 mb-1 " role="alert">` + this.properties.alerttext + `</div>`;

    $return += `</div>`;

    return $return;

};
ELEMENT_ALERT.prototype.propertiesForm = function () {

    var $return = `<form style="">`;

    $return += htmlInput('activeElementID', this.properties.elementid, '', 'hidden');
    $return += htmlInput('activeElementType', 'ELEMENT_ALERT', '', 'hidden');

    $return += `<div class="form-group"><label for="csscolor">Alert Type</label>
        ` + htmlSelect('csscolor', {
        'alert-primary': 'alert-primary',
        'alert-secondary': 'alert-secondary',
        'alert-success': 'alert-success',
        'alert-danger': 'alert-danger',
        'alert-warning': 'alert-warning',
        'alert-info': 'alert-info',
        'alert-light': 'alert-light',
        'alert-dark': 'alert-dark',

    }, this.properties.csscolor, 'class="form-control element_properties"  id="alerttext" ') + `
  </div>`;

    $return += `<div class="form-group"><label for="csscolor">Alert Text</label>
        ` + htmlInput('alerttext', this.properties.alerttext, 'class="form-control element_properties"  id="alerttext" ') + `
  </div>`;

    $return += `</form>`;


    return $return;
};
ELEMENT_ALERT.prototype.changePropertiesData = function (data) {

    for (key in data) {

        if (typeof this.properties[key] != 'undefined') {
            this.properties[key] = data[key];
        }

    }

    return this;

};
ELEMENT_ALERT.prototype.changeProperties = function (key, value) {
    this.properties[key] = value;

    return this;
};
ELEMENT_ALERT.prototype.setElement = function (elementid) {
    this.properties['elementid'] = elementid;
    this.changePropertiesData($('.ELEMENT[data-elementid="' + elementid + '"]').data());
    return this;
};
ELEMENT_ALERT.prototype.onDroped = function (ui) {

    $('body').find('.ACTIVE_ELEMENT').removeClass('ACTIVE_ELEMENT');

    var $item = $(ui.item[0]);
    $item[0].outerHTML = this.htmlView();

    console.log($item);


//    
//    console.log($item[0].outerHTML, 'outt');
//    var viewItem = $(ui.item[0]);
//    var JSOBJECT = returnElementObject(viewItem.data('type'));
//    console.log(JSOBJECT, 'JSOBJECTJSOBJECT');
//    console.log(JSOBJECT.htmlView(), 'JSOBJECT.htmlView()');
//
//    viewItem.removeClass();
//
////    viewItem.removeClass().addClass(JSOBJECT.properties.defaultclass);
//    viewItem.addClass('ACTIVE_ELEMENT');
//
////    for (key in JSOBJECT.properties) {
////        viewItem.attr('data-' + key, JSOBJECT.properties[key]);
////    }
//
//    viewItem.html(JSOBJECT.htmlView());

};
ELEMENT_ALERT.prototype.serialize = function ($element) {
    this.properties = _getHtmlData($element);
    return this;
}

var ELEMENT_DIVIDER = function () {

    //Default Properties
    this.properties = {
        type: 'ELEMENT_DIVIDER',
        elementname: 'DIVIDER',
        elementid: randomID()
    };
};
ELEMENT_DIVIDER.prototype.htmlView = function () {

    var $return = `
    
    <div class="ELEMENT" ` + array2HtmlData(this.properties) + `>`;

    $return += `<div class="ELEMENT_CONFIG">
                <div class="btn-group-vertical btn-group-sm" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-light text-danger"   data-action="deleteelement" data-elementid="` + this.properties.elementid + `"><i class="fa fa-trash"></i></button>
                </div>
            </div>`;

    $return += `<div class="ELEMENT_CONTENT"><div class="p-1"><hr/></div></div>`;

    $return += `</div>`;

    return $return;

};
ELEMENT_DIVIDER.prototype.propertiesForm = function () {

//    var $return = `<form style="min-width: 600px;">`;
//
//    $return += htmlInput('activeElementID', this.properties.elementid, '', 'hidden');
//    $return += htmlInput('activeElementType', 'ELEMENT_ALERT', '', 'hidden');
//
//    $return += `<div class="form-group"><label for="csscolor">Alert Type</label>
//        ` + htmlSelect('csscolor', {
//        'alert-primary': 'alert-primary',
//        'alert-secondary': 'alert-secondary',
//        'alert-success': 'alert-success',
//        'alert-danger': 'alert-danger',
//        'alert-warning': 'alert-warning',
//        'alert-info': 'alert-info',
//        'alert-light': 'alert-light',
//        'alert-dark': 'alert-dark',
//
//    }, this.properties.csscolor, 'class="form-control element_properties"  id="alerttext" ') + `
//  </div>`;
//
//    $return += `<div class="form-group"><label for="csscolor">Alert Text</label>
//        ` + htmlInput('alerttext', this.properties.alerttext, 'class="form-control element_properties"  id="alerttext" ') + `
//  </div>`;
//
//    $return += `</form>`;


    return '';
};
ELEMENT_DIVIDER.prototype.changePropertiesData = function (data) {
    for (key in data) {
        if (typeof this.properties[key] != 'undefined') {
            this.properties[key] = data[key];
        }
    }
    return this;
};
ELEMENT_DIVIDER.prototype.changeProperties = function (key, value) {
    this.properties[key] = value;

    return this;
};
ELEMENT_DIVIDER.prototype.setElement = function (elementid) {
    this.properties['elementid'] = elementid;
    this.changePropertiesData($('.ELEMENT[data-elementid="' + elementid + '"]').data());
    return this;
};
ELEMENT_DIVIDER.prototype.onDroped = function (ui) {

    $('body').find('.ACTIVE_ELEMENT').removeClass('ACTIVE_ELEMENT');

    var $item = $(ui.item[0]);
    $item[0].outerHTML = this.htmlView();

//    console.log($item);
//    
//
//    var viewItem = $(ui.item[0]);
//    var JSOBJECT = returnElementObject(viewItem.data('type'));
//
//    console.log(JSOBJECT, 'JSOBJECTJSOBJECT');
//    console.log(JSOBJECT.htmlView(), 'JSOBJECT.htmlView()');
//
//    viewItem.removeClass();
//
////    viewItem.removeClass().addClass(JSOBJECT.properties.defaultclass);
//    viewItem.addClass('ACTIVE_ELEMENT');
//
////    for (key in JSOBJECT.properties) {
////        viewItem.attr('data-' + key, JSOBJECT.properties[key]);
////    }
//
//    viewItem.html(JSOBJECT.htmlView());

};
ELEMENT_DIVIDER.prototype.serialize = function ($element) {
    this.properties = _getHtmlData($element);
    return this;
}

var ELEMENT_CARD = function () {

    //Default Properties
    this.properties = {
        type: 'ELEMENT_CARD',
        elementname: 'Card',
        elementid: randomID(),
        card_color: 'secondary',
        text_color: 'secondary',
        title: 'CARD',
    };
};
ELEMENT_CARD.prototype.htmlView = function () {

    var $return = `
    
    <div class="ELEMENT" ` + array2HtmlData(this.properties) + `>`;

    $return += `<div class="ELEMENT_CONFIG">
            <div class="btn-group-vertical btn-group-sm" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-light text-info"   data-action="showElementProperties" data-elementid="` + this.properties.elementid + `"><i class="fas fa-cog"></i></button>
                <button type="button" class="btn btn-light text-danger"   data-action="deleteelement" data-elementid="` + this.properties.elementid + `"><i class="fa fa-trash"></i></button>
            </div>
        </div>`;

    $return += `
    <div class="ELEMENT_CONTENT">  
    <div class="card text-` + this.properties.text_color + ` bg-` + this.properties.card_color + ` o-hidden h-100" data-viewplace="ondashboard" 
        data-action="readStatistic" data-type="number" 
data-ajaxurl="https://project1.crud4.com/adminpanel/en/crud4/readStatistic/crud4/Total-CRUD" 
data-card_slug="Total-CRUD" data-alliesname="COUNT_crud_id">
                <div class="card-header p-2"><i class="fas fa-chart-pie"></i> ` + this.properties.title + `</div>
                <div class="card-body p-1 align-items-center d-flex justify-content-center">
                    <div class="" data-cardvalue="Total-CRUD" id="Total-CRUD"><span style="font-size:2.4vw;">00</span></div>
                </div>
                    
            </div>
    </div>`;

    $return += `</div>`;

    return $return;

};
ELEMENT_CARD.prototype.propertiesForm = function () {

    var $return = `<form style="min-width: 600px;">`;

    $return += htmlInput('activeElementID', this.properties.elementid, '', 'hidden');
    $return += htmlInput('activeElementType', 'ELEMENT_CARD', '', 'hidden');

    $return += `<div class="form-group"><label for="csscolor">card_color</label>
        ` + htmlSelect('card_color', {
        'primary': 'bg-primary',
        'secondary': 'bg-secondary',
        'success': 'bg-success',
        'danger': 'bg-danger',
        'warning': 'bg-warning',
        'info': 'bg-info',
        'light': 'bg-light',
        'dark': 'bg-dark',

    }, this.properties.card_color, 'class="form-control element_properties"  id="card_color" ') + `
  </div>`;

    $return += `<div class="form-group"><label for="csscolor">card_color</label>
        ` + htmlSelect('text_color', {
        'primary': 'text-primary',
        'secondary': 'text-secondary',
        'success': 'text-success',
        'danger': 'text-danger',
        'warning': 'text-warning',
        'info': 'text-info',
        'light': 'text-light',
        'dark': 'text-dark',

    }, this.properties.text_color, 'class="form-control element_properties"  id="text_color" ') + `
  </div>`;

    $return += `<div class="form-group"><label for="csscolor">Alert Text</label>
        ` + htmlInput('alerttext', this.properties.alerttext, 'class="form-control element_properties"  id="text_color" ') + `
  </div>`;

    $return += `</form>`;


    return $return;
};
ELEMENT_CARD.prototype.changePropertiesData = function (data) {
    for (key in data) {
        if (typeof this.properties[key] != 'undefined') {
            this.properties[key] = data[key];
        }
    }
    return this;
};
ELEMENT_CARD.prototype.changeProperties = function (key, value) {
    this.properties[key] = value;

    return this;
};
ELEMENT_CARD.prototype.setElement = function (elementid) {
    this.properties['elementid'] = elementid;
    this.changePropertiesData($('.ELEMENT[data-elementid="' + elementid + '"]').data());
    return this;
};
ELEMENT_CARD.prototype.onDroped = function (ui) {


    $('body').find('.ACTIVE_ELEMENT').removeClass('ACTIVE_ELEMENT');

    var $item = $(ui.item[0]);
    this.changePropertiesData($item.data());

    $item[0].outerHTML = this.htmlView();


//    $('body').find('.ACTIVE_ELEMENT').removeClass('ACTIVE_ELEMENT');
//
//    var viewItem = $(ui.item[0]);
//    viewItem.removeClass();
//    viewItem.addClass('ACTIVE_ELEMENT');
//    viewItem.addClass(this.properties.defaultclass);
//    this.changePropertiesData(viewItem.data());
//
//    viewItem.html(this.htmlView());

};
ELEMENT_CARD.prototype.serialize = function ($element) {
    this.properties = _getHtmlData($element);
    return this;
}

var ELEMENT_TAB = function () {

    //Default Properties
    this.properties = {
        elementid: randomID(),
        type: 'ELEMENT_TAB',
        tabtype: 'NAV_TAB',
        defaultclass: 'CONTAINER_TAB'
    };

    this.tabs = []; //multi row 
};
ELEMENT_TAB.prototype.htmlView = function () {

    var $return = $(`<div class="ELEMENT"  
        data-elementid="` + this.properties.elementid + `"  
        data-type="` + this.properties.type + `"  
        data-tabtype="` + this.properties.tabtype + `">
 
    <div class="ELEMENT_CONFIG mt-0 mb-0">
        <div class="btn-group-vertical btn-group-sm" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-light text-info" data-action="showElementProperties" data-elementid="` + this.properties.elementid + `"><i class="fas fa-cog"></i></button>
            <button type="button" class="btn btn-light text-warning" title="Ad TAB" data-action="addTab" data-elementid="` + this.properties.elementid + `"><i class="fas fa-divide"></i></button>
            <button type="button" class="btn btn-light text-success" title="Ad row" data-action="addTab" data-elementid="` + this.properties.elementid + `"><i class="fas fa-plus"></i></button>
            <button type="button" class="btn btn-light text-danger" title="Delete" data-action="deleteelement" data-elementid="` + this.properties.elementid + `"><i class="fa fa-trash"></i></button>
        </div>
    </div>
    <div class="ELEMENT_CONTENT mb-0">
        <ul class="nav nav-tabs" id="tablist-` + this.properties.elementid + `" role="tablist" data-elementid="` + this.properties.elementid + `">

        </ul>
        <div class="tab-content p-3" id="tabcontent-` + this.properties.elementid + `" data-elementid="` + this.properties.elementid + `">

        </div>
    </div>
</div>`);

    if (!isEmpty(this.tabs)) {

        // NAV TABS
        for (n in this.tabs) {

            var $TAB = this.tabs[n];

            console.log($TAB, '$TAB');

            var active = '';
            if (n === '0') {
                active = 'active';
            }

            var tabid = $TAB['properties']['tabid'];
            var tabname = $TAB['properties']['tabname'];

            $return.find('#tablist-' + this.properties.elementid).append(`
<li class="nav-item" role="presentation">
        <a class="nav-link ` + active + `" id="tab-a-item-` + tabid + `" data-toggle="tab" href="#tabitem-` + tabid + `" role="tab" aria-controls="contact" aria-selected="false">` + tabname + `</a>
      </li>`);


        }

        //TAB CONTENT
        for (m in this.tabs) {

            var $TAB = this.tabs[m];

            var active = '';
            if (m === '0') {
                active = 'show active';
            }
            var tabid = $TAB['properties']['tabid'];
            var tabname = $TAB['properties']['tabname'];

            var $tabrows = '';

            for (var row_id in $TAB['ROWS']) {
                $tabrows += $TAB['ROWS'][row_id].htmlView();
            }

            console.log($tabrows, '$tabrows');

            $return.find('#tabcontent-' + this.properties.elementid).append(`<div data-type="MAIN_CONTAINER" data-tabtitle="` + tabname + `" 
                class="MAIN_CONTAINER tab-pane fade ` + active + `" id="tabitem-` + tabid + `" 
                role="tabpanel" aria-labelledby="tab-a-item-` + tabid + `">`
                    + $tabrows + '</div>');
        }
    }
    return $return[0].outerHTML;
};
ELEMENT_TAB.prototype.propertiesForm = function () {

    var $return = `<form style="">`;

    $return += htmlInput('activeElementID', this.properties.elementid, '', 'hidden');
    $return += htmlInput('activeElementType', this.properties.type, '', 'hidden');

    $return += `<div class="form-group"><label for="class">rowname</label>
        ` + htmlSelect('tabtype',
            {NAV_TAB: 'NAV_TAB', NAV_PILL: 'NAV_PILL', 'NAV_VERTICAL': 'NAV_VERTICAL'},
            this.properties.tabtype,
            'class="form-control element_properties" data-elementid="' + this.properties.elementid + '"') + `</div>`;
    $return += `</form>`;

    return $return;
};
ELEMENT_TAB.prototype.changePropertiesData = function (data) {
    for (key in data) {
        if (typeof this.properties[key] != 'undefined') {
            this.properties[key] = data[key];
        }
    }
    return this;

};
ELEMENT_TAB.prototype.changeProperties = function (key, value) {
    this.properties[key] = value;
    return this;
};
ELEMENT_TAB.prototype.setElement = function (id) {
    this.properties['elementid'] = id;
    this.changePropertiesData($('.ELEMENT[data-elementid="' + id + '"]').data());
    return this;
};
ELEMENT_TAB.prototype.addTab = function (TAB) {
    this.tabs.push(TAB);
    return this;
};
ELEMENT_TAB.prototype.onDroped = function (ui) {

    $('body').find('.ACTIVE_ELEMENT').removeClass('ACTIVE_ELEMENT');

    var $item = $(ui.item[0]);
    this.changePropertiesData($item.data());


    var row = new CONTAINER_ROW().changeProperties('rowname', 'tab1 row1');
    row.addColumn(new COLUMN());

    var row2 = new CONTAINER_ROW().changeProperties('rowname', 'tab1 row2');
    row2.addColumn(new COLUMN());
    row2.addColumn(new COLUMN());


    var $tab = {};
    $tab['properties'] = {type: 'MAIN_CONTAINER', 'tabname': 'TAB 1', 'tabid': randomID()};
    $tab['ROWS'] = {};
    $tab['ROWS'][0] = row;
    $tab['ROWS'][1] = row2;
    this.addTab($tab);

    var tab2row1 = new CONTAINER_ROW().changeProperties('rowname', 'tab2 row1');
    tab2row1.addColumn(new COLUMN());

    var $tab = {};
    $tab['properties'] = {type: 'MAIN_CONTAINER', tabname: 'TAB 2', tabid: randomID()};
    $tab['ROWS'] = {};
    $tab['ROWS'][0] = tab2row1;
    this.addTab($tab);

    $item[0].outerHTML = this.htmlView();

    initSortable();

};
ELEMENT_TAB.prototype.serialize = function ($element) {
    this.properties = _getHtmlData($element);

    var out = {};

    $element.find('.ELEMENT_CONTENT').find('.tab-content').children('.MAIN_CONTAINER').each(function (index4, value4) {

        var MAIN_CONTAINER = $(this); //.tab-pane
        out['tab_' + index4] = s_MAIN_CONTAINER(MAIN_CONTAINER);
    });

    this.tabs.push(out);

    return this;
}



function showPropertiesArea(htmltext, title) {

    var $container = $('#general_modal');
    $container.removeClass('centermodal').removeClass('leftmodal').removeClass('rightmodal').addClass('rightmodal');
    $container.find('.modal-content').html(
            `<div class="modal-header" style="min-width: 400px;">
    <h5 class="modal-title" id=""><i class="fas fa-newspaper"></i> ` + title + `</h5>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">×</span>
    </button>
</div><div class="modal-body">` + htmltext + `</div><div class="modal-footer"></div>`

            );
    $container.modal({
        show: true,
    });
}

function returnElementObject(name) {

    return new window[name];

//    if (name === 'ELEMENT_ALERT') {
//        return new ELEMENT_ALERT();
//    } else if (name === 'ELEMENT_DIVIDER') {
//        return new ELEMENT_DIVIDER();
//    } else if (name === 'ELEMENT_TAB') {
//        return new ELEMENT_TAB();
//    }
//    else if (name === 'ELEMENT_TAB') {
//        return new ELEMENT_TAB();
//    }
}

/**
 *  Col icine Tasindiginde Calisir.
 *  initSortable icinden cagrilir.
 * @param {type} ui
 * @return {undefined}
 */
function showElement(ui) {

    $('body').find('.ACTIVE_ELEMENT').removeClass('ACTIVE_ELEMENT');

    var viewItem = $(ui.item[0]);
    var JSOBJECT = returnElementObject(viewItem.data('type'));

    console.log(JSOBJECT, 'JSOBJECTJSOBJECT');
    console.log(JSOBJECT.htmlView(), 'JSOBJECT.htmlView()');

    viewItem.removeClass();

//    viewItem.removeClass().addClass(JSOBJECT.properties.defaultclass);
    viewItem.addClass('ACTIVE_ELEMENT');

//    for (key in JSOBJECT.properties) {
//        viewItem.attr('data-' + key, JSOBJECT.properties[key]);
//    }

    viewItem.html(JSOBJECT.htmlView());

}

function initSortable() {

    $(".MAIN_CONTAINER").sortable({
        placeholder: "DESIGNER_PLACEHOLDER",
        receive: function (event, ui) {

            serialize();

//            console.log('.....MAIN_CONTAINER receive.......');
        }
    });

    $(".CONTAINER_ROW").sortable({
        connectWith: ".CONTAINER_ROW",
        placeholder: "DESIGNER_PLACEHOLDER",
        receive: function (event, ui) {
            serialize();

//            console.log('.....CONTAINER_ROW receive.......');
        }
    });


    var clone;
    var before;
    var parent;

    $(".DESIGNER_OBJECT, .CONTAINER_COL").sortable({
        connectWith: ".CONTAINER_COL",
        placeholder: "DESIGNER_PLACEHOLDER",
        helper: "clone",
        start: function (event, ui) {

//            console.log('......DESIGNER_OBJECT, .CONTAINER_COL started.......');

            $(ui.item).show();
            clone = $(ui.item).clone();
            before = $(ui.item).prev();
            parent = $(ui.item).parent();

        },
        receive: function (event, ui) {

            console.log('......DESIGNER_OBJECT, .CONTAINER_COL received........');

            var viewItem = $(ui.item[0]);
            var JSOBJECT = returnElementObject(viewItem.data('type'));
            JSOBJECT.onDroped(ui);

//            showElement(ui);

            if (parent.hasClass('DESIGNER_OBJECT') > 0) {
                /**
                 * DESIGNER_OBJECT den tasındıysa...
                 */
                if (before.length) {
                    before.after(clone);
                } else {
                    parent.prepend(clone);
                }
            }

            serialize();
        },

        stop: function (event, ui) {

//            console.log('.......DESIGNER_OBJECT, .CONTAINER_COL stoped.......');
        },
        change: function (event, ui) {

//            console.log('.......DESIGNER_OBJECT, .CONTAINER_COL changed.......');
            
            
//            console.log(ui, 'ui chec');
        },

        remove: function (event, ui) {

//            console.log('.........DESIGNER_OBJECT, .CONTAINER_COL removed.......');

            //$(this).sortable('cancel');
        },

        over: function (event, ui) {

//            console.log('.........DESIGNER_OBJECT, .CONTAINER_COL over.......');

            //$(this).sortable('cancel');
        },

        activate: function (e, ui) {
//            console.log('.........DESIGNER_OBJECT, .CONTAINER_COL activate.......');
        },

        sort: function (e, ui) {
//            console.log('.........DESIGNER_OBJECT, .CONTAINER_COL sort.......');
        },
        out: function (e, ui) {
//            console.log('.........DESIGNER_OBJECT, .CONTAINER_COL out.......');
        },
        beforeStop: function (e, ui) {
//            console.log('.........DESIGNER_OBJECT, .CONTAINER_COL beforeStop.......');
        },

        deactivate: function (e, ui) {
//            console.log('.........DESIGNER_OBJECT, .CONTAINER_COL deactivate.......');
        },

    });

    console.log('....INITED......');
    
    serialize();

}

function addRow($columntemp, $targetElement) {

    var containerRow = new CONTAINER_ROW();

    if ($columntemp === '1+1') {
        containerRow.addColumn(new COLUMN());
        containerRow.addColumn(new COLUMN());

    } else if ($columntemp === '1+2') {

        containerRow.addColumn(new COLUMN().changeProperties('columnclass', 'col-sm-4'));
        containerRow.addColumn(new COLUMN().changeProperties('columnclass', 'col-sm-8'));

    } else if ($columntemp === '2+1') {

        containerRow.addColumn(new COLUMN().changeProperties('columnclass', 'col-sm-8'));
        containerRow.addColumn(new COLUMN().changeProperties('columnclass', 'col-sm-4'));

    } else {
        containerRow.addColumn(new COLUMN());
    }

    $('body').find('.ACTIVE_ROW').removeClass('ACTIVE_ROW');
    $('body').find('.ACTIVE_COLUMN').removeClass('ACTIVE_COLUMN');


    var $row = containerRow.htmlView();

    //$row.find('.CONTAINER_COL').addClass('ACTIVE_COLUMN');

    if (isEmpty($targetElement)) {
        $targetElement = $('.MAIN_CONTAINER').first();
    }

    $targetElement.append($row);

    initSortable();
}

function s_MAIN_CONTAINER($element) {

    //MAIN CONTANIR = $element
    var out = {};
    out['properties'] = _getHtmlData($element);

    $element.children('.CONTAINER_ROW').each(function (index, value) {

        var $CONTAINER_ROW = $(this);

        if (typeof out['ROWS'] === 'undefined')
        {
            out['ROWS'] = {};
        }

        //out['ROWS']['row_' + index] = s_CONTAINER_ROW($CONTAINER_ROW);
        out['ROWS']['row_' + index] = new CONTAINER_ROW().serialize($CONTAINER_ROW);

    });
    return out;
}


function serialize() {

    var out = s_MAIN_CONTAINER($('.MAIN_CONTAINER').first());

    $('#serializearea').val(JSON.stringify(out, null, 4));
}





document.addEventListener('DOMContentLoaded', function () {

    addRow();
//    initSortable();

    // -------------------------------------------------------------------------
    //  ROW 
    // -------------------------------------------------------------------------

    $(document).on('click', '[data-action="addRow"]', function () {

        $columntemp = $(this).data('columntemp');
        addRow($columntemp);
    });
    $(document).on('click', '[data-action="deleteRow"]', function () {
        var rowid = $(this).data('rowid');
        $('.CONTAINER_ROW[data-rowid="' + rowid + '"]').remove();
        if ($('.CONTAINER_ROW').length === 0) {

            addRow();
        }
    });
    $(document).on('click', '.CONTAINER_ROW', function (e) {

        $('body').find('.ACTIVE_ROW').removeClass('ACTIVE_ROW');
        $(this).addClass('ACTIVE_ROW');

        if ($(this).find('.ACTIVE_ELEMENT').length === 0) {

            $('body').find('.ACTIVE_ELEMENT').removeClass('ACTIVE_ELEMENT');
        }

    });
    $(document).on('click', '[data-action="showRowProperties"]', function () {

        var rowid = $(this).data('rowid');
        var propertiesData = $('.CONTAINER_ROW[data-rowid="' + rowid + '"]').data();
        var JSOBJECT = new CONTAINER_ROW();

        showPropertiesArea(
                JSOBJECT.changePropertiesData(propertiesData).propertiesForm(),
                JSOBJECT.properties.rowname);

    });
    $(document).on('change', '.row_properties', function () {

        var rowid = $('[name="activeROWID"]').val();

        var propertiesName = $(this).attr('name');
        var propertiesValue = $(this).val();

        var JSOBJECT = new CONTAINER_ROW();
        JSOBJECT.changeProperties(propertiesName, propertiesValue)
                .changeProperties('rowid', rowid);

        $('.CONTAINER_ROW[data-rowid="' + rowid + '"]').attr('data-' + propertiesName, escapeHtml(propertiesValue));
        $('.CONTAINER_ROW[data-rowid="' + rowid + '"]').data(propertiesName, escapeHtml(propertiesValue));

        //$('.CONTAINER_COL[data-columnid="' + columnid + '"]').html(JSOBJECT.htmlView());

    });

    // -------------------------------------------------------------------------
    //COLUMN
    // -------------------------------------------------------------------------

    $(document).on('click', '[data-action="addColumn"]', function () {
        var rowid = $(this).data('rowid');
        var cl = new COLUMN();
        cl.changeProperties('columnclass', $(this).data('columnclass'));
        $('.CONTAINER_ROW[data-rowid="' + rowid + '"]').append(cl.htmlView());
        initSortable();

    });
    $(document).on('click', '[data-action="showColumnProperties"]', function () {

        var columnid = $(this).data('columnid');
        var propertiesData = $('.CONTAINER_COL[data-columnid="' + columnid + '"]').data();

        var JSOBJECT = new COLUMN();


        showPropertiesArea(
                JSOBJECT.changePropertiesData(propertiesData).propertiesForm(),
                JSOBJECT.properties.columnname);

    });
    $(document).on('change', '.column_properties', function () {

        var columnid = $('[name="activeColumnID"]').val();

        var propertiesName = $(this).attr('name');
        var propertiesValue = $(this).val();

        var JSOBJECT = new COLUMN();
        JSOBJECT.changeProperties(propertiesName, propertiesValue)
                .changeProperties('columnid', columnid);

        $('.CONTAINER_COL[data-columnid="' + columnid + '"]').attr('data-' + propertiesName, escapeHtml(propertiesValue));
        $('.CONTAINER_COL[data-columnid="' + columnid + '"]').data(propertiesName, escapeHtml(propertiesValue));


        if (propertiesName === 'columnclass') {

            $('.CONTAINER_COL[data-columnid="' + columnid + '"]')
                    .removeClass()
                    .addClass(JSOBJECT.properties.defaultclass)
                    .addClass('ACTIVE_COLUMN')
                    .addClass(propertiesValue);
        }


        //$('.CONTAINER_COL[data-columnid="' + columnid + '"]').html(JSOBJECT.htmlView());

    });
    $(document).on('click', '[data-action="deletecolumn"]', function () {

        var $column = $(this).closest('.CONTAINER_COL');
        var $row = $column.closest('.CONTAINER_ROW');

        $column.remove();

        if ($row.find('.CONTAINER_COL').length === 0) {
            // Add new Column if last one deleted.
            $row.append(new COLUMN().htmlView());
        }


    });
    $(document).on('click', '.CONTAINER_COL', function (e) {

        if ($(this).find('.ACTIVE_ELEMENT').length === 0) {

            $('body').find('.ACTIVE_ELEMENT').removeClass('ACTIVE_ELEMENT');
        }

        $('body').find('.ACTIVE_COLUMN').removeClass('ACTIVE_COLUMN');

        $(this).addClass('ACTIVE_COLUMN');

    });

    // -------------------------------------------------------------------------
    // ELEMENT
    // -------------------------------------------------------------------------
    $(document).on('click', '.ELEMENT', function (e) {
//        e.stopPropagation();
        $('body').find('.ACTIVE_ELEMENT').removeClass('ACTIVE_ELEMENT');
        $(this).addClass('ACTIVE_ELEMENT');

    });
    $(document).on('click', '[data-action="showElementProperties"]', function () {

        var elementid = $(this).data('elementid');
        var propertiesData = $('.ELEMENT[data-elementid="' + elementid + '"]').data();

        console.log(propertiesData, 'SSSS');

        var JSOBJECT = returnElementObject(propertiesData.type);
        showPropertiesArea(
                JSOBJECT.changePropertiesData(propertiesData).propertiesForm(),
                JSOBJECT.properties.elementname);

    });
    $(document).on('change', '.element_properties', function () {

        var JSOBJECT = returnElementObject($('[name="activeElementType"]').val());

        var elementid = $('[name="activeElementID"]').val();
        var propertiesName = $(this).attr('name');
        var propertiesValue = $(this).val();

        JSOBJECT.changeProperties(propertiesName, propertiesValue)
                .changeProperties('elementid', elementid);

        $('.ELEMENT[data-elementid="' + elementid + '"]').attr('data-' + propertiesName, escapeHtml(propertiesValue));
        $('.ELEMENT[data-elementid="' + elementid + '"]').data(propertiesName, escapeHtml(propertiesValue));
        $('.ELEMENT[data-elementid="' + elementid + '"]').html(JSOBJECT.htmlView());

    });
    $(document).on('click', '[data-action="deleteelement"]', function () {

        var elementid = $(this).data('elementid');
        $('.ELEMENT[data-elementid="' + elementid + '"]').remove();

    });


    $(document).on('click', '#serialize', function () {


    });

    $(document).on('click', '#sElement', function () {

        serialize();


    });

});

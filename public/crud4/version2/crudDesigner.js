var $json_path = 'json_tabledesign';
var $relationTables = [];
var $tableFields = [];

function arraytodatastring(array) {

    var $n = '';

    for (key in array) {
        
        $n += ' data-' + key + '="' + array[key]+ '" '; 
    }
    
    return  $n;
}

function returnPortlet(porletData) {

    var field_name = porletData['field_name'];
    var field_type = porletData['field_type'];
    var table_name = porletData['table_name'];
    var label = porletData['label'];
    var functionName = porletData['function'];
    var relationTable = porletData['relationTable'];
    var allies_name = porletData['allies_name'];

    var showDelete = false;
    var colorClass = '';
    var porletName = field_name;

    var porletNo = randomID();
    var id = 'portlet_' + porletNo;


    if ($json_path === 'json_tabledesign' || $json_path === 'json_subtabledesign') {

        if (typeof porletData['fixedColumnWidth'] === 'undefined') {

            porletData['fixedColumnWidth'] = '0';
        }

    }

    if (field_type === 'dbField')
    {
        if (typeof functionName !== 'undefined') {
            delete porletData['function'];
        }
        if (typeof label !== 'undefined') {
            delete porletData['label'];
        }
        if (typeof allies_name !== 'undefined') {
            delete porletData['allies_name'];
        }

        if ($json_path === 'json_formdesign') {
            if (typeof porletData['labelSize'] === 'undefined') {

                porletData['labelSize'] = '4';
            }
            if (typeof porletData['labelAlignment'] === 'undefined') {

                porletData['labelAlignment'] = 'top';
            }
        }
    } else if (field_type === 'lastRecordRelation' || field_type === 'leftJoinField')
    {

        if (typeof $relationTables[table_name] === 'undefined') {
            return '';
        }

        var tableFields = {};
        $.each($relationTables[table_name]['fieldData'], function (key, vl) {
            tableFields[key] = key;
        });

        if (typeof field_name === 'undefined' || isEmpty(field_name)) {

            field_name = Object.keys(tableFields)[0]; //firstkey
            porletData['field_name'] = field_name;
        }

        porletName = functionName + ' ' + field_name;

        if (typeof label === 'undefined' || isEmpty(label)) {

            porletData['label'] = porletName;
        }

        showDelete = true;
        colorClass = ' bg-success text-white';

        if (field_type === 'leftJoinField') {
            colorClass = ' bg-danger text-white';
        }

    } else if (field_type === 'virtualTableField')
    {
        if (typeof field_name === 'undefined' || isEmpty(field_name)) {
            field_name = Object.keys($tableFields)[0]; //firstkey
            porletData['field_name'] = field_name;
        }

        porletName = field_name + ' Virtual Area';

        if (typeof label === 'undefined' || isEmpty(label)) {

            porletData['label'] = porletName;
        }
        showDelete = true;
        colorClass = ' bg-danger text-white';
    }

    var $return = `
        
            <div class="portlet pr-2" id="` + id + `" ` + arraytodatastring(porletData) +`>
   
                <div class="portlet-header text-left p-1 _callbackPortletHeader ` + colorClass + `">
                    <span class="ui-icon ui-icon-plusthick portlet-toggle"></span>
                    <span id="porletName_` + porletNo + `">` + porletName + `</span>
                </div>
                <div class="portlet-content" style="display: none;">
            `;

    $return += ``;

    //Create Content
    for (var key in porletData) {

        var value = porletData[key];

        var $readOnly = ' readonly';

        if (key === 'label')
        {
            $readOnly = '';
        }

        if (key === 'field_name' && (field_type === 'leftJoinField' || field_type === 'lastRecordRelation')) {

            $return += `
                <div class="input-group mb-2">
                    <div class="input-group-prepend">
                      <div class="input-group-text">field_name</div>
                    </div>`
                    + htmlSelect('field_name', tableFields, field_name, `class="form-control portletInput leftjoin_or_lastrecordfield" data-portletno="` + porletNo + `" data-functionname="` + functionName + `" `)
                    + `</div>`;
        } else if (key === 'field_name' && (field_type === 'virtualTableField')) {

            $return += `
                <div class="input-group mb-2">
                    <div class="input-group-prepend">
                      <div class="input-group-text">field_name</div>
                    </div>`
                    + htmlSelect('field_name', $tableFields, field_name, `class="form-control portletInput virtualFieldName" data-portletno="` + porletNo + `" data-functionname="` + functionName + `" `)
                    + `</div>`;
        } else if (key === 'function' || key === 'relation_id' || key === 'field_type') {

            $return += htmlInput(key, value, `class="form-control portletInput" `, 'hidden');

        } else if (key === 'labelAlignment') {

            $return += `

                 <div class="input-group mb-2">
                    <div class="input-group-prepend">
                      <div class="input-group-text">Label Alignment</div>
                    </div>
                ` + htmlSelect('labelAlignment', {'top': 'Top', 'left': 'Left'}, value, `class="form-control portletInput" `) + `                      
                </div>
            `;
        } else if (key === 'fixedColumnWidth') {

            $return += `

                 <div class="input-group mb-2">
                    <div class="input-group-prepend">
                      <div class="input-group-text" title="Fixed Datatable Column Width">Fixed Width</div>
                    </div>
                ` + htmlSelect('fixedColumnWidth', {'0': 'NO', '1': 'YES'}, value, `class="form-control portletInput" `) + `                      
                </div>
            `;
        } else if (key === 'labelSize') {

            $return += `
                
                 <div class="input-group mb-2">
                    <div class="input-group-prepend">
                      <div class="input-group-text">Label Size</div>
                    </div>`

            $return += htmlSelect('labelSize', {'1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'}, value, `class="form-control portletInput" `);


            $return += `</div>`;

        } else if (key === 'script_text') {

            $return += `
                
                 <div class="input-group mb-2">
                    <div class="input-group-prepend">
                      <div class="input-group-text">Script</div>
                    </div>`

            $return += htmlTextarea('script_text', value, ` rows="10" class="form-control portletInput" title="Use Javascript. Will be displayed in Datatable.net data: function ( row, type, set, meta ) { };"`);


            $return += `</div>`;

        } else {

            $return += `
                
                <div class="input-group mb-2">
                    <div class="input-group-prepend">
                      <div class="input-group-text">` + key + `</div>
                    </div>
                ` + htmlInput(key, porletData[key], `class="form-control portletInput" id="` + key + '_' + porletNo + `" ` + $readOnly) + `                      
                </div>
            `;
        }

    }

    if (showDelete) {

        $return += `
                    <div class="input-group mb-2">
                        <button type="button" class="btn btn-sm btn-danger _callbackRemovePortlet" data-portletid="` + id + `"> <i class="fas fa-trash"></i> Remove</button>
                    </div>
            `;
    }



    $return += `
                </div>            
            </div>`;

    return $return;

}

function page() {
    return  `<ul class="page m-0 pb-4 shadow bg-white rounded"></ul>`;
}
//-------------------------------------------------------------------------//
function dividerArea(groupData) {

    var groupID = randomID();
    
    console.log(groupData, 'groupData');
    
    var dividerData = {'groupType':'DIVIDER_AREA'};
    
    var $return = ` 
                        <li class="mt-2 p-2 shadow bg-white rounded groupContainer _callbackGroup" `  +  arraytodatastring(groupData['groupConfig']) +` >
        
                            <div class="groupWizard">
                                <a href="#" class="btn btn-sm text-danger p-0 m-0 _callbackDeleteGroup" style="display: block"><i class="fa fa-trash"></i></a>
                                <a href="#" class="btn btn-sm text-info p-0 m-0 _callbackAddSubContainerGroup" style="display: block"><i class="fa fa-plus"></i></a>
                            </div>
        
                            <div class="groupHeader row m-1 mr-3 _callbackGroupHeader">
                                <div class="col-sm-12 labelField"><hr/></div>
                            </div>
                            
                            <div class="groupCollapsable" style="display: none;">
                                <div class="row groupConfig m-0 pt-1 pl-3" style="display: none;">
                                    <input type="hidden" name="groupType"  value="DIVIDER_AREA"></input> 
                                </div>
                            </div>           
                        </li>`;

    return $return;

}
//-------------------------------------------------------------------------//
function accordionArea1(groupData) {

    var subgroup = {'': ''};
    var label = '';

    if (typeof groupData !== 'undefined' && typeof groupData['groupConfig'] !== 'undefined') {

        if (typeof groupData['groupConfig']['label'] !== 'undefined') {
            label = groupData['groupConfig']['label'];
        }

        if (typeof groupData['subgroup'] !== 'undefined') {
            subgroup = groupData['subgroup'];
        }
    }

    var _label = htmlInput('label', label, 'placeholder="ACCORDION" class="labelInputField portletInput form-control"');
    var _groupType = htmlInput('groupType', 'ACCORDION_AREA', '', 'hidden');

    var $return = `<li class="mt-2 p-2 shadow bg-white rounded groupContainer _callbackGroup hassubcontainer">

                            <div class="groupWizard">
                                <a href="#" class="btn btn-sm text-danger p-0 m-0 _callbackDeleteGroup" style="display: block"><i class="fa fa-trash"></i></a>
                                <a href="#" class="btn btn-sm text-info p-0 m-0 _callbackAddSubContainerGroup" style="display: block"><i class="fa fa-plus"></i></a>
                            </div>
                                            
                            <div class="groupHeader row m-1 mr-3">
                                <div class="col-sm-4 labelField">` + _label + `</div>
                                <div class="col-sm-8 group-header _callbackGroupHeader"><span class=" ui-icon ui-icon-plusthick"></span></div>
                            </div>

                            <div class="groupCollapsable" style="display: none;">

                                <div class="row groupConfig m-0 pt-1 pl-3" style="display: none;">
                                    ` + _groupType + `
                                </div>`;
    $return += `<ul class="m-0 p-3 groupSubContainerArea">`;

    $.each(subgroup, function (k, subgroupData) {

        var subLabel = 'Sub Group';
        var content = null;


        if (typeof subgroupData['subGroupConfig'] !== 'undefined') {

            var subGroupConfig = subgroupData['subGroupConfig'];
            var subLabel = subGroupConfig['label'];
        }

        if (typeof subgroupData['content'] !== 'undefined') {
            content = subgroupData['content'];
        }

        $return += `<li class="groupSubContainer mb-2 _callbackSubContainerGroup">

                                            <div class="subwizard">
                                                <a href="#" class="btn btn-sm mb-1 text-success _callbackDeleteSubGroup" style="display: block"><i class="fa fa-trash"></i></a>
                                            </div>

                                            <div class="subGroupHeader row m-1 pr-3">

                                                <div class="col-sm-4">
                                                    <input name="label" placeHolder="Sub Group" class="subLabelInputField portletInput"  value="` + subLabel + `"></input>
                                                </div>

                                                <div class="col-sm-8 _callbackSubGroupHeader"><span class=" ui-icon ui-icon-minusthick"></span></div>
                                            </div>


                                            <ul class="subgrouparea mt-3" id="2">`;

        if (!isEmpty(content)) {
            $.each(content, function (n, subGroupData) {
                $return += _writeGroups(subGroupData);
            });
        }



        $return += `</ul>

                                        </li>`;
    });
    $return += `</ul>
                            </div>

                        </li>`;
    $return += ``;
    return $return;
}
function accordionArea(groupData) {

    var subgroup = {'': ''};
    var label = '';

    if (typeof groupData !== 'undefined' && typeof groupData['groupConfig'] !== 'undefined') {

        if (typeof groupData['groupConfig']['label'] !== 'undefined') {
            label = groupData['groupConfig']['label'];
        }

        if (typeof groupData['subgroup'] !== 'undefined') {
            subgroup = groupData['subgroup'];
        }
    }

    var _label = htmlInput('label', label, 'placeholder="ACCORDION" class="labelInputField portletInput form-control"');
    var _groupType = htmlInput('groupType', 'ACCORDION_AREA', '', 'hidden');

    var $return = `<li class="mt-2 p-2 shadow bg-white rounded groupContainer _callbackGroup hassubcontainer" ` + arraytodatastring(groupData['groupConfig']) + `>

                            <div class="groupWizard">
                                <a href="#" class="btn btn-sm text-danger p-0 m-0 _callbackDeleteGroup" style="display: block"><i class="fa fa-trash"></i></a>
                                <a href="#" class="btn btn-sm text-info p-0 m-0 _callbackAddSubContainerGroup" style="display: block"><i class="fa fa-plus"></i></a>
                            </div>
                                            
                            <div class="groupHeader row m-1 mr-3">
                                <div class="col-sm-4 labelField">` + _label + `</div>
                                <div class="col-sm-8 group-header _callbackGroupHeader"><span class=" ui-icon ui-icon-plusthick"></span></div>
                            </div>

                            <div class="groupCollapsable" style="display: none;">

                                <div class="row groupConfig m-0 pt-1 pl-3" style="display: none;">
                                    ` + _groupType + `
                                </div>`;
    $return += `<ul class="m-0 p-3 groupSubContainerArea">`;

    $.each(subgroup, function (k, subgroupData) {

        var subLabel = 'Sub Group';
        var content = null;


        if (typeof subgroupData['subGroupConfig'] !== 'undefined') {

            var subGroupConfig = subgroupData['subGroupConfig'];
            var subLabel = subGroupConfig['label'];
        }

        if (typeof subgroupData['content'] !== 'undefined') {
            content = subgroupData['content'];
        }

        $return += `<li class="groupSubContainer mb-2 _callbackSubContainerGroup">

                                            <div class="subwizard">
                                                <a href="#" class="btn btn-sm mb-1 text-success _callbackDeleteSubGroup" style="display: block"><i class="fa fa-trash"></i></a>
                                            </div>

                                            <div class="subGroupHeader row m-1 pr-3">

                                                <div class="col-sm-4">
                                                    <input name="label" placeHolder="Sub Group" class="subLabelInputField portletInput"  value="` + subLabel + `"></input>
                                                </div>

                                                <div class="col-sm-8 _callbackSubGroupHeader"><span class=" ui-icon ui-icon-minusthick"></span></div>
                                            </div>


                                            <ul class="subgrouparea mt-3" id="2">`;

        if (!isEmpty(content)) {
            $.each(content, function (n, subGroupData) {
                $return += _writeGroups(subGroupData);
            });
        }



        $return += `</ul>

                                        </li>`;
    });
    $return += `</ul>
                            </div>

                        </li>`;
    $return += ``;
    return $return;
}

function tabArea(groupData) {

    var subgroup = {'': ''};
    var label = '';

    if (typeof groupData !== 'undefined' && typeof groupData['groupConfig'] !== 'undefined') {

        if (typeof groupData['groupConfig']['label'] !== 'undefined') {
            label = groupData['groupConfig']['label'];
        }

        if (typeof groupData['subgroup'] !== 'undefined') {
            subgroup = groupData['subgroup'];
        }
    }

    var _label = htmlInput('label', label, 'placeholder="TAB" class="labelInputField portletInput form-control"');
    var _groupType = htmlInput('groupType', 'TAB_AREA', '', 'hidden');


    var $return = `<li class="mt-2 p-2 shadow bg-white rounded groupContainer _callbackGroup hassubcontainer" ` + arraytodatastring(groupData['groupConfig']) + `>

                            <div class="groupWizard">
                                <a href="#" class="btn btn-sm text-danger p-0 m-0 _callbackDeleteGroup" style="display: block"><i class="fa fa-trash"></i></a>
                                <a href="#" class="btn btn-sm text-info p-0 m-0 _callbackAddSubContainerGroup" style="display: block"><i class="fa fa-plus"></i></a>
                            </div>
                                            
                            <div class="groupHeader row m-1 mr-3">
                                <div class="col-sm-4 labelField">` + _label + `</div>
                                <div class="col-sm-8 group-header _callbackGroupHeader"><span class=" ui-icon ui-icon-plusthick"></span></div>
                            </div>

                            <div class="groupCollapsable" style="display: none;">

                                <div class="row groupConfig m-0 pt-1 pl-3" style="display: none;">
                                    ` + _groupType + `
                                </div>`;
    $return += `<ul class="m-0 p-3 groupSubContainerArea">`;

    $.each(subgroup, function (k, subgroupData) {

        var subLabel = 'Sub Group';
        var content = null;


        if (typeof subgroupData['subGroupConfig'] !== 'undefined') {

            var subGroupConfig = subgroupData['subGroupConfig'];
            var subLabel = subGroupConfig['label'];
        }

        if (typeof subgroupData['content'] !== 'undefined') {
            content = subgroupData['content'];
        }

        $return += `<li class="groupSubContainer mb-2 _callbackSubContainerGroup">

                                            <div class="subwizard">
                                                <a href="#" class="btn btn-sm mb-1 text-success _callbackDeleteSubGroup" style="display: block"><i class="fa fa-trash"></i></a>
                                            </div>

                                            <div class="subGroupHeader row m-1 pr-3">

                                                <div class="col-sm-4">
                                                    <input name="label" placeHolder="Group Label" class="subLabelInputField portletInput"  value="` + subLabel + `"></input>
                                                </div>

                                                <div class="col-sm-8 _callbackSubGroupHeader"><span class=" ui-icon ui-icon-minusthick"></span></div>
                                            </div>


                                            <ul class="subgrouparea mt-3" id="2">`;

        if (!isEmpty(content)) {
            $.each(content, function (n, subGroupData) {
                $return += _writeGroups(subGroupData);
            });
        }



        $return += `</ul>

                                        </li>`;
    });
    $return += `</ul>
                            </div>

                        </li>`;
    $return += ``;
    return $return;
}

//-------------------------------------------------------------------------//

function verticalTabArea(groupData) {

    var subgroup = {'': ''};
    var label = '';

    if (typeof groupData !== 'undefined' && typeof groupData['groupConfig'] !== 'undefined') {

        if (typeof groupData['groupConfig']['label'] !== 'undefined') {
            label = groupData['groupConfig']['label'];
        }

        if (typeof groupData['subgroup'] !== 'undefined') {
            subgroup = groupData['subgroup'];
        }
    }

    var _label = htmlInput('label', label, 'placeholder="VERTICAL TAB AREA" class="labelInputField portletInput form-control"');
    var _groupType = htmlInput('groupType', 'VERTICAL_TAB_AREA', '', 'hidden');

    var $return = `<li class="mt-2 p-2 shadow bg-white rounded groupContainer _callbackGroup hassubcontainer" ` + arraytodatastring(groupData['groupConfig']) + `>

                            <div class="groupWizard">
                                <a href="#" class="btn btn-sm text-danger p-0 m-0 _callbackDeleteGroup" style="display: block"><i class="fa fa-trash"></i></a>
                                <a href="#" class="btn btn-sm text-info p-0 m-0 _callbackAddSubContainerGroup" style="display: block"><i class="fa fa-plus"></i></a>
                            </div>
                                            
                            <div class="groupHeader row m-1 mr-3">
                                <div class="col-sm-4 labelField">` + _label + `</div>
                                <div class="col-sm-8 group-header _callbackGroupHeader"><span class=" ui-icon ui-icon-plusthick"></span></div>
                            </div>

                            <div class="groupCollapsable" style="display: none;">

                                <div class="row groupConfig m-0 pt-1 pl-3" style="display: none;">
                                    ` + _groupType + ` 
                                </div>`;
    $return += `<ul class="m-0 p-3 groupSubContainerArea">`;

    $.each(subgroup, function (k, subgroupData) {

        var subLabel = 'Sub Group';
        var content = null;


        if (typeof subgroupData['subGroupConfig'] !== 'undefined') {

            var subGroupConfig = subgroupData['subGroupConfig'];
            var subLabel = subGroupConfig['label'];
        }

        if (typeof subgroupData['content'] !== 'undefined') {
            content = subgroupData['content'];
        }

        $return += `<li class="groupSubContainer mb-2 _callbackSubContainerGroup">

                                            <div class="subwizard">
                                                <a href="#" class="btn btn-sm mb-1 text-success _callbackDeleteSubGroup" style="display: block"><i class="fa fa-trash"></i></a>
                                            </div>

                                            <div class="subGroupHeader row m-1 pr-3">

                                                <div class="col-sm-4">
                                                    <input name="label" placeHolder="Group Label" class="subLabelInputField portletInput"  value="` + subLabel + `"></input>
                                                </div>

                                                <div class="col-sm-8 _callbackSubGroupHeader"><span class=" ui-icon ui-icon-minusthick"></span></div>
                                            </div>


                                            <ul class="subgrouparea mt-3" id="2">`;

        if (!isEmpty(content)) {
            $.each(content, function (n, subGroupData) {
                $return += _writeGroups(subGroupData);
            });
        }



        $return += `</ul>

                                        </li>`;
    });
    $return += `</ul>
                            </div>

                        </li>`;
    $return += ``;
    return $return;
}
//-------------------------------------------------------------------------//
function scriptArea(groupData) {

    var scriptText = '';
    var label = '';

    if (typeof groupData !== 'undefined' && typeof groupData['groupConfig'] !== 'undefined') {

        if (typeof groupData['groupConfig']['scriptText'] !== 'undefined') {
            scriptText = groupData['groupConfig']['scriptText'];
        }

        if (typeof groupData['groupConfig']['label'] !== 'undefined') {
            label = groupData['groupConfig']['label'];
        }

    }

    var _groupType = htmlInput('groupType', 'SCRIPT_AREA', '', 'hidden');
    var _label = htmlInput('label', label, 'placeholder="SCRIPT AREA" class="labelInputField portletInput form-control"');
    var _scriptText = htmlTextarea('scriptText', scriptText, 'class="form-control portletInput" rows="3" placeholder=""');

    return `<li class="mt-2 p-2 shadow bg-white rounded groupContainer _callbackGroup" ` + arraytodatastring(groupData['groupConfig']) + `>

                            <div class="groupWizard">
                                <a href="#" class="btn btn-sm text-danger p-0 m-0 _callbackDeleteGroup" style="display: block"><i class="fa fa-trash"></i></a>
                            </div>
                                                
                            <div class="groupHeader row m-1 mr-3">
                                    <div class="col-sm-4 labelField">` + _label + `</div>
                                    <div class="col-sm-8 group-header _callbackGroupHeader"><span class=" ui-icon ui-icon-plusthick"></span></div>
                            </div>

                            <div class="groupCollapsable row" style="display: none;">
                                <div class="groupConfig col-12 m-0 pt-1 pl-4 pr-4">
                                    ` + _groupType + `

                                    <div class="form-group">
                                        <label for="scriptText">Script Text</label>` + _scriptText + `
                                    </div>
                                </div>
                            </div>
                        </li>`;
}
//-------------------------------------------------------------------------//
function alertArea(groupData) {

    var alertType = 'bg-primary';
    var alertText = '';
    var label = '';

    if (typeof groupData !== 'undefined' && typeof groupData['groupConfig'] !== 'undefined') {

        if (typeof groupData['groupConfig']['label'] !== 'undefined') {
            label = groupData['groupConfig']['label'];
        }

        if (typeof groupData['groupConfig']['alertType'] !== 'undefined') {
            alertType = groupData['groupConfig']['alertType'];
        }

        if (typeof groupData['groupConfig']['alertText'] !== 'undefined') {
            alertText = groupData['groupConfig']['alertText'];
        }
    }

    var _label = htmlInput('label', label, 'placeholder="ALERT_AREA" class="labelInputField portletInput form-control"');
    var _groupType = htmlInput('groupType', 'ALERT_AREA', '', 'hidden');
    var _alertText = htmlTextarea('alertText', alertText, 'class="form-control portletInput" rows="3" placeHolder=""');

    var types = {
        'bg-primary': 'bg-primary',
        'bg-secondary': 'bg-secondary',
        'bg-success': 'bg-success',
        'bg-danger': 'bg-danger',
        'bg-warning': 'bg-warning',
        'bg-info': 'bg-info',
        'bg-light': 'bg - light',
        'bg-dark': 'bg-dark',
        'bg-white': 'bg-white',
        'bg-transparent': 'bg-transparent'
    };

    var $selectBox = `<select name="alertType" class="form-control form-control-sm selectpicker portletInput" >`;

    $.each(types, function (key, value) {

        var selected = '';

        if (key === alertType) {
            selected = ' selected ';
        }

        $selectBox += `<option class="` + key + `" value="` + key + `" ` + selected + `>` + value + `</option>`;

    });

    $selectBox += `</select>`;


    var $return = `<li class="mt-2 p-2 shadow bg-white rounded groupContainer _callbackGroup" ` + arraytodatastring(groupData['groupConfig']) + `>

                            <div class="groupWizard">
                                <a href="#" class="btn btn-sm text-danger p-0 m-0 _callbackDeleteGroup" style="display: block"><i class="fa fa-trash"></i></a>
                            </div>
                                    
                           <div class="groupHeader row m-1 mr-3">
                                    <div class="col-sm-4 labelField">` + _label + `</div>
                                    <div class="col-sm-8 group-header _callbackGroupHeader"><span class=" ui-icon ui-icon-plusthick"></span></div>
                            </div>

                            <div class="groupCollapsable row" style="display: none;">
                                    
                                <div class="groupConfig col-12 m-0 pt-1 pl-4 pr-4">
                                    ` + _groupType + `

                                    <div class="form-group row">
                                        <div class="col-sm-4">` + $selectBox + `</div>
                                    </div>                     
                                    <div class="form-group">` + _alertText + `</div>
                                </div>
                            </div>
                        </li>`;

    $return += ``;
    return $return;
}

function INVOICE_PAYMENT_FORM(groupData) {

    var label = '';
//    var paymentMethod = 'PAYUTR';
//    var paymentMethodOptions = {'PAYUTR': 'PAYUTR', 'IYZICO': 'IYZICO'};
//
//    if (typeof groupData !== 'undefined' && typeof groupData['groupConfig'] !== 'undefined') {
//
//        if (typeof groupData['groupConfig']['label'] !== 'undefined') {
//            label = groupData['groupConfig']['label'];
//        }
//
//        if (typeof groupData['groupConfig']['paymentMethod'] !== 'undefined') {
//            paymentMethod = groupData['groupConfig']['paymentMethod'];
//        }
//
//    }

    var _groupType = htmlInput('groupType', 'INVOICE_PAYMENT_FORM', '', 'hidden');
    var _label = htmlInput('label', label, 'placeholder="INVOICE_PAYMENT_FORM" class="labelInputField portletInput form-control"');

//    var _paymentMethodField = htmlSelect('paymentMethod', paymentMethodOptions, paymentMethod, 'class="form-control form-control-sm selectpicker portletInput" ');


    var $return = `<li class="mt-2 p-2 shadow bg-white rounded groupContainer _callbackGroup">

                            <div class="groupWizard">
                                <a href="#" class="btn btn-sm text-danger p-0 m-0 _callbackDeleteGroup" style="display: block"><i class="fa fa-trash"></i></a>
                            </div>
                                    
                           <div class="groupHeader row m-1 mr-3">
                                    <div class="col-sm-4 labelField">` + _label + `</div>
                                    <div class="col-sm-8 group-header _callbackGroupHeader"><span class=" ui-icon ui-icon-plusthick"></span></div>
                            </div>

                            <div class="groupCollapsable" style="display: none;">
                                    
                                <div class="groupConfig">
    
                                    <div class="form-row">
                                    
                                        ` + _groupType + `
    
                                        <div class="alert alert-light ml-2" role="alert">
                                            Works On Edit Mode Only!.. Usefull for only invoice table form. 
                                            Payment Method May not allow to partial pay.
                                       </div>
    
                                    </div>                                   
                                     

                                </div>
                            </div>
                        </li>`;

    $return += ``;
    return $return;
}

function paymentArea(groupData) {

    var label = '';
    var SECRET_KEY = 'SECRET_KEY';
    var MERCHANT = 'OPU_TEST';
    var ORDER_PRICE = '1';

    var PRICES_CURRENCY = 'TRY';
    var pricesOptions = {'TRY': 'TRY', 'USD': 'USD', 'EUR': 'EUR', 'GBP': 'GBP'};

    if (typeof groupData !== 'undefined' && typeof groupData['groupConfig'] !== 'undefined') {

        if (typeof groupData['groupConfig']['label'] !== 'undefined') {
            label = groupData['groupConfig']['label'];
        }

        if (typeof groupData['groupConfig']['SECRET_KEY'] !== 'undefined') {
            SECRET_KEY = groupData['groupConfig']['SECRET_KEY'];
        }

        if (typeof groupData['groupConfig']['MERCHANT'] !== 'undefined') {
            MERCHANT = groupData['groupConfig']['MERCHANT'];
        }

        if (typeof groupData['groupConfig']['ORDER_PRICE'] !== 'undefined') {
            ORDER_PRICE = groupData['groupConfig']['ORDER_PRICE'];
        }

        if (typeof groupData['groupConfig']['PRICES_CURRENCY'] !== 'undefined') {
            PRICES_CURRENCY = groupData['groupConfig']['PRICES_CURRENCY'];
        }
    }

    var _groupType = htmlInput('groupType', 'PAYMENT_AREA', '', 'hidden');
    var _label = htmlInput('label', label, 'placeholder="PAYMENT_AREA" class="labelInputField portletInput form-control"');
    var _MERCHANT = htmlInput('MERCHANT', MERCHANT, 'placeholder="" class="labelInputField portletInput form-control"');
    var _SECRET_KEY = htmlInput('SECRET_KEY', SECRET_KEY, 'placeholder="SECRET_KEY" class="labelInputField portletInput form-control"');

    var _ORDER_PRICE = htmlInput('ORDER_PRICE', ORDER_PRICE, 'placeholder="1.0" class="labelInputField portletInput form-control"');


    var _PRICES_CURRENCY = htmlSelect('PRICES_CURRENCY', pricesOptions, PRICES_CURRENCY, 'class="form-control form-control-sm selectpicker portletInput" ');

    var $return = `<li class="mt-2 p-2 shadow bg-white rounded groupContainer _callbackGroup" ` + arraytodatastring(groupData['groupConfig']) + `>

                            <div class="groupWizard">
                                <a href="#" class="btn btn-sm text-danger p-0 m-0 _callbackDeleteGroup" style="display: block"><i class="fa fa-trash"></i></a>
                            </div>
                                    
                           <div class="groupHeader row m-1 mr-3">
                                    <div class="col-sm-4 labelField">` + _label + `</div>
                                    <div class="col-sm-8 group-header _callbackGroupHeader"><span class=" ui-icon ui-icon-plusthick"></span></div>
                            </div>

                            <div class="groupCollapsable" style="display: none;">
                                    
                                <div class="groupConfig">
    
                                    <div class="form-row">
                                    
                                        ` + _groupType + `

                                         <div class="form-group col-md-4">
                                             <label for="" class="float-left pl-1">MERCHANT</label>` + _MERCHANT + `
                                         </div>                     

                                         <div class="form-group col-md-4">
                                             <label for="" class="float-left pl-1">SECRET KEY</label>` + _SECRET_KEY + `
                                         </div>                     
                                   
                                    </div>
                                    
                                    <div class="form-row">
    
                                        <div class="form-group col-md-4">
                                            <label for="" class="float-left pl-1">ORDER PRICE</label>` + _ORDER_PRICE + `
                                        </div>
    
                                        <div class="form-group col-md-4">
                                            <label for=""  class="float-left pl-1">PRICES CURRENCY</label>` + _PRICES_CURRENCY + `
                                        </div>
    
                                    </div>
    
                                   
    
    
                                </div>
                            </div>
                        </li>`;

    $return += ``;
    return $return;
}
//-------------------------------------------------------------------------//
function fieldArea(groupData) {

    var groupColumns = {'': ''};
    var label = '';

    if (typeof groupData !== 'undefined') {

        if (typeof groupData['groupColumns'] !== 'undefined') {
            groupColumns = groupData['groupColumns'];
        }
    }

    if (typeof groupData !== 'undefined' && typeof groupData['groupConfig'] !== 'undefined') {

        if (typeof groupData['groupConfig']['label'] !== 'undefined') {
            label = groupData['groupConfig']['label'];
        }

    }
    
    console.log(groupData, 'groupDatagroupData');
    

    var _groupType = htmlInput('groupType', 'FIELD_AREA', '', 'hidden');
    var _label = htmlInput('label', label, 'placeholder="FIELD AREA" class="labelInputField portletInput form-control"');

    var $return = `
                        <li class="mt-2 p-2 shadow bg-white rounded groupContainer _callbackGroup fieldAreaColor" `+ arraytodatastring(groupData['groupConfig']) + `>

                            <div class="groupWizard">
                                <a href="#" class="btn btn-sm text-danger p-0 m-0 _callbackDeleteGroup" style="display: block"><i class="fa fa-trash"></i></a>
                                <a href="#" class="btn btn-sm text-info p-0 m-0 _callbackAddColumn" style="display: block"><i class="fa fa-plus"></i></a>
                            </div>

                            <div class="groupHeader row m-1 mr-3 fieldAreaColor">
                                    
                                <div class="col-sm-4 labelField fieldAreaColor">
                                    ` + _label + `
                                </div>
                                
                                <div class="col-sm-8 group-header _callbackGroupHeader fieldAreaColor"><span class=" ui-icon ui-icon-minusthick"></span></div>
                            </div>

                            <div class="groupCollapsable">`;
    $return += `
                            <div class="row groupConfig m-0 pt-1 pl-3" style="display: none;">
                               
                               ` + _groupType + `
                                
                            </div>`;
    $return += ` 
                            <div class="row m-0 p-3 columnArea">`;

    $.each(groupColumns, function (key, porlets) {
        
       

        $return += `<div class="col column m-1 p-2 _callbackColumnClicked" `+ arraytodatastring({type:'groupColumn', col:'col'}) + `>
                                        <div class="columnWizard">
                                            <a href="#" class="btn btn-sm mb-1 text-dark _callbackDeleteColumn"><i class="fa fa-trash"></i></a>
                                        </div>`;

        $.each(porlets, function (key, porletData) {

            $return += returnPortlet(porletData);

        });

        $return += `</div>`;
    });

    $return += `</div>`;
    $return += ``

    $return += `
                            </div>
                        </li>`

    return $return;
}
//-------------------------------------------------------------------------//

//-------------------------------------------------------------------------//
function _callbackColumnClicked(element) {

    $('.columnWizard').hide();
    var $column = $(element);
    $column.find('.columnWizard').show();
}

function _callbackDeleteColumn(element) {

    var $column = $(element).parent('.columnWizard').parent('.column');
    //Move all porlets to hidden...
    if ($column.find('.portlet').length > 0) {
        $column.find('.portlet').each(function (index) {
            $(this).detach().appendTo('#passiveFields');
        });
    }

    $column.remove();

    serializeAll();
    sortPassiveFields();
}

function _callbackGroupHeader(element) {

    console.log('_callbackGroupHeader');

    var $groupContainer = $(element).parent('.groupHeader').parent('.groupContainer');
    $groupContainer.find(".groupCollapsable").slideToggle("fast");

    var icon = $(element).find('.ui-icon');
    icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");

//    $('.groupWizard').hide();
//    $groupContainer.find('.groupWizard').show();
}

function _callbackSubGroupHeader(element) {

    console.log('_callbackGroupHeader');
    var $groupContainer = $(element).parent('.subGroupHeader').parent('.groupSubContainer');
    $groupContainer.children(".subgrouparea").slideToggle("fast");
    var icon = $(element).find('.ui-icon');
    icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
    //        $('.groupWizard').hide();
    //        $groupContainer.find('.groupWizard').show();

}

function _callbackSubContainerGroup($subGroupContainer) {

    if (!$subGroupContainer.hasClass('selectedSubContainer')) {

        $('.subwizard').hide();
        $('.selectedSubContainer').removeClass('selectedSubContainer');

        $subGroupContainer.addClass('selectedSubContainer');

        $subGroupContainer.find('.subwizard').show();

    }


    if ($subGroupContainer.find('.selectedContainerNotSub').length === 0) {
        $('.selectedContainerNotSub').removeClass('selectedContainerNotSub');
    }



}

function _callbackPortletHeader(element) {

    console.log('_callbackPortletHeader');

    var $portlet = $(element).parent('.portlet');
    var icon = $portlet.find('.ui-icon');

    icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
    $portlet.find(".portlet-content").slideToggle("fast");

}

function _callbackGroup(groupContainer) {

//    console.log('_callbackGroup'); //groupWizard

//    $('.groupWizard').hide();


//    console.log(groupContainer.prop("classList"), 'CLASS_LIST');


    //groupContainer.find('.groupWizard').show();


}

function _callbackDeleteGroup(element) {

    console.log('_callbackDeleteGroup');

    var $groupContainer = $(element).parent('.groupWizard').parent('.groupContainer');
    //Move all porlets to hidden...
    if ($groupContainer.find('.portlet').length > 0) {
        $groupContainer.find('.portlet').each(function (index) {
            $(this).detach().appendTo('#passiveFields');
        });
    }

    $groupContainer.remove();

    if ($('.groupContainer').length === 0) {
        resetFields();
    }


    sortPassiveFields();
    serializeAll();
}

function _callbackAddSubContainerGroup(element) {

    console.log('_callbackAddSubContainerGroup');
    var $groupContainer = $(element).parent('.groupWizard').parent('.groupContainer');
    $groupContainer.find('.groupSubContainerArea').append(`<li class="groupSubContainer mb-2 _callbackSubContainerGroup">

                                        <div class="subwizard">
                                            <a href="#" class="btn btn-sm mb-1 text-success _callbackDeleteSubGroup" style="display: block"><i class="fa fa-trash"></i></a>
                                        </div>

                                        <div class="subGroupHeader row m-1 pr-3">
                                
                                            <div class="col-sm-4">
                                                <input name="label" placeHolder="Sub Group" class="subLabelInputField portletInput"  value="Sub Group"></input>
                                            </div>
                                            
                                            <div class="col-sm-8 _callbackSubGroupHeader"><span class=" ui-icon ui-icon-minusthick"></span></div>
                                        </div>


                                        <ul class="subgrouparea mt-3" id="2"></ul>

                                    </li>  `);
    initSortable(1);
}

function _callbackAddColumn(element) {

    console.log('_callbackAddSubContainerGroup');
    var $groupContainer = $(element).parent('.groupWizard').parent('.groupContainer');
    $groupContainer.find('.columnArea').append(`<div class="col column m-1 p-2 _callbackColumnClicked">
                                        <div class="columnWizard">
                                            <a href="#" class="btn btn-sm mb-1 text-dark _callbackDeleteColumn"><i class="fa fa-trash"></i></a>
                                        </div>                           
                                    </div> `);
    initSortable(1);


}

function _callbackDeleteSubGroup(element) {

    console.log('_callbackDeleteSubGroup');
    var $groupSubContainer = $(element).parent('.subwizard').parent('.groupSubContainer');
    //Move all porlets to hidden...
    if ($groupSubContainer.find('.portlet').length > 0) {
        $groupSubContainer.find('.portlet').each(function (index) {
            $(this).detach().appendTo('#passiveFields');
        });
    }

    $groupSubContainer.remove();

    serializeAll();
    sortPassiveFields();
}

function _callbackAddLeftJoinField(table_name, functionName, relation_id) {

    var $return = returnPortlet({
        field_name: null,
        label: null,
        field_type: 'leftJoinField',
        table_name: table_name,
        function: functionName,
        relation_id: relation_id});

    $('#passiveFields').append($return);

    initSortable(1);



}

function _callbackAddLastRecordRelation(table_name, functionName, relation_id) {

    var $return = returnPortlet({
        field_name: null,
        label: null,
        field_type: 'lastRecordRelation',
        table_name: table_name,
        function: functionName,
        relation_id: relation_id});

    $('#passiveFields').append($return);

    initSortable(1);

}

function _callbackRemovePortlet(portletNo) {

    $('#' + portletNo).remove();
    initSortable(1);

}

function _callbackAddVirtualTableField(table_name) {

    field_name = Object.keys($tableFields)[0]; //firstkey

    var $return = returnPortlet({
        field_name: field_name,
        label: null,
        field_type: 'virtualTableField',
        table_name: table_name,
        script_text: `
                    //Only Javascript Available.
                    var primaryValue = row.DT_RowId;
                    text = escapeHtml(row.` + field_name + `);
                    return text;

`
    });

    $('#passiveFields').append($return);

    initSortable(1);
}

//-------------------------------------------------------------------------//

function addContainerGroup(groupType) {

    var groupData = {};
    groupData['groupConfig'] = {};
    groupData['groupConfig']['groupType'] = groupType;

    if ($('.selectedContainerNotSub').length > 0) {

        $('.selectedContainerNotSub').after(_writeGroups(groupData));

    } else if ($('.selectedSubContainer').length > 0) {

        if ($('.selectedSubContainer').find('.subgrouparea').is(":visible")) {

            $('.selectedSubContainer').find('.subgrouparea').append(_writeGroups(groupData));
        } else {

            $(".page").last().append(_writeGroups(groupData));
        }

    } else if ($('.selectedContainerWithSub').length > 0) {

        $('.selectedContainerWithSub').after(_writeGroups(groupData));

    } else {

        $(".page").last().append(_writeGroups(groupData));
    }



    initSortable();
    initSelectpicker();
    serializeAll();
}

function initSortable(serialize) {

    $('.page').sortable({
        handle: ".groupHeader",
        //            items: "li",
        connectWith: ".subgrouparea",
        placeholder: "placeholder ui-corner-all"
    }).on("sortupdate", function (event, ui) {
        serializeAll();
    });
    $('.subgrouparea').sortable({
        //            handle: ".group-header",
        //            items: "li",
        connectWith: ".page, .subgrouparea",
        placeholder: "placeholder ui-corner-all"
    }).on("sortupdate", function (event, ui) {
        serializeAll();
    });

    $('.groupSubContainerArea').sortable({
        handle: ".subGroupHeader",
        //            items: "li",
        connectWith: ".groupSubContainerArea",
        placeholder: "subgroupareaplaceholder ui-corner-all"
    }).on("sortupdate", function (event, ui) {
        serializeAll();
    });

    $('.column').sortable({
        handle: ".portlet-header",
        cancel: ".portlet-toggle",
        connectWith: '.column',
        placeholder: 'portlet-placeholder ui-corner-all'}).on("sortupdate", function (event, ui) {

        sortPassiveFields();
        serializeAll();

    });

    if (typeof serialize !== 'undefined') {
        serializeAll();
    }


    console.log('btn-group-togglebtn-group-toggle');
    $('.btn-group-toggle').button('toggle');

}

function sortPassiveFields() {

    // Sort PassiveFields
    var $list = $("#passiveFields");
    $list.find('.portlet').detach().sort(function (a, b) {
        return $(a).find('.portlet-header').text().localeCompare($(b).find('.portlet-header').text());
    }).appendTo($list);
}

function serializeGroup($groupArea) {

    var $array = {};
    var groupID = 0;
    $groupArea.children('.groupContainer').each(function () {


        $array[groupID] = {};
        $array[groupID]['groupConfig'] = {};
        if ($(this).children('.groupCollapsable').children('.groupConfig').length > 0) {
            $array[groupID]['groupConfig'] = serializeElement($(this).children('.groupCollapsable').children('.groupConfig'));
        }

        var headerSerialize = serializeElement($(this).children('.groupHeader'));
        if (!isEmpty(headerSerialize)) {
            for (key in headerSerialize) {
                $array[groupID]['groupConfig'][key] = headerSerialize[key];
            }
        }

        var grouptype = $array[groupID]['groupConfig']['groupType'];

        if (grouptype === 'FIELD_AREA') {

            $array[groupID]['groupColumns'] = {};
            var $columns = $(this).find('.column');
            if ($columns.length > 0) {

                var columnID = 0;
                $columns.each(function () {

                    $array[groupID]['groupColumns'][columnID] = {};
                    var portlets = $(this).find('.portlet');
                    if (portlets.length > 0) {

                        var portletID = 0;
                        portlets.each(function () {

                            $array[groupID]['groupColumns'][columnID][portletID] = serializeElement($(this));
                            portletID++;
                        });
                    }

                    columnID++;
                });
            }
        }

        var groupSubContainerArea = $(this).children('.groupCollapsable').children('.groupSubContainerArea');
        if (groupSubContainerArea.length > 0) {

            $array[groupID]['subgroup'] = {};
            var subID = 0;
            groupSubContainerArea.children('.groupSubContainer').each(function () {

                $array[groupID]['subgroup'][subID] = {};
                $array[groupID]['subgroup'][subID]['subGroupConfig'] = serializeElement($(this).children('.subGroupHeader'));
                $array[groupID]['subgroup'][subID]['content'] = serializeGroup($(this).children('.subgrouparea'));
                subID++;
            });
        }

        groupID++;
    });
    return $array;
}

function serializeAll() {

    var $array = {};

    $array['pages'] = {};
    $array['activeFields'] = {};
    $array['passiveFields'] = {};
    $array['groupList'] = {};

    $('#passiveFields').find('.portlet').each(function () {

        var srlze = serializeElement($(this));
        var field_name = srlze['field_name'];
        $array['passiveFields'][field_name] = srlze;

    });

    var pageID = 0;
    var i = 0;
    var a = 0;

    $('.page').each(function () {

        $array['pages'][pageID] = {};
        $array['pages'][pageID]['pageConfig'] = {};
        $array['pages'][pageID]['pageGroups'] = serializeGroup($(this));

        $(this).find('.groupContainer').each(function () {

            if ($(this).children('.groupCollapsable').children('.groupConfig').length > 0) {
                $array['groupList'][i] = serializeElement($(this).children('.groupCollapsable').children('.groupConfig'));
                i++;
            }
        });

        $(this).find('.portlet').each(function () {

            $array['activeFields'][a] = serializeElement($(this));

            a++;
        });

        pageID++;

    });

    console.log($array, 'serializeAll');

    var myJSON = JSON.stringify($array, null, 4);

    console.log(myJSON, 'myJSON');

    $('[name="' + $json_path + '"]').val(myJSON);

}

function _writeGroups(groupData) {

    var groupConfig = groupData['groupConfig'];
    var groupType = groupConfig['groupType'];

    if (groupType === 'FIELD_AREA') {
        return fieldArea(groupData);
    } else if (groupType === 'ACCORDION_AREA') {
        return accordionArea(groupData);
    } else if (groupType === 'TAB_AREA') {
        return tabArea(groupData);
    } else if (groupType === 'VERTICAL_TAB_AREA') {
        return verticalTabArea(groupData);
    } else if (groupType === 'ALERT_AREA') {
        return alertArea(groupData);
    } else if (groupType === 'SCRIPT_AREA') {
        return scriptArea(groupData);
    } else if (groupType === 'DIVIDER_AREA') {
        return dividerArea(groupData);
    } else if (groupType === 'PAYMENT_AREA') {
        return paymentArea(groupData);
    } else if (groupType === 'INVOICE_PAYMENT_FORM') {
        return INVOICE_PAYMENT_FORM(groupData);
    }

}

function writeSerialize() {

    var $n = JSON.parse($('[name="' + $json_path + '"]').val());

    $.each($n['pages'], function (page_id, pageData) {

        var x = '<ul class="page m-0 pb-4 shadow bg-white rounded">';

        $.each(pageData['pageGroups'], function (groupID, groupData) {
            x += _writeGroups(groupData);
        });

        x += '</ul>';

        $("#pageZone").append(x);
    });

    $.each($n['passiveFields'], function (page_id, porletData) {
        $('#passiveFields').append(returnPortlet(porletData));
    });

}

function serializeElement($element) {

    var serializeArray = $element.find('select, textarea, input').serializeArray();

    var returnArray = {};

    $.each(serializeArray, function () {
        returnArray[this.name] = this.value;
    });

    return returnArray;
}

function addPage() {

    $('#pageZone').append(page());

}

function resetFields() {

    $('.page').each(function () {

        if ($(this).find('.portlet').length > 0) {
            $(this).find('.portlet').each(function (index) {
                $(this).detach().appendTo('#passiveFields');
            });
        }
        $(this).remove();
    });

    addPage();
    sortPassiveFields();
    addContainerGroup('FIELD_AREA');

}

function dbManagerRow(columndata, typlist) {


    var randomID = Math.floor((Math.random() * 10000000) + 1);

    var $html = ``;

    $html += `<div class="form-row mb-2 tablerow" data-rowid="` + randomID + `" id="tablerow_` + randomID + `" >
                    <div class="col-md-2">
                        ` + htmlInput('old_name[' + randomID + ']', columndata.name, '', 'hidden') + `
                        <div class="input-group"><div class="input-group-prepend"><span class="input-group-text"> <i class="fa fa-arrows-alt"> </i></span></div>
                        ` + htmlSelect('index[' + randomID + ']', {'': '---', 'primary': 'primary', 'unique': 'unique', 'index': 'index'}, columndata.indexType, 'class="form-control"') + `                          
                        </div>
                    </div>
                    <div class="col-md-2">
                        ` + htmlInput('field_name[' + randomID + ']', columndata.name, 'class="form-control" required pattern="[a-zA-Z_]+"') + `
                    </div>
                    <div class="col-md-2">
                        ` + htmlSelectWithTitle('type[' + randomID + ']', typlist, columndata.type, 'class="form-control"') + `
                     </div>
                    <div class="col-md-2">` + htmlInput('constraint[' + randomID + ']', columndata.constraint, 'class="form-control" placeHolder="Length" pattern="[0-9]{0,}"') + `</div>
                    <div class="col-md-2">` + htmlInput('default[' + randomID + ']', columndata.default, 'class="form-control" placeHolder="DEFAULT"') + `</div>
                    <div class="col-md-1">` + htmlSelect('isNULL[' + randomID + ']', {'NO': 'NO', 'YES': 'YES'}, columndata.isNULL, 'class="form-control"') + `</div>
                    <div class="col-md-1"><button type="button" data-rowid="` + randomID + `" class="delete_db_row close float-left"><span aria-hidden="true">−</span></button></div>
            </div>`;
    return $html;
}

function initDatabaseManagerSortable() {

    console.log(COLUMNS, 'COLUMNSCOLUMNS');

    var COLUMNS = jQuery.parseJSON($('input[name="COLUMNS"]').val());
    var typlist = jQuery.parseJSON($('input[name="typlist"]').val());

    if (isEmpty(COLUMNS)) {

        alert(11);
    } else {
        $.each(COLUMNS, function (key, columndata) {
            $('#dbmanager_row_area').append(dbManagerRow(columndata, typlist));
        });

    }



    $('.sortable').sortable({});

}

document.addEventListener('DOMContentLoaded', function () {

    $(document).on("change", '.portletInput', function (event) {
        serializeAll();
    });

    $(document).on('change', '.leftjoin_or_lastrecordfield', function () {

        var portletno = $(this).data('portletno');
        var functionname = $(this).data('functionname');

        $('#porletName_' + portletno).html(functionname + ' ' + this.value);
        $('#label_' + portletno).val(functionname + ' ' + this.value);

    });

    $(document).on('change', '.virtualFieldName', function () {

        var portletno = $(this).data('portletno');
        var functionname = '';

        $('#porletName_' + portletno).html(functionname + ' ' + this.value);
        $('#label_' + portletno).val(functionname + ' ' + this.value);

    });


    $(document).on("click", '.groupContainer', function (event, arg1) {

        if ($(this).hasClass('hassubcontainer')) {

            //Sub Container varsa. ACCORDION TAB VERTICAL TAB

            $('.selectedContainerWithSub').removeClass('selectedContainerWithSub');



            $(this).addClass('selectedContainerWithSub');

            $(this).find('.groupWizard').first().show();


            if ($(this).find('.selectedContainerNotSub').length === 0) {
                $('.selectedContainerNotSub').removeClass('selectedContainerNotSub');
            }

        } else
        {

            //Sub container yoksa...

            if (!$(this).hasClass('selectedContainerNotSub')) {

                if ($('.selectedContainerWithSub').has('.selectedContainerNotSub')) {

                    $('.selectedContainerWithSub').removeClass('selectedContainerWithSub');
                    $('.selectedSubContainer').removeClass('selectedSubContainer');

                }

                $('.selectedContainerNotSub > .groupWizard').hide();
                $(this).find('.groupWizard').first().show();
                $('.selectedContainerNotSub').removeClass('selectedContainerNotSub');
                $(this).addClass('selectedContainerNotSub');

            }


        }
    });

    $(document).on('click', '._callbackSubContainerGroup', function () {

        _callbackSubContainerGroup($(this));
    });

    $(document).on("onFormInit", function (event, arg1) {
        //{id, action}

        // ---------------------------------------------------------------------
        /**
         * Designer Form Acıldıgında Cagrılır
         */
        if (arg1.id === 'updateDesigner') {

            $json_path = $('#jsonPathName').val();
            $relationTables = jQuery.parseJSON($('[name="$relationTables"]').val());
            $tableFields = jQuery.parseJSON($('[name="$tableFields"]').val());

            writeSerialize();
            initSortable();
            initSelectpicker();
            //initCodeMirror();
        }
        // ---------------------------------------------------------------------
        /**
         * Database Manager Modal Acıldıgında
         */
        else if (arg1.id === 'createDBtable') {

            initDatabaseManagerSortable();
        }
        // ---------------------------------------------------------------------
    });

    $(document).on('click', '.resetfields', function () {
        resetFields();
    });

    $(document).on('click', '.addContainerGroup', function () {

        addContainerGroup($(this).data('groupname'));
    });

    $(document).on('click', '._callbackAddLeftJoinField', function () {
        _callbackAddLeftJoinField($(this).data('tablename'), $(this).data('function'), $(this).data('relationid'));
    });

    $(document).on('click', '._callbackAddLastRecordRelation', function () {
        _callbackAddLastRecordRelation($(this).data('tablename'), $(this).data('function'), $(this).data('relationid'));
    });

    $(document).on('click', '.addGroupColumns', function () {
        addGroupColumns($(this).data('columnnumber'));
    });

    $(document).on('click', '.labelalignment', function () {
        $('[name=labelAlignment]').val($(this).data('labelaligmentvalue'));
        serializeAll();
    });

    $(document).on('click', '.labelSize', function () {

        $('[name=labelSize]').val($(this).data('labelsizevalue'));
        serializeAll();
    });

    $(document).on('click', '._callbackPortletHeader', function () {

        console.log($(this).attr('id'), 'ididi');

        _callbackPortletHeader($(this));
    });

    $(document).on('click', '._callbackGroup', function () {
        _callbackGroup($(this));
    });

    $(document).on('click', '._callbackDeleteGroup', function () {
        _callbackDeleteGroup($(this));
    });

    $(document).on('click', '._callbackGroupHeader', function () {
        _callbackGroupHeader($(this));
    });

    $(document).on('click', '._callbackRemovePortlet', function () {
        _callbackRemovePortlet($(this).data('portletid'));
    });

    $(document).on('click', '._callbackAddSubContainerGroup', function () {
        _callbackAddSubContainerGroup($(this));
    });

    $(document).on('click', '._callbackAddVirtualTableField', function () {
        _callbackAddVirtualTableField($(this).data('tablename'));
    });

    $(document).on('click', '._callbackDeleteSubGroup', function () {
        _callbackDeleteSubGroup($(this));
    });

    $(document).on('click', '._callbackSubGroupHeader', function () {
        _callbackSubGroupHeader($(this));
    });

    $(document).on('click', '._callbackAddColumn', function () {
        _callbackAddColumn($(this));
    });

    $(document).on('click', '._callbackDeleteColumn', function () {
        _callbackDeleteColumn($(this));
    });


    $(document).on('click', '._callbackColumnClicked', function () {
        _callbackColumnClicked($(this));
    });


    $('.nav-tabs a').on('shown.bs.tab', function (e) {

        e.preventDefault();

        crud4_page.getDT1().columns.adjust();

        if (typeof module_relation !== 'undefined') {
            module_relation.getDT1().columns.adjust();
        }

        if (typeof XYChart !== 'undefined') {
            XYChart.getDT1().columns.adjust();
        }

        if (typeof PieChart !== 'undefined') {
            PieChart.getDT1().columns.adjust();
        }

        if (typeof crud4_calendar_item !== 'undefined') {
            crud4_calendar_item.getDT1().columns.adjust();
        }

        if (typeof statistic_cards !== 'undefined') {
            statistic_cards.getDT1().columns.adjust();
        }



    });


    $(document).on("onFormDone", function (event, arg1) {
        // ---------------------------------------------------------------------
        /**
         * Refresh CrudDesigner on DatabaseUpdated.
         */
        if (arg1.formid === 'databasedesigner') {

            location.reload();

        }
        // ---------------------------------------------------------------------

    });

});
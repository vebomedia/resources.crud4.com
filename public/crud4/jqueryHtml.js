function htmlSelectWithTitle(name, options, selectedKey, attr) {

    console.log(selectedKey, 'selectedKey');


    if (typeof attr === 'undefined') {
        attr = ` class="form-control" `;
    }

    var $selectBox = `<select name="` + name + `" ` + attr + `>`;

    $.each(options, function (key, data) {

        if (key !== 'top') {
            $selectBox += '<optgroup label="' + key + '">';
        }

        $.each(data, function (key, value) {

            if (typeof value.disabled != 'undefined') {

                $selectBox += '<option disabled="disabled">-</option>';
            } else {

                var selected = (value.name === selectedKey) ? ' selected ' : '';

                $selectBox += `<option class="" value="` + value.name + `" title="` + value.title + `" ` + selected + `>` + value.name + `</option>`;
            }
        });

        if (key !== 'top') {
            $selectBox += '</optgroup>';
        }

    });

    $selectBox += `</select>`;

    return $selectBox;
}

function htmlSelect(name, options, selectedKey, attr) {

    if (typeof attr === 'undefined') {
        attr = ` class="form-control" `;
    }

    var $selectBox = `<select name="` + name + `" ` + attr + `>`;

    $.each(options, function (key, value) {

        var selected = (key === selectedKey) ? ' selected ' : '';

        $selectBox += `<option class="" value="` + key + `" ` + selected + `>` + value + `</option>`;

    });

    $selectBox += `</select>`;

    return $selectBox;
}

function htmlInput(name, value, attr, type) {

    if (typeof attr === 'undefined') {
        attr = ` class="form-control" `;
    }

    if (typeof type === 'undefined') {
        type = `text`;
    }

    var $html = `<input type="` + type + `" name="` + name + `"  value="` + value + `" ` + attr + `>`;

    return $html;
}

function htmlTextarea(name, value, attr) {

    if (typeof attr === 'undefined') {
        attr = ` class="form-control"  rows="3" placeholder="" `;
    }

    var $html = `<textarea name="` + name + `" ` + attr + `>` + value + `</textarea>`;

    return $html;
}


function htmlRadio(name, options, selectedKey, btnClass) {

    if (typeof btnClass === 'undefined') {
        btnClass = '';
    }

    var $html = '';

    $.each(options, function (key, value) {

        var checked = (key === selectedKey) ? ' checked ' : '';
        var active = (key === selectedKey) ? ' active ' : '';

        var id = randomID();

        $html += `<div class="form-check form-check-inline">
                    <input type="radio"  name="` + name + `" value="` + key + `" class="form-check-input ` + btnClass + `"  ` + checked + ` id="` + id + `"  >
                    <label class="form-check-label" for="` + id + `">` + value + `</label>
                  </div>`;
    });

    return $html;

}

function htmlButtonGroup(name, options, selectedKey, btnClass) {

    if (typeof btnClass === 'undefined') {
        btnClass = `btn btn-secondary`;
    }

    var $html = `<div class="btn-group btn-group-sm btn-group-toggle" data-toggle="buttons">`;

    if (typeof btnClass === 'undefined') {
        btnClass = `btn btn-secondary`;
    }

    var $html = `<div class="btn-group btn-group-sm btn-group-toggle" data-toggle="buttons">`;

    $.each(options, function (key, value) {

        var checked = (key === selectedKey) ? ' checked ' : '';
        var active = (key === selectedKey) ? ' active ' : '';

        $html += `<label class="` + btnClass + ` ` + active + `"><input type="radio" name="` + name + `" value="` + key + `" autocomplete="off" ` + checked + `> ` + value + `</label>`;
    });


    $html += `</div>`;

    return $html;

}
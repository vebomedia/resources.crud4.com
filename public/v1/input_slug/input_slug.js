/**
 * Convert Text to Slug 
 * @param {type} text
 * @return {unresolved}
 */
function convertToSlug(text)
{
    var trMap = {
        'çÇ': 'c',
        'ğĞ': 'g',
        'şŞ': 's',
        'üÜ': 'u',
        'ıİ': 'i',
        'öÖ': 'o'
    };
    for (var key in trMap) {
        text = text.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
    }
    return  text.replace(/[^-a-zA-Z0-9\s]+/ig, '') // remove non-alphanumeric chars
            .replace(/\s/gi, "_") // convert spaces to dashes
            .replace(/[-]+/gi, "_") // trim repeated dashes
            .toLowerCase();
}

/**
 * Initilize Slug System
 * This function called each open form modal
 * 
 */
function initSlug() {

    $('.input_slug').each(function () {

        var slugfrom = $(this).data('slugfrom');
        var name = $(this).attr('name');

        $('input[name="' + slugfrom + '"]').addClass('slugfrom').attr('data-target', name);

    });
}

$(document).on('keyup change', '.slugfrom', function () {
    var target = $(this).data('target');
    $('input[name="' + target + '"]').val(convertToSlug($(this).val()));
});

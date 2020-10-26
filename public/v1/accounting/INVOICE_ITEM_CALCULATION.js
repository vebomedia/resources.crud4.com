/**
 * INVOICE_ITEM_CALCULATION.JS 
 * 
 * @author CRUD4 - Veysel Bozdoganoglu
 * vebomedia.com
 * 
 */

function getPercentageValue($total, $amount)
{
    return ($amount * 100) / $total;
}
function calculatePercentage($total, $percanteage)
{
    return ($total * $percanteage) / 100;
}

function decreasePercentage($total, $percanteage)
{
    return $total - (($total * $percanteage) / 100);
}

function increasePercentage($total, $percanteage)
{
    return $total + (($total * $percanteage) / 100);
}

function __get_accounting_values(FIELD_NAMES) {

    var values = {
        unit_price: $('[name="' + FIELD_NAMES.unit_price_field + '"]').val(),
        quantity: $('[name="' + FIELD_NAMES.quantity_field + '"]').val(),
        vat_rate: $('[name="' + FIELD_NAMES.vat_rate_field + '"]').val(),

        discount_value: $('[name="' + FIELD_NAMES.discount_value_field + '"]').val(),
        discount_type: $('[name="' + FIELD_NAMES.discount_type_field + '"]').val(),

        excise_duty_value: $('[name="' + FIELD_NAMES.excise_duty_value_field + '"]').val(),
        excise_duty_type: $('[name="' + FIELD_NAMES.excise_duty_type_field + '"]').val(),

        communications_tax_value: $('[name="' + FIELD_NAMES.communications_tax_value_field + '"]').val(),
        communications_tax_type: $('[name="' + FIELD_NAMES.communications_tax_type_field + '"]').val(),

        gross_total: $('[name="' + FIELD_NAMES.gross_total_field + '"]').val(),
        total_vat: $('[name="' + FIELD_NAMES.total_vat_field + '"]').val(),
        net_total: $('[name="' + FIELD_NAMES.net_total_field + '"]').val()
    };

    return values;
}

function __set_accounting_values(FIELD_NAMES, calculated) {

    var unit_price_field = FIELD_NAMES.unit_price_field;
    var gross_total_field = FIELD_NAMES.gross_total_field;
    var total_vat_field = FIELD_NAMES.total_vat_field;
    var net_total_field = FIELD_NAMES.net_total_field;

    $('[name="' + gross_total_field + '"]').val(calculated.gross_total);
    $('[name="' + total_vat_field + '"]').val(calculated.total_vat);

    if (!isEmpty(calculated.net_total)) {
        $('[name="' + net_total_field + '"]').val(calculated.net_total);
    }

    if (!isEmpty(calculated.unit_price)) {
        $('[name="' + unit_price_field + '"]').val(calculated.unit_price);
    }

//    change_input2money('input_number');

}

function _set_invoice_values(invoiceData) {
    
    console.log(invoiceData, 'invoiceDatainvoiceData');

    $('[name="gross_total"]').val(invoiceData.gross_total);
    $('[name="invoice_discount_amount"]').val(invoiceData.invoice_discount_amount);
    $('[name="total_excise_duty"]').val(invoiceData.total_excise_duty);
    $('[name="total_communications_tax"]').val(invoiceData.total_communications_tax);
    $('[name="total_vat"]').val(invoiceData.total_vat);
    $('[name="total_discount"]').val(invoiceData.total_discount);
    $('[name="withholding_amount"]').val(invoiceData.withholding_amount);
    $('[name="vat_withholding_amount"]').val(invoiceData.vat_withholding_amount);
    $('[name="net_total"]').val(invoiceData.net_total);
}

function calculateNetTotal(data) {

    var $return = {};

    $return['unit_price'] = !isEmpty(data.unit_price) ? returnNumber(data.unit_price) : 0;
    $return['quantity'] = !isEmpty(data.quantity) ? returnNumber(data.quantity) : 1;
    $return['vat_rate'] = !isEmpty(data.vat_rate) ? returnNumber(data.vat_rate) : 0;

    $return['discount_value'] = !isEmpty(data.discount_value) ? returnNumber(data.discount_value) : 0;
    $return['discount_type'] = !isEmpty(data.discount_type) ? (data.discount_type) : 'percentage';

    $return['excise_duty_value'] = !isEmpty(data.excise_duty_value) ? returnNumber(data.excise_duty_value) : 0;
    $return['excise_duty_type'] = !isEmpty(data.excise_duty_type) ? (data.excise_duty_type) : 'percentage';

    $return['communications_tax_value'] = !isEmpty(data.communications_tax_value) ? returnNumber(data.communications_tax_value) : 0;
    $return['communications_tax_type'] = !isEmpty(data.communications_tax_type) ? (data.communications_tax_type) : 'percentage';


    $return['subtotal'] = $return['quantity'] * $return['unit_price'];

    // INDIRIM 
    if ($return['discount_type'] === 'percentage')
    {
        $return['discount_amount'] = calculatePercentage($return['subtotal'], $return['discount_value']);
        $return['discount_percentage'] = $return['discount_value'];
    } else
    {
        $return['discount_amount'] = $return['discount_value'];
        $return['discount_percentage'] = getPercentageValue($return['subtotal'], $return['discount_value']);
    }

    // gross_total
    $return['gross_total'] = $return['subtotal'] - $return['discount_amount'];

    // OTV 
    if ($return['excise_duty_type'] === 'percentage')
    {
        $return['excise_duty_amount'] = calculatePercentage($return['gross_total'], $return['excise_duty_value']);
        $return['excise_duty_percentage'] = $return['excise_duty_value'];
    } else
    {
        $return['excise_duty_amount'] = $return['excise_duty_value'];
        $return['excise_duty_percentage'] = getPercentageValue($return['gross_total'], $return['excise_duty_value']);
    }

    var $gross_total_excise_duty = $return['gross_total'] + $return['excise_duty_amount'];

    // Vat
    $return['vat_amount'] = calculatePercentage($gross_total_excise_duty, $return['vat_rate']);

    if ($return['communications_tax_type'] === 'percentage')
    {
        $return['communications_tax_amount'] = calculatePercentage($gross_total_excise_duty, $return['communications_tax_value']);
        $return['communications_tax_percentage'] = $return['communications_tax_value'];
    } else
    {
        $return['communications_tax_percentage'] = getPercentageValue($gross_total_excise_duty, $return['communications_tax_value']);
        $return['communications_tax_amount'] = $return['communications_tax_value'];
    }

    $return['net_total'] = $gross_total_excise_duty + $return['vat_amount'] + $return['communications_tax_amount'];

    return $return;
}

function calculateUnitPrice(data) {

    var $return = {};

    $return['unit_price'] = !isEmpty(data.unit_price) ? returnNumber(data.unit_price) : 0;
    $return['quantity'] = !isEmpty(data.quantity) ? returnNumber(data.quantity) : 1;
    $return['vat_rate'] = !isEmpty(data.vat_rate) ? returnNumber(data.vat_rate) : 0;

    $return['discount_value'] = !isEmpty(data.discount_value) ? returnNumber(data.discount_value) : 0;
    $return['discount_type'] = !isEmpty(data.discount_type) ? (data.discount_type) : 'percentage';

    $return['excise_duty_value'] = !isEmpty(data.excise_duty_value) ? returnNumber(data.excise_duty_value) : 0;
    $return['excise_duty_type'] = !isEmpty(data.excise_duty_type) ? (data.excise_duty_type) : 'percentage';

    $return['communications_tax_value'] = !isEmpty(data.communications_tax_value) ? returnNumber(data.communications_tax_value) : 0;
    $return['communications_tax_type'] = !isEmpty(data.communications_tax_type) ? (data.communications_tax_type) : 'percentage';

    var $gross_total_excise_duty = 0.0;

    $return['net_total'] = returnNumber(data.net_total);

    if ($return['communications_tax_type'] === 'percentage') {
        $return['communications_tax_percentage'] = $return['communications_tax_value'];
        $gross_total_excise_duty = $return['net_total'] / (1 + ($return['vat_rate'] / 100) + ($return['communications_tax_value'] / 100));
        $return['communications_tax_amount'] = calculatePercentage($gross_total_excise_duty, $return['communications_tax_value']);
    } else {
        $gross_total_excise_duty = ($return['net_total'] - $return['communications_tax_value']) / (1 + ($return['vat_rate'] / 100));
        $return['communications_tax_amount'] = $return['communications_tax_value'];
        $return['communications_tax_percentage'] = calculatePercentage($gross_total_excise_duty, $return['communications_tax_value']);
    }

    $return['vat_amount'] = calculatePercentage($gross_total_excise_duty, $return['vat_rate']);

    if ($return['excise_duty_type'] === 'percentage') {

        $return['excise_duty_percentage'] = $return['excise_duty_value'];
        $return['gross_total'] = $gross_total_excise_duty / (1 + ($return['excise_duty_value'] / 100));
        $return['excise_duty_amount'] = calculatePercentage($return['gross_total'], $return['excise_duty_value']);
    } else {

        $return['gross_total'] = $gross_total_excise_duty - $return['excise_duty_value'];
        $return['excise_duty_amount'] = $return['excise_duty_value'];
        $return['excise_duty_percentage'] = getPercentageValue($return['gross_total'], $return['excise_duty_value']);

    }


    if ($return['discount_type'] === 'percentage')
    {
        $return['discount_percentage'] = $return['discount_value'];
        $return['subtotal'] = $return['gross_total'] / (1 - ($return['discount_value'] / 100));
        $return['discount_amount'] = $return['subtotal'] - $return['gross_total'];

    } else
    {

        $return['subtotal'] = $return['gross_total'] + $return['discount_amount'];
        $return['discount_percentage'] = getPercentageValue($return['subtotal'], $return['discount_value']);
    }

    $return['unit_price'] = $return['subtotal'] / $return['quantity'];

    return $return;
}


function calculateInvoice(calculationType) {
     
    var items = {};
    var invoiceData = {}
    // ---------------------
    // Get Invoice Properties Values
    invoiceData['invoice_discount_value'] = !isEmpty($('[name="invoice_discount_value"]').val()) ? returnNumber($('[name="invoice_discount_value"]').val()) : 0;
    invoiceData['invoice_discount_type'] = !isEmpty($('#invoice_discount_type').val()) ? ($('#invoice_discount_type').val()) : 'percentage';
    invoiceData['withholding_rate'] = !isEmpty($('[name="withholding_rate"]').val()) ? returnNumber($('[name="withholding_rate"]').val()) : 0;
    invoiceData['vat_withholding_rate'] = !isEmpty($('[name="vat_withholding_rate"]').val()) ? returnNumber($('[name="vat_withholding_rate"]').val()) : 0;

    //Start
    invoiceData['subtotal'] = 0;
    invoiceData['gross_total'] = 0;
    invoiceData['total_discount'] = 0;
    invoiceData['total_excise_duty'] = 0;
    invoiceData['total_communications_tax'] = 0;
    // ---------------------


    $('.INVOICE_ITEM_CALCULATION').each(function (index) {

        var FIELD_NAMES = $(this).data();

        if (calculationType === 'calculateUnitPrice') {
            var calculated = calculateUnitPrice(__get_accounting_values(FIELD_NAMES));

        } else {
            var calculated = calculateNetTotal(__get_accounting_values(FIELD_NAMES));
        }
        
        console.log(calculated, 'calculated');

        __set_accounting_values(FIELD_NAMES, calculated);

        invoiceData['subtotal'] += calculated['subtotal'];
        invoiceData['gross_total'] += calculated['gross_total'];
        invoiceData['total_discount'] += calculated['discount_amount']; //items total discount.
        invoiceData['total_excise_duty'] += calculated['excise_duty_amount']; //Otv
        invoiceData['total_communications_tax'] += calculated['communications_tax_amount']; //Oiv


        items[index] = calculated;
    });

    if (invoiceData['invoice_discount_type'] === 'percentage')
    {
        invoiceData['invoice_discount_amount'] = calculatePercentage(invoiceData['gross_total'], invoiceData['invoice_discount_value']);
        invoiceData['invoice_discount_percentage'] = invoiceData['invoice_discount_value'];
    } 
    else
    {
        invoiceData['invoice_discount_amount'] = invoiceData['invoice_discount_value'];
        invoiceData['invoice_discount_percentage'] = getPercentageValue(invoiceData['gross_total'], invoiceData['invoice_discount_value']);
    }
    
    // --- ??? ---
    //invoiceData['total_discount'] += invoiceData['invoice_discount_amount'];
        
     
    invoiceData['total_excise_duty'] = decreasePercentage(invoiceData['total_excise_duty'], invoiceData['invoice_discount_percentage']);
    invoiceData['total_communications_tax'] = decreasePercentage(invoiceData['total_communications_tax'], invoiceData['invoice_discount_percentage']);

    var $vat = {};
    var total_vat = 0;
    for (var key in items) {

        var $itemData = items[key];
        var $vat_amount = $itemData['vat_amount'];
        var $vat_rate = $itemData['vat_rate'];

        if (typeof $vat['vat_' + $vat_rate] === 'undefined')
        {
            $vat['vat_' + $vat_rate] = 0;
        }

        var vt = decreasePercentage($vat_amount, invoiceData['invoice_discount_percentage']);
        total_vat += vt;
        $vat['vat_' + $vat_rate] += vt;

    }
    
    console.log(total_vat, 'total_vattotal_vat');

    invoiceData['vat_analysis'] = $vat;
    invoiceData['total_vat'] = total_vat;

    invoiceData['before_taxes_total'] = invoiceData['gross_total'] - invoiceData['invoice_discount_amount'];
    //Stopaj
    invoiceData['withholding_amount'] = calculatePercentage(invoiceData['before_taxes_total'], invoiceData['withholding_rate']);
    //KDV TEVK.        
    invoiceData['vat_withholding_amount'] = calculatePercentage(invoiceData['total_vat'], invoiceData['vat_withholding_rate']);
    //Net Total
    invoiceData['net_total'] = invoiceData['before_taxes_total'] //
            - invoiceData['withholding_amount'] //Stopaj 0
            + invoiceData['total_excise_duty'] //Otv 
            + invoiceData['total_communications_tax'] //Oiv
            + invoiceData['total_vat']  //KDV 18
            - invoiceData['vat_withholding_amount'];    //KDV Tefkifat tutarı
  
    _set_invoice_values(invoiceData);
    
    console.log(invoiceData, 'invoiceData');
    console.log(items, 'items');

    change_input2money('input_number');
}

function INIT_INVOICE_ITEM_CALCULATION() {

    if ($('.INVOICE_ITEM_CALCULATION').length > 0) {
        $(".INVOICE_ITEM_CALCULATION").each(function (index) {

            var FIELD_NAMES = $(this).data();

            for (var key in FIELD_NAMES) {

                var name_value = FIELD_NAMES[key];

                if ($('[name="' + name_value + '"]').length === 0) {
                    continue;
                }

                if (key === 'net_total_field') {
                    $('[name="' + name_value + '"]').on('change', function () {
                        calculateInvoice('calculateUnitPrice');
                    });
                } else {
                    $('[name="' + name_value + '"]').on('change', function () {
                        calculateInvoice('calculateNetTotal');
                    });
                }
            }
        });
    }

    $('[name="invoice_discount_value"]').on('change', function () {
        calculateInvoice('calculateNetTotal');
    });
    $('[name="invoice_discount_type"]').on('change', function () {
        calculateInvoice('calculateNetTotal');
    });
    $('[name="withholding_rate"]').on('change', function () {
        calculateInvoice('calculateNetTotal');
    });
    $('[name="vat_withholding_rate"]').on('change', function () {
        calculateInvoice('calculateNetTotal');
    });

}
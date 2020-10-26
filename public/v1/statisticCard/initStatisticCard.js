// -------------------------------------------------------------------------- //
function initStatisticCard() {
    // -------------------------------------------------------------------------
    $('[data-action="readStatistic"]').each(function () {

        let ajaxurl = $(this).data('ajaxurl');
        let card_slug = $(this).data('card_slug');
        let alliesname = $(this).data('alliesname');
        let type = $(this).data('type'); //std, sparkline..

        $('[data-cardvalue="' + card_slug + '"]').html('.');

        if (type === 'number') {
            $.ajax({
                url: ajaxurl,
                dataType: "json"
            }).done(function (data) {

                if (1) {

                    var val = Number(data[alliesname]);

                    if (Number.isInteger(val) === false) {

                        val = parseFloat(val).toFixed(2);
                    }
                } else {

                    val = 0;
                }


                $('[data-cardvalue="' + card_slug + '"]').html('<span style="font-size:2.4vw;">' + val + '</span>');
            });

        } else if (type === 'sparkline') {

            general.loadPackage('amcharts', function () {
                // -------------------------------------------------------------------------
                //crud4_page Sparkline Card Stat
                // -------------------------------------------------------------------------

                am4core.useTheme(am4themes_animated);

                var chart = am4core.create(card_slug, am4charts.XYChart);
                chart.dataSource.url = ajaxurl;
                chart.padding(0, 0, 0, 0);

                var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.renderer.grid.template.disabled = true;
                dateAxis.renderer.labels.template.disabled = true;
                dateAxis.startLocation = 0.5;
                dateAxis.endLocation = 0.7;
                dateAxis.cursorTooltipEnabled = false;

                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.min = 0;
                valueAxis.renderer.grid.template.disabled = true;
                valueAxis.renderer.baseGrid.disabled = true;
                valueAxis.renderer.labels.template.disabled = true;
                valueAxis.cursorTooltipEnabled = false;

                chart.cursor = new am4charts.XYCursor();
                chart.cursor.lineY.disabled = true;

                var series = chart.series.push(new am4charts.LineSeries());
                series.tooltipText = '{CATEGORY}: [bold]{' + alliesname + '}';
                series.dataFields.dateX = "CATEGORY";
                series.dataFields.valueY = alliesname;
                series.tensionX = 0.8;
                series.strokeWidth = 2;

                series.stroke = am4core.color("#ff0000"); // red
                series.propertyFields.stroke = am4core.color("#ff0000");
                series.propertyFields.fill = am4core.color("#ff0000");

                // render data points as bullets
                var bullet = series.bullets.push(new am4charts.CircleBullet());
                bullet.circle.opacity = 0;
                bullet.circle.propertyFields.opacity = "opacity";
                bullet.circle.radius = 3;

            });

        } else if (type === 'piechart') {

            general.loadPackage('amcharts', function () {
                // -------------------------------------------------------------------------
                //crud4_page Sparkline Card Stat
                // -------------------------------------------------------------------------
                am4core.useTheme(am4themes_animated);

                var chart = am4core.create(card_slug, am4charts.PieChart);
                chart.dataSource.url = ajaxurl;
                chart.padding(0, 0, 0, 0);

                var series = chart.series.push(new am4charts.PieSeries());
                series.dataFields.value = alliesname;
                series.dataFields.category = "CATEGORY";
                series.dataFields.hiddenInLegend = "disabled";
                series.labels.template.disabled = true;
                series.ticks.template.disabled = true;


            });

        } else if (type === 'halfcircle') {

            general.loadPackage('amcharts', function () {
                // -------------------------------------------------------------------------
                //crud4_page Sparkline Card Stat
                // -------------------------------------------------------------------------
                am4core.useTheme(am4themes_animated);

                var chart = am4core.create(card_slug, am4charts.PieChart);
                chart.dataSource.url = ajaxurl;
                chart.padding(0, 0, 0, 0);
                chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

                chart.radius = am4core.percent(70);
                chart.innerRadius = am4core.percent(40);
                chart.startAngle = 180;
                chart.endAngle = 360;

                var series = chart.series.push(new am4charts.PieSeries());
                series.dataFields.value = alliesname;
                series.dataFields.category = "CATEGORY";

                series.slices.template.cornerRadius = 10;
                series.slices.template.innerCornerRadius = 7;
                series.slices.template.draggable = true;
                series.slices.template.inert = true;

                series.hiddenState.properties.startAngle = 90;
                series.hiddenState.properties.endAngle = 90;

                series.labels.template.disabled = true;
                series.ticks.template.disabled = true;

                //chart.legend = new am4charts.Legend();

            });
        } else if (type === 'radiusDonut') {

            general.loadPackage('amcharts', function () {
                // -------------------------------------------------------------------------
                //crud4_page Sparkline Card Stat
                // -------------------------------------------------------------------------
                am4core.useTheme(am4themes_animated);

                var chart = am4core.create(card_slug, am4charts.PieChart);
                chart.dataSource.url = ajaxurl;
                chart.padding(0, 0, 0, 0);
                chart.startAngle = 160;
                chart.endAngle = 380;

                // Let's cut a hole in our Pie chart the size of 40% the radius
                chart.innerRadius = am4core.percent(40);

                // Add and configure Series
                var pieSeries = chart.series.push(new am4charts.PieSeries());
                pieSeries.dataFields.value = alliesname;
                pieSeries.dataFields.category = "CATEGORY";
                pieSeries.slices.template.stroke = new am4core.InterfaceColorSet().getFor("background");
                pieSeries.slices.template.strokeWidth = 1;
                pieSeries.slices.template.strokeOpacity = 1;
//
//                // Disabling labels and ticks on inner circle
                pieSeries.labels.template.disabled = true;
                pieSeries.ticks.template.disabled = true;
//
//                // Disable sliding out of slices
                pieSeries.slices.template.states.getKey("hover").properties.shiftRadius = 0.05;
                pieSeries.slices.template.states.getKey("hover").properties.scale = 1;
                pieSeries.radius = am4core.percent(40);
                pieSeries.innerRadius = am4core.percent(30);
//
                var cs = pieSeries.colors;
                cs.list = [am4core.color(new am4core.ColorSet().getIndex(0))];

                cs.stepOptions = {
                    lightness: -0.05,
                    hue: 0
                };
                cs.wrap = false;

                // Add second series
                var pieSeries2 = chart.series.push(new am4charts.PieSeries());
                pieSeries2.dataFields.value = alliesname;
                pieSeries2.dataFields.category = "CATEGORY";
                pieSeries2.slices.template.stroke = new am4core.InterfaceColorSet().getFor("background");
                pieSeries2.slices.template.strokeWidth = 1;
                pieSeries2.slices.template.strokeOpacity = 1;
                pieSeries2.slices.template.states.getKey("hover").properties.shiftRadius = 0.05;
                pieSeries2.slices.template.states.getKey("hover").properties.scale = 1;

                pieSeries2.labels.template.disabled = true;
                pieSeries2.ticks.template.disabled = true;

                var label = pieSeries.createChild(am4core.Label);
                label.textAlign = "middle";
                label.horizontalCenter = "middle";
                label.verticalCenter = "middle";
                label.text = "[font-size:18px]Total[/]\n[bold font-size:30px]{values.value.sum}[/]";
                label.fontSize = 30;
                label.fontWeight = "bold";
                label.fill = am4core.color("white");

            });

        }

    });
    // -------------------------------------------------------------------------
}
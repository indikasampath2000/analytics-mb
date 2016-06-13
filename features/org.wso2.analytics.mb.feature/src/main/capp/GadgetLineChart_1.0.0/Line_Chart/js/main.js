var TOPIC = "subscriber";
var PUBLISHER_TOPIC = "chart-zoomed";
var page = gadgetUtil.getCurrentPageName();
var qs = gadgetUtil.getQueryString();
var prefs = new gadgets.Prefs();
var type;
var view = prefs.getString(PARAM_GADGET_VIEW);
var chart = gadgetUtil.getChart(prefs.getString(PARAM_GADGET_ROLE));
var rangeStart;
var rangeEnd;

if (chart) {
    type = gadgetUtil.getRequestType(view, chart);
}

$(function() {
    if (!chart || !view) {
        $("#canvas").html(gadgetUtil.getErrorText("Gadget initialization failed. Gadget role and Gadget view must be provided."));
        return;
    }
    if (page != PAGE_LANDING && qs[PARAM_ID] == null) {
        $("#canvas").html(gadgetUtil.getDefaultText());
        return;
    }
    var timeFrom = gadgetUtil.timeFrom();
    var timeTo = gadgetUtil.timeTo();
    console.log("LINE_CHART[" + view + "]: TimeFrom: " + timeFrom + " TimeTo: " + timeTo);
    gadgetUtil.fetchData(CONTEXT, {
        type: type,
        timeFrom: timeFrom,
        timeTo: timeTo
    }, onData, onError);
});

gadgets.HubSettings.onConnect = function() {
    gadgets.Hub.subscribe(TOPIC, function(topic, data, subscriberData) {
        onTimeRangeChanged(data);
    });
};

function onTimeRangeChanged(data) {
    gadgetUtil.fetchData(CONTEXT, {
        type: type,
        id: qs.id,
        timeFrom: data.timeFrom,
        timeTo: data.timeTo,
        entryPoint: qs.entryPoint
    }, onData, onError);
};

function onData(response) {
    try {
        var data = response.message;
        if (data.length == 0) {
            $('#canvas').html(gadgetUtil.getEmptyRecordsText());
            return;
        }
        //sort the timestamps
        //data.sort(function(a, b) {
        //    return a.timestamp - b.timestamp;
        //});

        //perform necessary transformation on input data
        chart.schema[0].data = chart.processData(data);
        //finally draw the chart on the given canvas
        chart.chartConfig.width = $('body').width();
        chart.chartConfig.height = $('body').height();

        var vg = new vizg(chart.schema, chart.chartConfig);
        $("#canvas").empty();
        vg.draw("#canvas",[{type:"range", callback:onRangeSelected}]);
    } catch (e) {
        $('#canvas').html(gadgetUtil.getErrorText(e));
    }
};

function onError(msg) {
    $("#canvas").html(gadgetUtil.getErrorText(msg));
};

document.body.onmouseup = function() {
    if((rangeStart) && (rangeEnd) && (rangeStart.toString() !== rangeEnd.toString())){
        var message = {
            timeFrom: new Date(rangeStart).getTime(),
            timeTo: new Date(rangeEnd).getTime(),
            timeUnit: "Custom"
        };
        gadgets.Hub.publish(PUBLISHER_TOPIC, message);
    }
}

var onRangeSelected = function(start, end) {
    rangeStart = start;
    rangeEnd = end;
};
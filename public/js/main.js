//var q = d3.queue()
//	.defer(d3.json, "/data")
//	.await(draw);


function draw(error, data) {
	if (error) { console.log(error); }
	var data = [
		{ date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab" },
		{ date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab" },
		{ date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa" },
		{ date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab" },
		{ date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab" },
		{ date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab" },
		{ date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash" },
		{ date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab" },
		{ date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab" },
		{ date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab" },
		{ date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash" },
		{ date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa" }
	];
	var ndx = crossfilter(data);
	var totalDim = ndx.dimension(function(d) {return d.total;});
	var total_90 = total.filter(90);
}

function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

var data = [
	{date: "12/27/2012", http_404: 28, http_200: 190, http_302: 100},
	{date: "12/28/2012", http_404: 28, http_200: 10, http_302: 100},
	{date: "12/29/2012", http_404: 100, http_200: 300, http_302: 200},
	{date: "12/30/2012", http_404: 265, http_200: 90, http_302: 0},
	{date: "12/31/2012", http_404: 289, http_200: 90, http_302: 0},
	{date: "01/01/2013", http_404: 243, http_200: 90, http_302: 0},
	{date: "01/02/2013", http_404: 143, http_200: 10, http_302: 1},
	{date: "01/03/2013", http_404: 265, http_200: 90, http_302: 0},
	{date: "01/04/2013", http_404: 237, http_200: 90, http_302: 0},
	{date: "01/05/2013", http_404: 299, http_200: 90, http_302: 0},
	{date: "01/06/2013", http_404: 281, http_200: 200, http_302: 1},
	{date: "01/07/2013", http_404: 133, http_200: 200, http_302: 100}
];
var ndx = crossfilter(data);
// var totalDim = ndx.dimension(function(d) {return d.total;});
// var total_90 = totalDim.filter(90);

// var typeDim = ndx.dimension(function(d) {return d.type});
// var type_tab = typeDim.filter("tab");
// var totalByType = typeDim.group().reduceSum(function(d) {return d.total;});
// var cash_total = ndx.groupAll().reduceSum(function(d) {return d.total;}).value() 

var parseDate = d3.time.format("%m/%d/%Y").parse;
data.forEach(function(d) {
	d.date = parseDate(d.date);
	d.total = d.http_302+d.http_200+d.http_404;
	d.year = d.date.getFullYear();
});

var dateDim = ndx.dimension(function(d) { return d.date; });
var hits = dateDim.group().reduceSum(function(d) { return d.total; });
var status_200=dateDim.group().reduceSum(function(d) {return d.http_200;});
var status_302=dateDim.group().reduceSum(function(d) {return d.http_302;});
var status_404=dateDim.group().reduceSum(function(d) {return d.http_404;});
var minDate = dateDim.bottom(1)[0].date;
var maxDate = dateDim.top(1)[0].date;

var hitslineChart = dc.lineChart("#chart-line-hitsperday");
hitslineChart
	.width(500).height(200)
	//.brushOn(false)
	.yAxisLabel("Hits per day")
	.dimension(dateDim)
	.group(status_200,"200")
	.stack(status_302,"302")
	.stack(status_404,"404")
	.renderArea(true)
	.legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
	.x(d3.time.scale().domain([minDate,maxDate])); 


var yearDim = ndx.dimension(function(d) {return d.year;});
var year_Total = yearDim.group().reduceSum(function(d) {return d.total;});
var yearRingChart = dc.pieChart("#chart-ring-year");
yearRingChart
	.width(200).height(200)
	.dimension(yearDim)
	.group(year_Total)
	.innerRadius(30);


var datatable = dc.dataTable("#dc-data-table");
datatable
	.dimension(dateDim)
	.group(function(d) {return d.year;})
	.columns([
		function(d) { return d.date.getDate();},
		function(d) { return d.http_200; },
		function(d) { return d.http_302; },
		function(d) { return d.http_404; },
		function(d) { return d.total; }
	]);

dc.renderAll();


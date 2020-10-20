var dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";


var tooltip = d3.select("body").append("div").attr("id", "tooltip");

d3.json(dataUrl).then((fullData) => {  
  var data = fullData.data;
  
  var width = 1400;
  var height = 400;
  var paddingRight = 10;
  var paddingLeft = 40;
  var paddingTop = 10;
  var paddingBottom = 20;
  var barWidth = (width) / data.length;

  var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  xValues = data.map(e => new Date(e[0]));
 
  
  var xScale = d3.scaleTime()
    .domain([d3.min(xValues), d3.max(xValues)])
    .range([paddingLeft, width - paddingRight]);
  
  var dates = data.map(e => e[0]);
  var xValuesScaled = xValues.map(xValue => xScale(xValue));

  var yScale = d3.scaleLinear()
    .domain([
      0,
      d3.max(data, d => d[1])
    ])
    .range([
      height - paddingBottom,
      paddingTop
    ]);

  var xAxis = d3.axisBottom().scale(xScale);
  var yAxis = d3.axisLeft().scale(yScale);

  svg.append("g")
    .attr("transform", "translate(0, " + (height-paddingBottom) + ")")
    .attr("id", "x-axis")
    .call(xAxis);

  svg.append("g")
    .attr("transform", "translate(" + paddingLeft + ", 0)")
    .attr("id", "y-axis")
    .call(yAxis);

  var linearScale = d3.scaleLinear()
    .domain([
      0,
      d3.max(data, d => d[1])
    ])
    .range([
      paddingTop,
      height - paddingBottom
    ]);
  
  var yValues = data.map(e => e[1]);
  var yValuesScaled = yValues.map(e => linearScale(e));
  var dataContainer = svg.append("g");

  dataContainer.selectAll("rect")
    .data(xValuesScaled)
    .enter()
    .append("rect")
    .attr("fill", "blue")
    .attr("class", "bar")
    .attr("data-date", (d, i) => dates[i])
    .attr("data-index", (d, i) => i)
    .attr("data-gdp", (d, i) => yValues[i])
    .attr("x", d => d)
    .attr("y", (d, i) => height - paddingBottom - yValuesScaled[i])
    .attr("height", (d, i) => yValuesScaled[i] + "px")
    .attr("width", barWidth + "px")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
});

function handleMouseOver(d, i) {
  var bar = d3.select(this);
  
  var date = new Date(bar.attr("data-date"));
  var gdp = bar.attr("data-gdp");
  
  var quarter = "";
  if(date.getMonth() == 0) {
    quarter = "Q1";
  } else if(date.getMonth() == 3) {
    quarter = "Q2";
  } else if(date.getMonth() == 6) {
    quarter = "Q3";
  } else if(date.getMonth() == 9) {
    quarter = "Q4"
  }

  var yearDisplay = date.getFullYear() + " " + quarter;
  
  tooltip
    .style("left", d.pageX - 30 + "px")
    .style("top", d.pageY - 100 + "px")
    .attr("data-date", bar.attr("data-date"))
    .html("Date: " + yearDisplay + "<br>" + "GDP: " + gdp)
    .transition()
    .duration(100)
    .style("opacity", 0.9);
  
}

function handleMouseOut(d, i) {
  var bar = d3.select(this);
  
  var date = new Date(bar.attr("data-date"));
  
  tooltip.transition().duration(200).style("opacity", 0);
}
// JavaScript source code
"use strict";
(function () {


    var data = "";
    var filteredData = "";
    var svgContainer = "";
    var xAxisDataColumnName = "Sp. Def";
    var yAxisDataColumnName = "Total";

    var xAxisData = null;
    var yAxisData = null;
    const limits = null;
    let filter1 = null;
    var filter2 = null;

    const colors = {

        "Bug": "#4E79A7",

        "Dark": "#A0CBE8",

        "Electric": "#F28E2B",

        "Fairy": "#FFBE7D",

        "Fighting": "#59A14F",

        "Fire": "#8CD17D",

        "Ghost": "#B6992D",

        "Grass": "#499894",

        "Ground": "#86BCB6",

        "Ice": "#FABFD2",

        "Normal": "#E15759",

        "Poison": "#FF9D9A",

        "Psychic": "#79706E",

        "Steel": "#BAB0AC",

        "Water": "#D37295"

    }




    // dimensions for svg
    const measurements = {
        width: 500,
        height: 500,
        marginAll: 50
    }

    window.onload = function () {
        // load data and append svg to body
        svgContainer = d3.select('body').append("svg")
            .attr('width', measurements.width)
            .attr('height', measurements.height);
        d3.csv("pokemon.csv")
            .then((csvData) => data = csvData)
            .then(() => startErUp())
       
    }

    function startErUp() {
        const generations = [1, 2, 3, 4, 5, 6, 'All']
        const legendary = ['True', 'False', 'All']

        // get arrays of TOEFL Score and Chance of Admit
        xAxisData = data.map((row) => parseInt(row[xAxisDataColumnName]))
        yAxisData = data.map((row) => parseInt(row[yAxisDataColumnName]))

        filter1 = d3.select('body')           
            .append('select')
            .attr('id', 'legendaryFilter')

            .style('top', '80px')
            .style('left', '40px')
            .style('position','absolute')
            .selectAll('option')
            .data(legendary)
            .enter()
            .append('option')            
            .attr('value', function (d) {
                return d;
            })
            .html(function (d) {
                return d;
            });

        filter1 = d3.select('#legendaryFilter');


        filter1.on("change", function (e) {
            //console.log(filter1.value);
            //e.options[e.selectedIndex].text
            var generation = document.querySelector("#generationFilter");//e.options[e.selectedIndex].text; <- I think this is the problem
            var legendarySelector = document.querySelector('#legendaryFilter');
            console.log(legendarySelector.value);    
            var groupData = getFilteredData(data, generation.value, legendarySelector.value);
            data = groupData;

           //updatePoints(groupData);
           //enterPoints(groupData);
            //exitPoints(groupData);
            makeScatterPlot();

        });

        

        filter2 = d3.select('#chart')            
            .append('select')
            .attr('id', 'generationFilter')
            .style('top', '80px')
            .style('left', '100px')
            .style('position', 'absolute')
            .selectAll('option')
            .data(generations)
            .enter()
            .append('option')
            .html(function (d) {
                return d;
            }).attr('value', function (d) {
                return d;
            });

        filter2 = d3.select('#generationFilter');


        filter2.on("change",  function () {
           // var legendary = e.options.text;

            //var generationSelector = document.querySelector('#generationFilter');
            var groupData = getFilteredData(data, filter1.value, filter2.value);
            data = groupData;
            //updatePoints(groupData);
            //enterPoints(groupData);
            //exitPoints(groupData);
            makeScatterPlot()

        });

        makeScatterPlot();

        makeLegend();
    }

    // Get a subset of the data based on the group
    function getFilteredData(data, generation, legendary) {

        if (generation === 'all' && legendary === 'all') {
            filteredData = data;
        } else if (generation === 'all') {
            filteredData = data.filter((row) => row['Legendary'] === legendary);
        } else if (legendary === 'all') {
            filteredData = data.filter((row) => row['Generation'] === generation);
        } else {
            filteredData = data.filter((row) => row['Generation'] === generation && row['Legendary'] === legendary);
        }
        /*
        return data.filter(function (point) {

            return point.generation === parseInt(generation) && point.legendary === parseInt(legendary);
        });*/

        return filteredData;
    }

    // Helper function to add new points to our data
    function enterPoints(data) {
        // Add the points!
        svgContainer.selectAll(".point")
            .data(data)
            .enter().append("path")
            .attr("class", "point")
            .attr('fill', 'red')
            //.attr("d", d3.svg.symbol().type("triangle-up"))
            .attr("transform", function (d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
    }

    function exitPoints(data) {
        svgContainer.selectAll(".point")
            .data(data)
            .exit()
            .remove();
    }

    function updatePoints(data) {
        svgContainer.selectAll(".point")
            .data(data)
            .transition()
            .attr("transform", function (d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
    }

    // New select element for allowing the user to select a group!
  //  var generationSelector = document.querySelector('#generationFilter');
    //var legendarySelector = document.querySelector('#legendaryFilter');
   // var newData = getFilteredData(data, $generationSelector.value, $legendarySelector.value );

    // Enter initial points filtered by default select value set in HTML
   // enterPoints(newData);


    

    function makeScatterPlot() {
        // get arrays of TOEFL Score and Chance of Admit
        xAxisData = data.map((row) => parseInt(row[xAxisDataColumnName]))
        yAxisData = data.map((row) => parseInt(row[yAxisDataColumnName]))
        // find range of data
        var limits = findMinMax(xAxisData, yAxisData)
        // create a function to scale x coordinates
        let scaleX = d3.scaleLinear()
            .domain([limits.xMin -20 , limits.xMax])
            .range([0 + measurements.marginAll, measurements.width - measurements.marginAll])
        // create a function to scale y coordinates
        let scaleY = d3.scaleLinear()
            .domain([limits.yMax, limits.yMin - 50])
            .range([0 + measurements.marginAll, measurements.height - measurements.marginAll])

        drawAxes(scaleX, scaleY);

        plotData(scaleX, scaleY);

       

    }



    function makeLegend() {

        let legend = d3.select('#legend').style('top', '80px')
            .style('right', '50px')
            .style('position', 'absolute');

        let types = []
        for (let type in colors) types.push(type)

        legend.selectAll('circle')
            .data(types)
            .enter()
            .append('circle')
            .attr('cx', 20)
            .attr("cy", (d, i) => 20 + i * 25)
            .attr("r", 7)
            .style("fill", (d) => colors[d])

        legend.selectAll("labels")
            .data(types)
            .enter()
            .append("text")
            .attr("x", 40)
            .attr("y", (d, i) => 22 + i * 25)
            .text((d) => d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    }


    function findMinMax(xData, yData) {
        return {
            xMin: d3.min(xData),
            xMax: d3.max(xData),
            yMin: d3.min(yData),
            yMax: d3.max(yData)
        }
    }

    function drawAxes(scaleX, scaleY) {
        // these are not HTML elements. They're functions!
        let xAxis = d3.axisBottom()
            .scale(scaleX)

        let yAxis = d3.axisLeft()
            .scale(scaleY)

        // append x and y axes to svg
        svgContainer.append('g')
            .attr('transform', 'translate(0,450)')
            .call(xAxis)

        svgContainer.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(yAxis)

   

    }

    function plotData(scaleX, scaleY) {
        // get scaled x and y coordinates from a datum
        // a datum is just one row of our csv file
        // think of a datum as an object of form:
        // {
        //     "TOEFL Score": ...,
        //     "Admit": ...,
        //     ...
        // }
        const xMap = function (d) { return scaleX(+d[xAxisDataColumnName]) }
        const yMap = function (d) { return scaleY(+d[yAxisDataColumnName]) }

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const circles = svgContainer.selectAll(".circle")
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', xMap)
            .attr('cy', yMap)
            .attr('r', 3)
            .attr("data-legend", function (d) { return d.name })
            .style('fill', function (d) {
                return colors[d['Type 1']]
            })
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                    .duration('100')
                    .attr("r", 7);
                //Makes div appear
                div.transition()
                    .duration(100)
                    .style("opacity", 1);
                div.html("Name: " + (d.Name) + "<br/>" + "Type 1: " +(d["Type 1"]) + "<br/>" + "Type 2: " + (d["Type 2"]))
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 15) + "px");
            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('200')
                    .attr("r", 3);
                //makes div disappear
                div.transition()
                    .duration('200')
                    .style("opacity", 0);
            });

       
    }

   


    /*

    let filter1 = d3.select('body')
        .append('select')
        .data(colors)
        .enter()
        .append('option')
        .attr('value', funtion(d)){
            let keys = Object.key(d)
            let key = keys[0]
            return = d[key]
        })
        .html(function (d) {
            ley keys = Object.keys(d)
            return keys[0]
        }
        )*/
    


})()
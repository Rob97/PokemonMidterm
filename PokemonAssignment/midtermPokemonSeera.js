// JavaScript source code
"use strict";
(function () {


    let data = "";
    let svgContainer = "";
    let xAxisDataColumnName = "Sp. Def";
    let yAxisDataColumnName = "Total";

    let xAxisData = null;
    let yAxisData = null;
    const limits = null;

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
            .then(() => makeScatterPlot())
       
    }


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

        /*
        legend = d3.select('body')
            .append("svg")
            .append("g")
            .attr("class", "legend")
            .attr("transform", "translate(50,30)")
            .style("font-size", "12px")
            .call(d3.legend);
        setTimeout(function () {
            legend
                .style("font-size", "20px")
                .attr("data-style-padding", 10)
                .call(d3.legend)
        }, 1000)*/


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
// JavaScript source code

/**
 * This example shows how to plot points on a map
 * and how to work with normal geographical data that
 * is not in GeoJSON form
 * 
 * Outline:
 * 1. show how to load multiple files of data 
 * 2. talk about how geoAlbers() is a scaling function
 * 3. show how to plot points with geoAlbers
 */

"use strict";
(function () {
const m = {
    width: 1200,
    height: 1000
}

const svg = d3.select("body").append('svg')
    .attr('width', m.width)
    .attr('height', m.height)

const g = svg.append('g')


// neighborhoods.json taken from rat map example
d3.json('C:\Users\Sohrab\Source\Repos\Rob97.github.io\nygeo.json').then(function (data) {
    console.log("I entered JSON function")
    d3.csv('C:\Users\Sohrab\Source\Repos\Rob97.github.io\data.csv').then(function (pointData) {

        console.log("I entered csv function")

        const aProj = d3.geoAlbers()
            .scale(90000)
            .rotate([73.97237, 0])
            .center([0, 40.64749])
            .translate([m.width / 2, m.height / 2]);

        

        const geoPath = d3.geoPath()
            .projection(aProj)

       

        g.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('fill', '#ccc')
            .attr('d', geoPath)

        // plots circles on the boston map
        g.selectAll('.circle')
            .data(pointData)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                let scaledPoints = albersProj([d['longitude'], d['latitude']])
                return scaledPoints[0]
            })
            .attr('cy', function (d) {
                let scaledPoints = albersProj([d['longitude'], d['latitude']])
                return scaledPoints[1]
            })
            .attr('r', 3)
            .attr('fill', 'steelblue')
            .on("click", function (d) {
                d3.select(this)
                    .attr("opacity", 1)
                    .transition()
                    .duration(1000)
                    .attr("cx", m.width * Math.round(Math.random()))
                    .attr("cy", m.height * Math.round(Math.random()))
                    .attr("opacity", 0)
                    .on("end", function () {
                        d3.select(this).remove();
                    })
            })


    })

})
})();
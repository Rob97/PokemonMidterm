
// for more about line graphs check out this example:
// https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89

/**
 * changes made from linegraph.js:
 * 1. move the code to append div to body to the beginning of the code
 * 2. make a new svg with same dimensions and append it to div variable
 * 3. make new axes and append it to tooltipSvg
 * 4. change svg.append("path").... to tooltipSvg.append("path")
 * 5. make css changes (specified in file)
 */

const margin = {top: 50, right: 50, bottom: 50, left: 50}
, width = 800 - margin.left - margin.right // Use the window's width 
, height = 600 - margin.top - margin.bottom // Use the window's height

const marginTooltip = {top: 50, right: 50, bottom: 50, left: 100}
, widthTooltip = 400 - margin.left - margin.right // Use the window's width 
, heightTooltip = 300 - margin.top - margin.bottom // Use the window's height

// load data
d3.csv('C:\Users\Sohrab\Source\Repos\Rob97.github.io\gapminder.csv').then((allData) => {
    console.log(allData)
    // append the div which will be the tooltip
    // append tooltipSvg to this div
    const div = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .attr('width', 400)
        .attr('height', 300)
        .style('opacity', 0)

    // make an svg and append it to body
    const svg = d3.select('body').append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    //make a tool tip svg and append to div
    const tooltipSvg = div.append("svg")
        .attr('width', widthTooltip + marginTooltip.left + marginTooltip.right)
        .attr('height', heightTooltip + marginTooltip.top + marginTooltip.bottom)



    // get only data for USA
    var usaData = allData.filter(d => d['country'] === "United States");
    

        // 1980 data = allData.filter(d => d['year'] == "1980")

    //WONT LOG DATA
    console.log(usaData)

    // get year min and max for us
    const yearLimits = d3.extent(data, d => d['fertility'])

    

    // get scaling function for years (x axis)
    const xScale = d3.scaleLinear()
        .domain([yearLimits[0], yearLimits[1]])
        .range([margin.left, width + margin.left])

    
    // make x axis
    const xAxis = svg.append("g")
        .attr("transform", "translate(0," + (height + margin.top) + ")")
        .call(d3.axisBottom(xScale))

  
    // get min and max life expectancy for United States
    const lifeExpectancyLimits = d3.extent(usaData, d => d['life_expectancy']) 

    // get scaling function for y axis
    const yScale = d3.scaleLinear()
        .domain([lifeExpectancyLimits[1], lifeExpectancyLimits[0]])
        .range([margin.top, margin.top + height])

    // make y axis
    const yAxis = svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(yScale))

   
    
  

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            if (parseInt(d["population"]) > 100000000) {
                return d['country']
            }
        })
        .attr("x", function(d) {
            return xScale(d['fertility'])+2;  // Returns scaled location of x
        })
        .attr("y", function(d) {
            return yScale(d['life_expectancy']);  // Returns scaled circle y
        })
        .attr("font-size", "16px")  // Font size
        .attr("fill", "black");
    

})
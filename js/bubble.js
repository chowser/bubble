$(document).ready(function(){
// max size of the chart
var diameter = 1000

// set packing Algorithm
// https://github.com/d3/d3-3.x-api-reference/blob/master/Pack-Layout.md#sort
var bubble = d3.layout.pack()
.size([diameter, diameter])
.padding(5)
.sort(null) // disable layout sorting - makes chart look better

var svg = d3.select("#chart")
.append("svg")
.attr("width", diameter)
.attr("height", diameter)
.attr("class", "bubble")
.style("fill", "white")

var nodes,bubbles,loadedData
var selectionMale = $("#btnMale").prop('checked')
var selectionFemale = $("#btnMale").prop('checked')
var selectionDropdown = $("#inputNumber").val()

// load and process data from csv
d3.csv("data/babynames.csv", function(data) {
   //convert numerical values from strings to numbers
   data = data.map(function(d){
      d.value = +d.count
      return d
   }) // end data.map()

   // add color data
   data = data.map(function(d){
      if(d.gender == "M"){
         d.color = "#42d7f4" // blue
         return d
      }
      else if(d.gender == "F"){
         d.color = "#f780dd" // pink
         return d
      }
   })  //end data.map()

   loadedData = data
}) // end d3.csv()

// Fisher Yates Sort Algorithm
// https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
   var m = array.length, t, i
   // while there remain elements to shuffle
   while (m) {
      // pick a remaining element
      i = Math.floor(Math.random() * m--)
      // swap it with the current element
      t = array[m]
      array[m] = array[i]
      array[i] = t
   }
   return array
} // end shuffle

function sortByName(array){
   array.sort(function(a,b){
      var nameA = a.name.toUpperCase() // ignore upper and lowercase
      var nameB = b.name.toUpperCase() // ignore upper and lowercase
      if (nameA < nameB) {
         return -1
      }
      if (nameA > nameB) {
         return 1
      }
      // names must be equal
      return 0
   })
   return array
}

function filter(data){
   var maleArray = data.filter(function(d){
      if(selectionMale){
         return d.gender == "M"
      }
   })

   var femaleArray = data.filter(function(d){
      if(selectionFemale){
         return d.gender == "F"
      }
   })

   if(selectionDropdown == "top10"){
      maleArray = maleArray.slice(0,10)
      femaleArray = femaleArray.slice(0,10)
   }

   else if(selectionDropdown == "top50"){
      maleArray = maleArray.slice(0,50)
      femaleArray = femaleArray.slice(0,50)
   }

   else if(selectionDropdown == "top100"){
      maleArray = maleArray.slice(0,100)
      femaleArray = femaleArray.slice(0,100)
   }

   else if(selectionDropdown == "bottom10"){
      maleArray = maleArray.slice(maleArray.length
         - 10,maleArray.length - 1)
      femaleArray = femaleArray.slice(femaleArray.length
         - 10,femaleArray.length - 1)
   }

   else if(selectionDropdown == "bottom50"){
      maleArray = maleArray.slice(maleArray.length
         - 50,maleArray.length - 1)
      femaleArray = femaleArray.slice(femaleArray.length
         - 50,femaleArray.length - 1)
   }

   else if(selectionDropdown == "bottom100"){
      maleArray = maleArray.slice(maleArray.length
         - 100,maleArray.length - 1)
      femaleArray = femaleArray.slice(femaleArray.length
         - 100,femaleArray.length - 1)
   }

   var mergedArray = sortByName(maleArray.concat(femaleArray))

   return mergedArray
} // end filter()

function draw(data){
   // create bubble nodes
   nodes = bubble.nodes({children:data})

   // setup the chart
   bubbles = svg.append("g")
   .attr("transform", "translate(0,0)")
   .selectAll(".bubble")
   .data(nodes)
   .enter()

   // create the bubbles
   bubbles.append("circle")
   .attr("r", function(d){ return d.r })
   .attr("cx", function(d){ return d.x })
   .attr("cy", function(d){ return d.y })
   .style("fill", function(d){ return d.color })
   .append("title").text(function(d){
      return "Name: " + d.name + "\n" + "Count: " + d.count
   })

   // format the text for each bubble
   bubbles.append("text")
   .attr("x", function(d){ return d.x })
   .attr("y", function(d){ return d.y + 5 })
   .attr("text-anchor", "middle")
   .text(function(d){ return d.name })
   .style({
      "fill":"black",
      "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
      "font-size": "14px" })
   } // end draw()

   // attach event handlers to form
   $("#btnMale").change(function(){
      selectionMale = $(this).prop('checked')
   }) // end change()

   $("#btnFemale").change(function(){
      selectionFemale = $(this).prop('checked')
   }) // end change()

   $("#inputNumber").change(function(){
      selectionDropdown = $("#inputNumber").val()
   }) // end change()

   $("#btnDraw").click(function(){
      if(selectionMale || selectionFemale){
         finalData = shuffle(filter(loadedData))
         draw(finalData)
      }
      else{
         alert("You must select a gender.")
      }
   }) // end click()
}) // end $(document).ready()

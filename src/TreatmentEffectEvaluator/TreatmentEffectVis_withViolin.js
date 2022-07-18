import React, {useRef, useState, useEffect} from 'react';
import regression from 'regression';
import * as d3 from 'd3';

export const TreatmentEffectVisViolin = ({allData={}, index=0, treatment="treatment", outcome="outcome", effect="effect", isBinary}) => {

	const ref = useRef('svgTreatmentEffect');

  let svg = d3.select(`#svgTreatmentEffect${index}`);

  let svgElement = svg.select("g");

  // Track color map
  const [colorMap, setColorMap] = React.useState({1: "#4e79a7",
                                                  0: "#f28e2b"});

  const [cohortData, setCohortData] = React.useState([]);
  const [stratifyBy, setStratifyBy] = React.useState("");
  // const [isBinary, setIsBinary] = React.useState(false);
  const [plotTitle, setPlotTitle] = React.useState("");
  const [layout, setLayout] = React.useState({"height": 500, "width": 600, "margin": 50, "marginLeft": 50});
  const [treatmentReg, setTreatmentReg] = React.useState([[0, 0], [0, 0]]);
  const [controlReg, setControlReg] = React.useState([[0, 0], [0, 0]]);
  const [treatmentBins, setTreatmentBins] = React.useState([]);
  const [controlBins, setControlBins] = React.useState([]);
  const [stratifiedBins, setStratifiedBins] = React.useState([]);

  const bins = 20;

  useEffect(() => {
  	let cohortData = allData["data"];
  	let stratifyBy = allData["stratifyBy"];
  	// let isBinary = (new Set(cohortData.map(d => d[stratifyBy]))).size <= 2;

  	setCohortData(cohortData);
  	setStratifyBy(stratifyBy);
  	// setIsBinary(isBinary);
  	setPlotTitle(allData["title"]);
  	setLayout(allData["layout"]);

  	let treatmentData = cohortData.filter(d => d[treatment] === 1);
	  let controlData = cohortData.filter(d => d[treatment] === 0);

  	if (isBinary) {
  		// If the variable is binary, perform binning for violin plot
	  	var histogram = d3.histogram()
	                      .value(d => d[effect])
	                      .domain(d3.extent(cohortData, d => d[effect]))
	                      .thresholds(bins);

	    let stratify0 = cohortData.filter(d => d[stratifyBy] === 0);
	    let stratify1 = cohortData.filter(d => d[stratifyBy] === 1);

	    setStratifiedBins([histogram(stratify0), histogram(stratify1)]);

  		let treatmentStratify0 = treatmentData.filter(d => d[stratifyBy] === 0);
  		let treatmentStratify1 = treatmentData.filter(d => d[stratifyBy] === 1);
  		let controlStratify0 = controlData.filter(d => d[stratifyBy] === 0);
  		let controlStratify1 = controlData.filter(d => d[stratifyBy] === 1);

  		let newTreatmentBins = [histogram(treatmentStratify0), histogram(treatmentStratify1)];
  		let newControlBins = [histogram(controlStratify0), histogram(controlStratify1)];

  		// console.log(newTreatmentBins, newControlBins)

  		setTreatmentBins(newTreatmentBins);
  		setControlBins(newControlBins);
  	} else {
  		// If variable is continous, calculate the regression line for treatment and control groups separately
	  	let treatmentLine = regression.linear(treatmentData.map(d => [d[stratifyBy], d[effect]]));
	  	let controlLine = regression.linear(controlData.map(d => [d[stratifyBy], d[effect]]));

	  	let extent = d3.extent(cohortData, d => d[stratifyBy]);

	  	let treatmentStart = treatmentLine.predict(extent[0]);
	  	let treatmentEnd = treatmentLine.predict(extent[1]);

	  	let controlStart = controlLine.predict(extent[0]);
	  	let controlEnd = controlLine.predict(extent[1]);

	  	setTreatmentReg([treatmentStart, treatmentEnd]);
	  	setControlReg([controlStart, controlEnd]);
  	}

  }, [allData])

  useEffect(() => {

  	let jitter = 15;

  	if (isBinary) {
  		// If variable is binary, visualize violin plots of distribution
  		var xScale = d3.scaleBand()
  				.domain([0, 1])
  				.range([layout.marginLeft, layout.width - layout.margin])

  		var yScale = d3.scaleLinear()
          .domain(d3.extent(cohortData, d => d[effect]))
          .range([layout.height - layout.marginBottom, layout.margin])

  		let computedBandwidth = xScale.bandwidth();
  		let customBandwidth = layout.width / 8;

  		let binScales = [];

  		// Define scales separately to normalize the violin plots by size of the subgroup
  		for (let b of stratifiedBins) {
  			let totalLength = b.reduce((count, current) => count + current.length, 0);

  			let maxNum = d3.max(b.map(d => d.length / totalLength));
  			let newScale = d3.scaleLinear()
								  				.range([0, computedBandwidth])
								    			.domain([-maxNum, maxNum])
				binScales.push({"scale": newScale, "len":totalLength});
  		}

    	for (let i = 0; i < stratifiedBins.length; i++) {
    		let binData = stratifiedBins[i];
    		let binScale = binScales[i].scale;
    		let binSize = binScales[i].len;

    		svgElement.select("#violin")
    			.selectAll(`.area${i}`)
			    .data([binData])
			    .join("path")
			    .attr("class", `area${i}`)
			    .attr("transform", `translate(${xScale(i)}, 0)`)
			    .datum(function(d){ return(d)})
			    .style("stroke", "none")
		        .style("fill", colorMap[1])
		        .attr("d", d3.area()
		            .x0(function(d){ return(binScale(-d.length / binSize)) } )
		            .x1(function(d){ return(binScale(d.length / binSize)) } )
		            .y(function(d){ return(yScale(d.x0)) } )
		            .curve(d3.curveCatmullRom)
		        )
    	}

    // 	let controlScales = [];

  		// for (let cb of controlBins) {
  		// 	let totalLength = cb.reduce((count, current) => count + current.length, 0);

  		// 	let maxNum = d3.max(cb.map(d => d.length / totalLength));
  		// 	let newScale = d3.scaleLinear()
				// 				  				.range([0, computedBandwidth / 2])
				// 				    			.domain([-maxNum, maxNum])
				// controlScales.push({"scale": newScale, "len":totalLength});
  		// }

    // 	for (let i = 0; i < controlBins.length; i++) {
    // 		let binData = controlBins[i];
    // 		let binScale = controlScales[i].scale;
    // 		let binSize = controlScales[i].len;

    // 		svgElement.select("#violin")
    // 			.selectAll(`.controlArea${i}`)
			 //    .data([binData])
			 //    .join("path")
			 //    .attr("class", `controlArea${i}`)
			 //    .attr("transform", `translate(${xScale(i) + computedBandwidth / 2}, 0)`)
			 //    .datum(function(d){ return(d)})
			 //    .style("stroke", "none")
		  //       .style("fill", colorMap[0])
		  //       .attr("d", d3.area()
		  //           .x0(function(d){ return(binScale(-d.length / binSize)) } )
		  //           .x1(function(d){ return(binScale(d.length / binSize)) } )
		  //           .y(function(d){ return(yScale(d.x0)) } )
		  //           .curve(d3.curveCatmullRom)
		  //       )
    // 	}

  		let xAxis = svgElement.select('#x-axis')
	            .attr('transform', `translate(0, ${layout.height - layout.marginBottom})`)
	            .call(d3.axisBottom(xScale).tickSize(3).ticks(5))

  	} else {
  		// If variable is not binary, visualize each data instance and outcome with regression line

  		var xScale = d3.scaleLinear()
          .domain(d3.extent(cohortData, d => d[stratifyBy]))
          .range([layout.marginLeft, layout.width - layout.margin])

      var yScale = d3.scaleLinear()
          .domain(d3.extent(cohortData, d => d[effect]))
          .range([layout.height - layout.marginBottom, layout.margin])

	    let effects = svgElement.select("#effects")
	      .selectAll(".effectCircles")
	      .data(cohortData)
	      .join("circle")
	      .attr("class", "effectCircles")
	      .attr("cx", d => xScale(d[stratifyBy]) + (Math.random() - 0.5) * jitter)
	      .attr("cy", d => yScale(d[effect]))
	      .attr("r", 3)
	      .attr("fill", "steelblue")
	      // .attr("stroke", d => colorMap[d[treatment]])
	      .attr("cursor", "pointer")

	    // let regressionLines = svgElement.select("#regression")
	    //   .selectAll(".regressionLine")
	    //   .data([treatmentReg, controlReg])
	    //   .join("line")
	    //   .attr("class", "regressionLine")
	    //   .attr("x1", d => xScale(d[0][0]))
	    //   .attr("y1", d => yScale(d[0][1]))
	    //   .attr("x2", d => xScale(d[1][0]))
	    //   .attr("y2", d => yScale(d[1][1]))
	    //   .attr("stroke", "black")

	    let xAxis = svgElement.select('#x-axis')
	            .attr('transform', `translate(0, ${layout.height - layout.marginBottom})`)
	            .call(d3.axisBottom(xScale).tickSize(3).ticks(5))
	  	}

	  	svgElement.select('#x-axis')
		    	.selectAll("#axis-title")
		    	.data([stratifyBy])
		    	.join("text")
		    	.attr("id", "axis-title")
		    	.attr("x", layout.width / 2)
		    	.attr("y", 30)
		    	.attr("text-anchor", "middle")
		    	.attr("fill", "black")
		    	.attr("font-size", "15px")
		    	.text(d => d)

		  svgElement.select('#y-axis')
		    	.selectAll("#axis-title")
		    	.data(["effect"])
		    	.join("text")
		    	.attr("id", "axis-title")
		    	.attr("text-anchor", "middle")
		    	.attr("transform", `translate(${layout.marginLeft - 5}, ${layout.height / 2}) rotate(-90)`)
		    	.attr("fill", "black")
		    	.attr("font-size", "15px")
		    	.text(d => d)

	  	d3.selectAll("#x-axis>.tick>text")
			  .each(function(d, i){
			    d3.select(this).style("font-size","12px");
			  });

	  	let yAxis = svgElement.select('#y-axis')
		            .attr('transform', `translate(${layout.marginLeft}, 0)`)
		            .call(d3.axisLeft(yScale).tickSize(3).ticks(5))

			d3.selectAll("#y-axis>.tick>text")
			  .each(function(d, i){
			    d3.select(this).style("font-size","12px");
			  });

  	}, [cohortData, stratifyBy, isBinary, layout, treatmentBins, controlBins])

  let subplotStyle = {"display": "flex", "flexDirection":"column", "alignItems":"center"};
  let subplotTitle = {"fontFamily": "sans-serif", "marginTop": "15px", "marginBottom": "0px", "fontSize":"15px"};

  return (
    <div style={subplotStyle}>
    	{/*<p style={subplotTitle}>{plotTitle}</p>*/}
      <svg width={layout.width} height={layout.height} id={`svgTreatmentEffect${index}`}>
        <g>
        	<g id="x-axis" />
          <g id="y-axis" />
          <g id="effects" />
          <g id="regression" />
          <g id="violin" />
          <g id="title" />
        </g>
      </svg>
    </div>
  )
}
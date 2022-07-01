import React, {useRef, useState, useEffect} from 'react';
import regression from 'regression';
import * as d3 from 'd3';

export const TreatmentEffectVisViolin = ({allData={}, index=0, treatment="treatment", outcome="outcome"}) => {

	const ref = useRef('svgTreatmentEffect');

  let svg = d3.select(`#svgTreatmentEffect${index}`);

  let svgElement = svg.select("g");

  // Track color map
  const [colorMap, setColorMap] = React.useState({1: "#4e79a7",
                                                  0: "#f28e2b"});
  // const transitionDuration = 750;

  const [cohortData, setCohortData] = React.useState([]);
  const [stratifyBy, setStratifyBy] = React.useState("");
  const [isBinary, setIsBinary] = React.useState(false);
  const [plotTitle, setPlotTitle] = React.useState("");
  const [layout, setLayout] = React.useState({"height": 500, "width": 600, "margin": 50, "marginLeft": 50});
  const [treatmentReg, setTreatmentReg] = React.useState([[0, 0], [0, 0]]);
  const [controlReg, setControlReg] = React.useState([[0, 0], [0, 0]]);
  const [treatmentBins, setTreatmentBins] = React.useState([]);
  const [controlBins, setControlBins] = React.useState([]);

  const bins = 20;

  // function getIQR(dataset, tr, st) {

  // 	let Q1 = d3.quantile(dataset, 0.25, d => d[outcome]);
  // 	let Q2 = d3.quantile(dataset, 0.5, d => d[outcome]);
  // 	let Q3 = d3.quantile(dataset, 0.75, d => d[outcome]);

  // 	let IQR = Q3 - Q1;
  // 	let IQRMin = Q1 - 1.5 * IQR;
  // 	let IQRMax = Q3 + 1.5 * IQR;

  // 	let outliers = dataset.filter(d => d[outcome] < IQRMin || d[outcome] > IQRMax)

  // 	return {"treatment": tr,
  // 					"stratify": st,
  // 					"Q1": Q1,
  // 					"Q2": Q2,
  // 					"Q3": Q3,
  // 					"IQR": IQR,
  // 					"IQRMin": IQRMin,
  // 					"IQRMax": IQRMax,
  // 					"outliers": outliers}
  // }

  useEffect(() => {
  	let cohortData = allData["data"];
  	let stratifyBy = allData["stratifyBy"];
  	let isBinary = (new Set(cohortData.map(d => d[stratifyBy]))).size === 2;

  	setCohortData(cohortData);
  	setStratifyBy(stratifyBy);
  	setIsBinary(isBinary);
  	setPlotTitle(allData["title"]);
  	setLayout(allData["layout"]);

  	let treatmentData = cohortData.filter(d => d[treatment] === 1);
	  let controlData = cohortData.filter(d => d[treatment] === 0);

  	if (isBinary) {
	  	var histogram = d3.histogram()
	                      .value(d => d[outcome])
	                      .domain(d3.extent(cohortData, d => d[outcome]))
	                      .thresholds(bins);

  		let treatmentStratify0 = treatmentData.filter(d => d[stratifyBy] === 0);
  		let treatmentStratify1 = treatmentData.filter(d => d[stratifyBy] === 1);
  		let controlStratify0 = controlData.filter(d => d[stratifyBy] === 0);
  		let controlStratify1 = controlData.filter(d => d[stratifyBy] === 1);

  		let newTreatmentBins = [histogram(treatmentStratify0), histogram(treatmentStratify1)];
  		let newControlBins = [histogram(controlStratify0), histogram(controlStratify1)];

  		console.log(newTreatmentBins, newControlBins)

  		setTreatmentBins(newTreatmentBins);
  		setControlBins(newControlBins);
  	} else {
	  	let treatmentLine = regression.linear(treatmentData.map(d => [d[stratifyBy], d[outcome]]));
	  	let controlLine = regression.linear(controlData.map(d => [d[stratifyBy], d[outcome]]));

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

  	let jitter = 15

  	if (isBinary) {
  		var xScale = d3.scaleBand()
  				.domain([0, 1])
  				.range([layout.marginLeft, layout.width - layout.margin])

  		// let yMin = d3.min([d3.min(treatmentIQR, d => d.IQRMin), d3.min(controlIQR, d => d.IQRMin), d3.min(cohortData, d => d[outcome])]);

  		var yScale = d3.scaleLinear()
          .domain(d3.extent(cohortData, d => d[outcome]))
          .range([layout.height - layout.marginBottom, layout.margin])

  		let computedBandwidth = xScale.bandwidth();
  		let customBandwidth = layout.width / 8;

  		// let allBins = treatmentBins.concat(controlBins);
  		// let maxNum = 0;

  		let treatmentScales = [];

  		for (let tb of treatmentBins) {
  			let totalLength = tb.reduce((count, current) => count + current.length, 0);

  			let maxNum = d3.max(tb.map(d => d.length / totalLength));
  			let newScale = d3.scaleLinear()
								  				.range([0, computedBandwidth / 2])
								    			.domain([-maxNum, maxNum])
				treatmentScales.push({"scale": newScale, "len":totalLength});
  		}

  		// for (let b of allBins) {
  		// 	let currentMax = d3.max(b, d => d.length);
  		// 	if (currentMax > maxNum) { maxNum = currentMax };
  		// }

  		// var violinScale = d3.scaleLinear()
  		// 		.range([0, computedBandwidth / 2])
    // 			.domain([-maxNum,maxNum])

    	for (let i = 0; i < treatmentBins.length; i++) {
    		let binData = treatmentBins[i];
    		let binScale = treatmentScales[i].scale;
    		let binSize = treatmentScales[i].len;

    		svgElement.select("#violin")
    			.selectAll(`.treatmentArea${i}`)
			    .data([binData])
			    .join("path")
			    .attr("class", `treatmentArea${i}`)
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

    	let controlScales = [];

  		for (let cb of controlBins) {
  			let totalLength = cb.reduce((count, current) => count + current.length, 0);

  			let maxNum = d3.max(cb.map(d => d.length / totalLength));
  			let newScale = d3.scaleLinear()
								  				.range([0, computedBandwidth / 2])
								    			.domain([-maxNum, maxNum])
				controlScales.push({"scale": newScale, "len":totalLength});
  		}

    	for (let i = 0; i < controlBins.length; i++) {
    		let binData = controlBins[i];
    		let binScale = controlScales[i].scale;
    		let binSize = controlScales[i].len;

    		svgElement.select("#violin")
    			.selectAll(`.controlArea${i}`)
			    .data([binData])
			    .join("path")
			    .attr("class", `controlArea${i}`)
			    .attr("transform", `translate(${xScale(i) + computedBandwidth / 2}, 0)`)
			    .datum(function(d){ return(d)})
			    .style("stroke", "none")
		        .style("fill", colorMap[0])
		        .attr("d", d3.area()
		            .x0(function(d){ return(binScale(-d.length / binSize)) } )
		            .x1(function(d){ return(binScale(d.length / binSize)) } )
		            .y(function(d){ return(yScale(d.x0)) } )
		            .curve(d3.curveCatmullRom)
		        )
    	}

    	// svgElement.selectAll("violin")
		   //  .data(treatmentBins)
		   //  .join("g")
		   //    .attr("transform", function(d, i){ return(`translate(${xScale(i)}, 0)`) } )
		   //  .append("path")
		   //      .datum(function(d){ return(d)})
		   //      .style("stroke", "none")
		   //      .style("fill", colorMap[1])
		   //      .attr("d", d3.area()
		   //          .x0(function(d){ return(violinScale(0)) } )
		   //          .x1(function(d){ return(violinScale(d.length)) } )
		   //          .y(function(d){ return(yScale(d.x0)) } )
		   //          .curve(d3.curveCatmullRom)
		   //      )

		  // svgElement.selectAll("violin")
		  //   .data(controlBins)
		  //   .join("g")
		  //     .attr("transform", function(d, i){ return(`translate(${xScale(i) + computedBandwidth / 2}, 0)`) } )
		  //   .append("path")
		  //       .datum(function(d){ return(d)})
		  //       .style("stroke", "none")
		  //       .style("fill", colorMap[0])
		  //       .attr("d", d3.area()
		  //           .x0(function(d){ return(violinScale(0)) } )
		  //           .x1(function(d){ return(violinScale(d.length)) } )
		  //           .y(function(d){ return(yScale(d.x0)) } )
		  //           .curve(d3.curveCatmullRom)
		  //       )

		  // let treatmentData = cohortData.filter(d => d[treatment] === 1);
	  	// let controlData = cohortData.filter(d => d[treatment] === 0);

		  // let treatmentOutcomes = svgElement.select("#outcomes")
	   //    .selectAll(".treatmentCircles")
	   //    .data(treatmentData)
	   //    .join("circle")
	   //    .attr("class", "treatmentCircles")
	   //    .attr("cx", function (d, i) {return xScale(d[stratifyBy]) + computedBandwidth / 8 + (Math.random() - 0.5) * jitter})
	   //    .attr("cy", d => yScale(d[outcome]))
	   //    .attr("r", 3)
	   //    .attr("fill", "none")
	   //    .attr("stroke", d => colorMap[1])
	   //    .attr("cursor", "pointer")

	   //  let controlOutcomes = svgElement.select("#outcomes")
	   //    .selectAll(".controlCircles")
	   //    .data(controlData)
	   //    .join("circle")
	   //    .attr("class", "controlCircles")
	   //    .attr("cx", function (d, i) {return xScale(d[stratifyBy]) + computedBandwidth / 8 * 5 + (Math.random() - 0.5) * jitter})
	   //    .attr("cy", d => yScale(d[outcome]))
	   //    .attr("r", 3)
	   //    .attr("fill", "none")
	   //    .attr("stroke", d => colorMap[0])
	   //    .attr("cursor", "pointer")

  		let xAxis = svgElement.select('#x-axis')
	            .attr('transform', `translate(0, ${layout.height - layout.marginBottom})`)
	            .call(d3.axisBottom(xScale).tickSize(3).ticks(5))

  	} else {
  		var xScale = d3.scaleLinear()
          .domain(d3.extent(cohortData, d => d[stratifyBy]))
          .range([layout.marginLeft, layout.width - layout.margin])

      var yScale = d3.scaleLinear()
          .domain(d3.extent(cohortData, d => d[outcome]))
          .range([layout.height - layout.marginBottom, layout.margin])

	    let outcomes = svgElement.select("#outcomes")
	      .selectAll(".outcomeCircles")
	      .data(cohortData)
	      .join("circle")
	      .attr("class", "outcomeCircles")
	      .attr("cx", d => xScale(d[stratifyBy]) + (Math.random() - 0.5) * jitter)
	      .attr("cy", d => yScale(d[outcome]))
	      .attr("r", 3)
	      .attr("fill", "none")
	      .attr("stroke", d => colorMap[d[treatment]])
	      .attr("cursor", "pointer")

	    let regressionLines = svgElement.select("#regression")
	      .selectAll(".regressionLine")
	      .data([treatmentReg, controlReg])
	      .join("line")
	      .attr("class", "regressionLine")
	      .attr("x1", d => xScale(d[0][0]))
	      .attr("y1", d => yScale(d[0][1]))
	      .attr("x2", d => xScale(d[1][0]))
	      .attr("y2", d => yScale(d[1][1]))
	      .attr("stroke", "black")

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
		    	.data(["outcome"])
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
          <g id="outcomes" />
          <g id="regression" />
          <g id="violin" />
          <g id="title" />
        </g>
      </svg>
    </div>
  )
}
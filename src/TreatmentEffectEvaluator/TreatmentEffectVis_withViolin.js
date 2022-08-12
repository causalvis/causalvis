import React, {useRef, useState, useEffect} from 'react';
import regression from 'regression';
import * as d3 from 'd3';

export const TreatmentEffectVisViolin = ({allData={}, index=0, treatment="treatment", outcome="outcome", effect="effect", effectExtent=[0, 0], isBinary}) => {
	const ref = useRef('svgTreatmentEffect');

  let svgElement = d3.select(ref.current);

  // Track color map
  const [colorMap, setColorMap] = React.useState({1: "#698fb8",
                                                  0: "#f0a856"});

  const [cohortData, setCohortData] = React.useState([]);
  const [stratifyBy, setStratifyBy] = React.useState("");
  const [plotTitle, setPlotTitle] = React.useState("");
  const [layout, setLayout] = React.useState({"height": 500, "width": 600, "margin": 50, "marginLeft": 50, "marginBottom": 35});
  const [treatmentReg, setTreatmentReg] = React.useState([[0, 0], [0, 0]]);
  const [controlReg, setControlReg] = React.useState([[0, 0], [0, 0]]);
  
  const [cohortBins, setCohortBins] = React.useState([]);
  const [controlBins, setControlBins] = React.useState([]);
  const [treatmentBins, setTreatmentBins] = React.useState([]);

  const [stratifiedBins, setStratifiedBins] = React.useState([]);

  const bins = 20;

  useEffect(() => {

  	let cohortData = allData["data"];
  	let stratifyBy = allData["stratifyBy"];

  	setCohortData(cohortData);
  	setStratifyBy(stratifyBy);
  	setPlotTitle(allData["title"]);
  	setLayout(allData["layout"]);

  	let treatmentData = cohortData.filter(d => d[treatment] === 1);
	  let controlData = cohortData.filter(d => d[treatment] === 0);

	  if (!stratifyBy) {
	  	let adjustedBandwidth = (effectExtent[1] - effectExtent[0]) / bins;
	  	let adjustedExtent = [effectExtent[0] - adjustedBandwidth, effectExtent[1] + adjustedBandwidth];

	  	var histogram = d3.histogram()
	                      .value(d => d[effect])
	                      .domain(adjustedExtent)
	                      .thresholds(bins + 2);

	    let cohortBins = histogram(cohortData);

	    setCohortBins(cohortBins);

	  } else if (isBinary) {
	  	let adjustedBandwidth = (effectExtent[1] - effectExtent[0]) / bins;
	  	let adjustedExtent = [effectExtent[0] - adjustedBandwidth, effectExtent[1] + adjustedBandwidth];

  		// If the variable is binary, perform binning for violin plot
	  	var histogram = d3.histogram()
	                      .value(d => d[effect])
	                      .domain(adjustedExtent)
	                      .thresholds(bins + 2);

	    let stratify0 = cohortData.filter(d => d[stratifyBy] === 0);
	    let stratify1 = cohortData.filter(d => d[stratifyBy] === 1);

	    setStratifiedBins([histogram(stratify0), histogram(stratify1)]);
  	} else {

  	}

  }, [allData])

  function getIQR(dataset) {

  	let Q1 = d3.quantile(dataset, 0.25, d => d);
  	let Q2 = d3.quantile(dataset, 0.5, d => d);
  	let Q3 = d3.quantile(dataset, 0.75, d => d);

  	let IQR = Q3 - Q1;
  	let IQRMin = Q1 - 1.5 * IQR;
  	let IQRMax = Q3 + 1.5 * IQR;

  	let outliers = dataset.filter(d => d < IQRMin || d > IQRMax)

  	return {"Q1": Q1,
  					"Q2": Q2,
  					"Q3": Q3,
  					"IQR": IQR,
  					"IQRMin": IQRMin,
  					"IQRMax": IQRMax,
  					"outliers": outliers}
  }

  useEffect(() => {

  	let jitter = 15;

  	if (stratifyBy === '') {

  		var xScale = d3.scaleBand()
  				.domain([0, 0])
  				.range([layout.marginLeft, layout.width - layout.margin])

  		var yScale = d3.scaleLinear()
          .domain(effectExtent)
          .range([layout.height - layout.marginBottom, layout.margin])

  		let computedBandwidth = xScale.bandwidth();
  		let customBandwidth = layout.width / 8;

			let totalLength = cohortBins.reduce((count, current) => count + current.length, 0);

			let maxNum = d3.max(cohortBins.map(d => d.length / totalLength));

			let newScale = d3.scaleLinear()
							  				.range([0, computedBandwidth])
							    			.domain([-maxNum, maxNum])

  		let binData = cohortBins;
  		let binScale = newScale;
  		let binSize = totalLength;

  		let binEffects = [];

  		for (let g of binData) {
  			binEffects = binEffects.concat(g.map(d => d.effect));
  		}

  		let binStats = getIQR(binEffects);

  		svgElement.select("#violin")
  			.selectAll(`.areacohort`)
		    .data([binData])
		    .join("path")
		    .attr("class", `areacohort`)
		    .attr("transform", `translate(${xScale(0)}, 0)`)
		    .datum(function(d){ return(d)})
		    .style("stroke", "none")
	        .style("fill", colorMap[1])
	        .attr("d", d3.area()
	            .x0(function(d){ return(binScale(0)) } )
	            .x1(function(d){ return(binScale(d.length / binSize)) } )
	            .y(function(d){ return(yScale(d.x0)) } )
	            .curve(d3.curveCatmullRom)
	        )

	    svgElement.select("#violin")
	    	.selectAll(`.pointcohort`)
	    	.data(binEffects)
	    	.join("circle")
	    	.attr("class", `pointcohort`)
	    	.attr("cx", d => {
	    		return xScale(0) + computedBandwidth / 4 + (Math.random() - 0.5) * jitter;
	    	})
	    	.attr("cy", d => yScale(d))
	    	.attr("r", 3)
	    	.attr("opacity", 0.2)
	    	.attr("fill", colorMap[1])

	    svgElement.select("#IQR")
	    	.selectAll(`.boxplotcohort`)
	    	.data([binStats])
	    	.join("rect")
	    	.attr("class", `boxplotcohort`)
	    	.attr("x", xScale(0) + computedBandwidth / 4 - 15)
	    	.attr("y", d => yScale(d.Q3))
	    	.attr("width", 30)
	    	.attr("height", d => yScale(d.Q1) - yScale(d.Q3))
	    	.attr("fill", "none")
	    	.attr('stroke', "black")

	    svgElement.select("#IQR")
	    	.selectAll(`.boxmediancohort`)
	    	.data([binStats])
	    	.join("line")
	    	.attr("class", `boxmediancohort`)
	    	.attr("x1", xScale(0) + computedBandwidth / 4 - 15)
	    	.attr("y1", d => yScale(d.Q2))
	    	.attr("x2", xScale(0) + computedBandwidth / 4 + 15)
	    	.attr("y2", d => yScale(d.Q2))
	    	.attr("fill", "none")
	    	.attr('stroke', "black")

	    svgElement.select("#IQR")
	    	.selectAll(`.whiskerTopcohort`)
	    	.data([binStats])
	    	.join("line")
	    	.attr("class", `whiskerTopcohort`)
	    	.attr("x1", xScale(0) + computedBandwidth / 4)
	    	.attr("y1", d => yScale(d.IQRMax))
	    	.attr("x2", xScale(0) + computedBandwidth / 4)
	    	.attr("y2", d => yScale(d.Q3))
	    	.attr("fill", "none")
	    	.attr('stroke', "black")

	    svgElement.select("#IQR")
	    	.selectAll(`.whiskerBottomcohort`)
	    	.data([binStats])
	    	.join("line")
	    	.attr("class", `whiskerBottomcohort`)
	    	.attr("x1", xScale(0) + computedBandwidth / 4)
	    	.attr("y1", d => yScale(d.Q1))
	    	.attr("x2", xScale(0) + computedBandwidth / 4)
	    	.attr("y2", d => yScale(d.IQRMin))
	    	.attr("fill", "none")
	    	.attr('stroke', "black")

	    svgElement.select("#IQR")
	    	.selectAll(`.topCapcohort`)
	    	.data([binStats])
	    	.join("line")
	    	.attr("class", `topCapcohort`)
	    	.attr("x1", xScale(0) + computedBandwidth / 4 - 5)
	    	.attr("y1", d => yScale(d.IQRMax))
	    	.attr("x2", xScale(0) + computedBandwidth / 4 + 5)
	    	.attr("y2", d => yScale(d.IQRMax))
	    	.attr("fill", "none")
	    	.attr('stroke', "black")

	    svgElement.select("#IQR")
	    	.selectAll(`.bottomCapcohort`)
	    	.data([binStats])
	    	.join("line")
	    	.attr("class", `bottomCapcohort`)
	    	.attr("x1", xScale(0) + computedBandwidth / 4 - 5)
	    	.attr("y1", d => yScale(d.IQRMin))
	    	.attr("x2", xScale(0) + computedBandwidth / 4 + 5)
	    	.attr("y2", d => yScale(d.IQRMin))
	    	.attr("fill", "none")
	    	.attr('stroke', "black")

	    let xAxis = svgElement.select('#x-axis')
	            .attr('transform', `translate(0, ${layout.height - layout.marginBottom / 2})`)
	            .call(d3.axisBottom(xScale).tickSize(3).ticks(5).tickFormat(d => "cohort"))


  	} else if (isBinary) {
  		// If variable is binary, visualize violin plots of distribution
  		var xScale = d3.scaleBand()
  				.domain([0, 1])
  				.range([layout.marginLeft, layout.width - layout.margin])

  		var yScale = d3.scaleLinear()
          .domain(effectExtent)
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

    		let binEffects = [];

    		for (let g of binData) {
    			binEffects = binEffects.concat(g.map(d => d.effect));
    		}

    		let binStats = getIQR(binEffects);

    		svgElement.select("#violin")
    			.selectAll(`.area${i}`)
			    .data([binData])
			    .join("path")
			    .attr("class", `area${i}`)
			    .attr("transform", `translate(${xScale(i)}, 0)`)
			    .datum(function(d){ return(d)})
			    .style("stroke", "none")
		        .style("fill", colorMap[i])
		        .attr("d", d3.area()
		            .x0(function(d){ return(binScale(0)) } )
		            .x1(function(d){ return(binScale(d.length / binSize)) } )
		            .y(function(d){ return(yScale(d.x0)) } )
		            .curve(d3.curveCatmullRom)
		        )

		    svgElement.select("#violin")
		    	.selectAll(`.point${i}`)
		    	.data(binEffects)
		    	.join("circle")
		    	.attr("class", `point${i}`)
		    	.attr("cx", d => {
		    		return xScale(i) + computedBandwidth / 4 + (Math.random() - 0.5) * jitter;
		    	})
		    	.attr("cy", d => yScale(d))
		    	.attr("r", 3)
		    	.attr("opacity", 0.2)
		    	.attr("fill", colorMap[i])

		    svgElement.select("#IQR")
		    	.selectAll(`.boxplot${i}`)
		    	.data([binStats])
		    	.join("rect")
		    	.attr("class", `boxplot${i}`)
		    	.attr("x", xScale(i) + computedBandwidth / 4 - 15)
		    	.attr("y", d => yScale(d.Q3))
		    	.attr("width", 30)
		    	.attr("height", d => yScale(d.Q1) - yScale(d.Q3))
		    	.attr("fill", "none")
		    	.attr('stroke', "black")

		    svgElement.select("#IQR")
		    	.selectAll(`.boxmedian${i}`)
		    	.data([binStats])
		    	.join("line")
		    	.attr("class", `boxmedian${i}`)
		    	.attr("x1", xScale(i) + computedBandwidth / 4 - 15)
		    	.attr("y1", d => yScale(d.Q2))
		    	.attr("x2", xScale(i) + computedBandwidth / 4 + 15)
		    	.attr("y2", d => yScale(d.Q2))
		    	.attr("fill", "none")
		    	.attr('stroke', "black")

		    svgElement.select("#IQR")
		    	.selectAll(`.whiskerTop${i}`)
		    	.data([binStats])
		    	.join("line")
		    	.attr("class", `whiskerTop${i}`)
		    	.attr("x1", xScale(i) + computedBandwidth / 4)
		    	.attr("y1", d => yScale(d.IQRMax))
		    	.attr("x2", xScale(i) + computedBandwidth / 4)
		    	.attr("y2", d => yScale(d.Q3))
		    	.attr("fill", "none")
		    	.attr('stroke', "black")

		    svgElement.select("#IQR")
		    	.selectAll(`.whiskerBottom${i}`)
		    	.data([binStats])
		    	.join("line")
		    	.attr("class", `whiskerBottom${i}`)
		    	.attr("x1", xScale(i) + computedBandwidth / 4)
		    	.attr("y1", d => yScale(d.Q1))
		    	.attr("x2", xScale(i) + computedBandwidth / 4)
		    	.attr("y2", d => yScale(d.IQRMin))
		    	.attr("fill", "none")
		    	.attr('stroke', "black")

		    svgElement.select("#IQR")
		    	.selectAll(`.topCap${i}`)
		    	.data([binStats])
		    	.join("line")
		    	.attr("class", `topCap${i}`)
		    	.attr("x1", xScale(i) + computedBandwidth / 4 - 5)
		    	.attr("y1", d => yScale(d.IQRMax))
		    	.attr("x2", xScale(i) + computedBandwidth / 4 + 5)
		    	.attr("y2", d => yScale(d.IQRMax))
		    	.attr("fill", "none")
		    	.attr('stroke', "black")

		    svgElement.select("#IQR")
		    	.selectAll(`.bottomCap${i}`)
		    	.data([binStats])
		    	.join("line")
		    	.attr("class", `bottomCap${i}`)
		    	.attr("x1", xScale(i) + computedBandwidth / 4 - 5)
		    	.attr("y1", d => yScale(d.IQRMin))
		    	.attr("x2", xScale(i) + computedBandwidth / 4 + 5)
		    	.attr("y2", d => yScale(d.IQRMin))
		    	.attr("fill", "none")
		    	.attr('stroke', "black")

    	}

  		let xAxis = svgElement.select('#x-axis')
	            .attr('transform', `translate(0, ${layout.height - layout.marginBottom / 2})`)
	            .call(d3.axisBottom(xScale).tickSize(3).ticks(5))

  	} else {
  		// If variable is not binary, visualize each data instance and outcome with regression line

  		var xScale = d3.scaleLinear()
          .domain(allData.stratifyExtent)
          .range([layout.marginLeft, layout.width - layout.margin])

      var yScale = d3.scaleLinear()
          .domain(effectExtent)
          .range([layout.height - layout.marginBottom, layout.margin])

	    let effects = svgElement.select("#effects")
	      .selectAll(".effectCircles")
	      .data(cohortData)
	      .join("circle")
	      .attr("class", "effectCircles")
	      .attr("cx", d => xScale(d[stratifyBy]) + (Math.random() - 0.5) * jitter)
	      .attr("cy", d => yScale(d[effect]))
	      .attr("r", 3)
	      .attr("opacity", 0.2)
	      .attr("fill", "#698fb8")
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
	            .attr('transform', `translate(0, ${layout.height - layout.marginBottom / 2})`)
	            .call(d3.axisBottom(xScale).tickSize(3).ticks(5))
	  	}

	  	if (effectExtent[0] < 0 && effectExtent[1] > 0) {
	  		svgElement.select("#zero")
	        .selectAll(".zeroLine")
	        .data([0])
	        .join("line")
	        .attr("class", "zeroLine")
	        .attr("y1", d => yScale(0))
	        .attr("x1", layout.marginLeft)
	        .attr("y2", d => yScale(0))
	        .attr("x2", layout.width - layout.margin)
	        .attr("stroke", "black")
	        .attr("stroke-dasharray", "5 5 2 5")
	  	}

	  	svgElement.select('#x-axis')
		    	.selectAll("#axis-title")
		    	.data([stratifyBy])
		    	.join("text")
		    	.attr("id", "axis-title")
		    	.attr("x", layout.width / 2)
		    	.attr("y", -10)
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
		    	.attr("transform", `translate(${layout.marginLeft / 2 - 5}, ${layout.height / 2}) rotate(-90)`)
		    	.attr("fill", "black")
		    	.attr("font-size", "15px")
		    	.text(d => d)

	  	d3.selectAll("#x-axis>.tick>text")
			  .each(function(d, i){
			    d3.select(this).style("font-size","10px");
			  });

	  	let yAxis = svgElement.select('#y-axis')
		            .attr('transform', `translate(${layout.marginLeft / 2}, 0)`)
		            .call(d3.axisLeft(yScale).tickSize(3).ticks(5))

			d3.selectAll("#y-axis>.tick>text")
			  .each(function(d, i){
			    d3.select(this).style("font-size","10px");
			  });

  	}, [cohortData, stratifyBy, isBinary, layout, treatmentBins, controlBins, cohortBins])

  let subplotStyle = {"display": "flex", "flexDirection":"column", "alignItems":"center"};
  let subplotTitle = {"fontFamily": "sans-serif", "marginTop": "15px", "marginBottom": "0px", "fontSize":"15px"};

  return (
    <div style={subplotStyle}>
      <svg width={layout.width} height={layout.height} ref={ref} id={`svgTreatmentEffect${index}`}>
        <g>
        	<g id="zero" />
        	<g id="x-axis" />
          <g id="y-axis" />
          <g id="effects" />
          <g id="regression" />
          <g id="violin" />
          <g id="IQR" />
          <g id="title" />
        </g>
      </svg>
    </div>
  )
}
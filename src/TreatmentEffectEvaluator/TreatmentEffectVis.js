import React, {useRef, useState, useEffect} from 'react';
import regression from 'regression';
import * as d3 from 'd3';

export const TreatmentEffectVis = ({allData={}, index=0, treatment="treatment", outcome="outcome"}) => {

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
  const [treatmentIQR, setTreatmentIQR] = React.useState([]);
  const [controlIQR, setControlIQR] = React.useState([]);

  function getIQR(dataset, tr, st) {

  	let Q1 = d3.quantile(dataset, 0.25, d => d[outcome]);
  	let Q2 = d3.quantile(dataset, 0.5, d => d[outcome]);
  	let Q3 = d3.quantile(dataset, 0.75, d => d[outcome]);

  	let IQR = Q3 - Q1;
  	let IQRMin = Q1 - 1.5 * IQR;
  	let IQRMax = Q3 + 1.5 * IQR;

  	let outliers = dataset.filter(d => d[outcome] < IQRMin || d[outcome] > IQRMax)

  	return {"treatment": tr,
  					"stratify": st,
  					"Q1": Q1,
  					"Q2": Q2,
  					"Q3": Q3,
  					"IQR": IQR,
  					"IQRMin": IQRMin,
  					"IQRMax": IQRMax,
  					"outliers": outliers}
  }

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
  		let treatmentStratify0 = treatmentData.filter(d => d[stratifyBy] === 0);
  		let treatmentStratify1 = treatmentData.filter(d => d[stratifyBy] === 1);
  		let controlStratify0 = controlData.filter(d => d[stratifyBy] === 0);
  		let controlStratify1 = controlData.filter(d => d[stratifyBy] === 1);

  		let newTreatmentIQR = [getIQR(treatmentStratify0, 1, 0), getIQR(treatmentStratify1, 1, 1)];
  		let newControlIQR = [getIQR(controlStratify0, 0, 0), getIQR(controlStratify1, 0, 1)];

  		setTreatmentIQR(newTreatmentIQR);
  		setControlIQR(newControlIQR);
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

  		let yMin = d3.min([d3.min(treatmentIQR, d => d.IQRMin), d3.min(controlIQR, d => d.IQRMin), d3.min(cohortData, d => d[outcome])]);

  		var yScale = d3.scaleLinear()
          .domain([yMin, d3.max(cohortData, d => d.outcome)])
          .range([layout.height - layout.marginBottom, layout.margin])

  		let computedBandwidth = xScale.bandwidth();
  		let customBandwidth = layout.width / 8;

  		let outcomesTreatmentConnectMinMax = svgElement.select("#outcomes")
  			.selectAll(".outcomeConnectTreatment")
  			.data(treatmentIQR)
  			.join("line")
  			.attr("class", "outcomeConnectTreatment")
  			.attr("x1", d => xScale(d.stratify) + computedBandwidth / 2 - customBandwidth / 2 - 10)
  			.attr("y1", d => yScale(d["IQRMax"]))
  			.attr("x2", d => xScale(d.stratify) + computedBandwidth / 2 - customBandwidth / 2 - 10)
  			.attr("y2", d => yScale(d["IQRMin"]))
  			.attr("stroke", "black")
  			.attr("stroke-width", 2)

  		let outcomesTreatment = svgElement.select("#outcomes")
  			.selectAll(".outcomeBlockTreatment")
  			.data(treatmentIQR)
  			.join("rect")
  			.attr("class", "outcomeBlockTreatment")
  			.attr("x", d => xScale(d.stratify) + computedBandwidth / 2 - customBandwidth - 10)
  			.attr("y", d => yScale(d["Q3"]))
  			.attr("width", customBandwidth)
  			.attr("height", d => yScale(d.Q1) - yScale(d.Q3))
  			.attr("fill", d => colorMap[d.treatment])

  		let outcomesTreatmentMean = svgElement.select("#outcomes")
  			.selectAll(".outcomeMeanTreatment")
  			.data(treatmentIQR)
  			.join("line")
  			.attr("class", "outcomeMeanTreatment")
  			.attr("x1", d => xScale(d.stratify) + computedBandwidth / 2 - customBandwidth - 10)
  			.attr("y1", d => yScale(d["Q2"]))
  			.attr("x2", d => xScale(d.stratify) + computedBandwidth / 2 - 10)
  			.attr("y2", d => yScale(d["Q2"]))
  			.attr("stroke", d => yScale(d.Q1) - yScale(d.Q3) === 0 ? colorMap[d.treatment] : "white")
  			.attr("stroke-width", 1)

  		let outcomesTreatmentOutlierStratify0 = svgElement.select("#outcomes")
  			.selectAll(".outcomesTreatmentOutlierStratify0")
  			.data(treatmentIQR[0].outliers)
  			.join("circle")
  			.attr("class", "outcomesTreatmentOutlierStratify0")
  			.attr("cx", d => xScale(0) + computedBandwidth / 2 - 10 - customBandwidth / 2 + (Math.random() - 0.5) * jitter)
  			.attr("cy", d => yScale(d[outcome]))
  			.attr("r", 3)
  			.attr("fill", "none")
  			.attr("stroke", d => colorMap[d.treatment])

  		let outcomesTreatmentOutlierStratify1 = svgElement.select("#outcomes")
  			.selectAll(".outcomesTreatmentOutlierStratify1")
  			.data(treatmentIQR[1].outliers)
  			.join("circle")
  			.attr("class", "outcomesTreatmentOutlierStratify1")
  			.attr("cx", d => xScale(1) + computedBandwidth / 2 - 10 - customBandwidth / 2 + (Math.random() - 0.5) * jitter)
  			.attr("cy", d => yScale(d[outcome]))
  			.attr("r", 3)
  			.attr("fill", "none")
  			.attr("stroke", d => colorMap[d.treatment])

  		let outcomesTreatmentMin = svgElement.select("#outcomes")
  			.selectAll(".outcomeMinTreatment")
  			.data(treatmentIQR)
  			.join("line")
  			.attr("class", "outcomeMinTreatment")
  			.attr("x1", d => xScale(d.stratify) + computedBandwidth / 2 - customBandwidth / 2 - 20)
  			.attr("y1", d => yScale(d["IQRMin"]))
  			.attr("x2", d => xScale(d.stratify) + computedBandwidth / 2 - customBandwidth / 2)
  			.attr("y2", d => yScale(d["IQRMin"]))
  			.attr("stroke", "black")
  			.attr("stroke-width", 2)

  		let outcomesTreatmentMax = svgElement.select("#outcomes")
  			.selectAll(".outcomeMaxTreatment")
  			.data(treatmentIQR)
  			.join("line")
  			.attr("class", "outcomeMaxTreatment")
  			.attr("x1", d => xScale(d.stratify) + computedBandwidth / 2 - customBandwidth / 2 - 20)
  			.attr("y1", d => yScale(d["IQRMax"]))
  			.attr("x2", d => xScale(d.stratify) + computedBandwidth / 2 - customBandwidth / 2)
  			.attr("y2", d => yScale(d["IQRMax"]))
  			.attr("stroke", "black")
  			.attr("stroke-width", 2)

  		let outcomesControlConnectMinMax = svgElement.select("#outcomes")
  			.selectAll(".outcomeConnectControl")
  			.data(controlIQR)
  			.join("line")
  			.attr("class", "outcomeConnectControl")
  			.attr("x1", d => xScale(d.stratify) + computedBandwidth / 2 + customBandwidth / 2 + 10)
  			.attr("y1", d => yScale(d["IQRMax"]))
  			.attr("x2", d => xScale(d.stratify) + computedBandwidth / 2 + customBandwidth / 2 + 10)
  			.attr("y2", d => yScale(d["IQRMin"]))
  			.attr("stroke", "black")
  			.attr("stroke-width", 2)

  		let outcomesControl = svgElement.select("#outcomes")
  			.selectAll(".outcomeBlockControl")
  			.data(controlIQR)
  			.join("rect")
  			.attr("class", "outcomeBlockControl")
  			.attr("x", d => xScale(d.stratify) + computedBandwidth / 2 + 10)
  			.attr("y", d => yScale(d.Q3))
  			.attr("width", customBandwidth)
  			.attr("height", d => yScale(d.Q1) - yScale(d.Q3))
  			.attr("fill", d => colorMap[d.treatment])

  		let outcomesControlMean = svgElement.select("#outcomes")
  			.selectAll(".outcomeMeanControl")
  			.data(controlIQR)
  			.join("line")
  			.attr("class", "outcomeMeanControl")
  			.attr("x1", d => xScale(d.stratify) + computedBandwidth / 2 + 10)
  			.attr("y1", d => yScale(d["Q2"]))
  			.attr("x2", d => xScale(d.stratify) + computedBandwidth / 2 + 10 + customBandwidth)
  			.attr("y2", d => yScale(d["Q2"]))
  			.attr("stroke", d => yScale(d.Q1) - yScale(d.Q3) === 0 ? colorMap[d.treatment] : "white")
  			.attr("stroke-width", 1)

  		let outcomesControlOutlierStratify0 = svgElement.select("#outcomes")
  			.selectAll(".outcomesControlOutlierStratify0")
  			.data(controlIQR[0].outliers)
  			.join("circle")
  			.attr("class", "outcomesTreatmentOutlierStratify0")
  			.attr("cx", d => xScale(0) + computedBandwidth / 2 + 10 + customBandwidth / 2 + (Math.random() - 0.5) * jitter)
  			.attr("cy", d => yScale(d[outcome]))
  			.attr("r", 3)
  			.attr("fill", "none")
  			.attr("stroke", d => colorMap[d.treatment])

  		let outcomesControlOutlierStratify1 = svgElement.select("#outcomes")
  			.selectAll(".outcomesControlOutlierStratify1")
  			.data(controlIQR[1].outliers)
  			.join("circle")
  			.attr("class", "outcomesTreatmentOutlierStratify1")
  			.attr("cx", d => xScale(1) + computedBandwidth / 2 + 10 + customBandwidth / 2 + (Math.random() - 0.5) * jitter)
  			.attr("cy", d => yScale(d[outcome]))
  			.attr("r", 3)
  			.attr("fill", "none")
  			.attr("stroke", d => colorMap[d.treatment])

  		let outcomesControlMin = svgElement.select("#outcomes")
  			.selectAll(".outcomeMinControl")
  			.data(controlIQR)
  			.join("line")
  			.attr("class", "outcomeMinControl")
  			.attr("x1", d => xScale(d.stratify) + computedBandwidth / 2 + customBandwidth / 2)
  			.attr("y1", d => yScale(d["IQRMin"]))
  			.attr("x2", d => xScale(d.stratify) + computedBandwidth / 2 + customBandwidth / 2 + 20)
  			.attr("y2", d => yScale(d["IQRMin"]))
  			.attr("stroke", "black")
  			.attr("stroke-width", 2)

  		let outcomesControlMax = svgElement.select("#outcomes")
  			.selectAll(".outcomeMaxControl")
  			.data(controlIQR)
  			.join("line")
  			.attr("class", "outcomeMaxControl")
  			.attr("x1", d => xScale(d.stratify) + computedBandwidth / 2 + customBandwidth / 2)
  			.attr("y1", d => yScale(d["IQRMax"]))
  			.attr("x2", d => xScale(d.stratify) + computedBandwidth / 2 + customBandwidth / 2 + 20)
  			.attr("y2", d => yScale(d["IQRMax"]))
  			.attr("stroke", "black")
  			.attr("stroke-width", 2)

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

  	}, [cohortData, stratifyBy, isBinary, layout])

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
          <g id="title" />
        </g>
      </svg>
    </div>
  )
}
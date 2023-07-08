import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Popup.css';

export default function DataChart(prop) {
  const chartRef = useRef(null);

  useEffect(() => {
    createChart(prop.data);
  }, [prop]);

  const createChart = (data) => {
    const chartContainer = d3.select(chartRef.current);
    const width = 290;
    const height = 250;
    const padding = 1; // Padding between bars and chart boundaries

    // Create scales
    const yScale = d3
      .scaleBand()
      .domain(Object.keys(data))
      .range([padding, height - padding]) // Adjusted range to leave padding space
      .padding(0.1);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(Object.values(data))])
      .range([padding, width - padding * 2]); // Adjusted range to leave padding space

    // Define color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create SVG element
    const svg = chartContainer
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Create bars
    svg
      .selectAll('rect')
      .data(Object.entries(data))
      .enter()
      .append('rect')
      .attr('y', (d) => yScale(d[0]))
      .attr('x', padding) // Adjusted x position to leave padding space
      .attr('width', (d) => xScale(d[1]))
      .attr('height', yScale.bandwidth())
      .attr('fill', (d, i) => colorScale(i)); // Assign different colors to each bar

    // Create labels
    svg
      .selectAll('text')
      .data(Object.entries(data))
      .enter()
      .append('text')
      .text((d) => `${d[0]} (${d[1]})`)
      .attr('y', (d) => yScale(d[0]) + yScale.bandwidth() / 2 + 3) // Adjusted y position to stick at the middle bottom
      .attr('x', (d) => xScale(0.1)) // Adjusted x position to move the text to the left by 20 pixels
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'black')
      .attr('class', 'textDecor')
      .attr('pointer-events', 'none'); // Prevent the text from capturing mouse events
  };

  return <div ref={chartRef}> </div>;
}

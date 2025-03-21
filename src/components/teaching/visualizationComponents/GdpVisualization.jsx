import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const GdpVisualization = ({ data, highlightedElements, currentTime }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const chartRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Log initial data
  console.log('GdpVisualization received data:', data);
  if (data && data.nodes) {
    console.log('Node types in data:', data.nodes.map(node => node.type));
  }

  // Hook to log mount info
  useEffect(() => {
    console.log('GdpVisualization mounted with data:', data);
    if (data && data.nodes) {
      const yearNodes = data.nodes.filter(node => node.type === 'year');
      console.log('Year nodes found:', yearNodes.length);
      console.log('All node types:', [...new Set(data.nodes.map(node => node.type))]);
    }
  }, [data]);

  // Hook to set container dimensions
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.width = '100%';
      containerRef.current.style.height = '500px';
      containerRef.current.style.minHeight = '500px';
      containerRef.current.style.display = 'block';
      containerRef.current.style.position = 'relative';
    }
  }, []);

  // Hook for main chart rendering
  useEffect(() => {
    renderSimpleChart();
  }, [data]);

  // Hook for highlighting elements
  useEffect(() => {
    if (!svgRef.current || !highlightedElements) return;
    const svg = svgRef.current;
    console.log('Applying highlights to elements:', highlightedElements);

    svg.selectAll('.bar rect')
      .style('stroke', 'none')
      .style('stroke-width', 0)
      .style('filter', null);

    svg.selectAll('.bar text')
      .style('font-weight', 'normal')
      .style('font-size', '10px');

    svg.selectAll('.trend-line')
      .style('stroke', '#90cdf4')
      .style('stroke-width', 2)
      .style('filter', null);

    svg.selectAll('.dot')
      .attr('r', 4)
      .style('filter', null);

    if (highlightedElements && highlightedElements.length > 0) {
      highlightedElements.forEach((id) => {
        console.log(`Highlighting element with ID: ${id}`);
        const selector = getNodeSelector(id);
        
        if (id === 'trend-line') {
          svg.select('.trend-line')
            .style('stroke', '#f56565')
            .style('stroke-width', 4)
            .style('filter', 'drop-shadow(0 0 6px rgba(245, 101, 101, 0.5))');
          
          svg.selectAll('.dot')
            .attr('r', 6)
            .style('filter', 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.7))');
        } else {
          const barElement = svg.select(`${selector} rect`);
          if (!barElement.empty()) {
            barElement
              .style('stroke', '#f56565')
              .style('stroke-width', 3)
              .style('filter', 'drop-shadow(0 0 8px rgba(245, 101, 101, 0.7))');
            svg.selectAll(`${selector} text`)
              .style('font-weight', 'bold')
              .style('font-size', '12px')
              .style('filter', 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))');
          }
        }
      });
    }
  }, [highlightedElements]);

  // Hook for currentTime updates
  useEffect(() => {
    if (!svgRef.current || currentTime === undefined || currentTime === null) return;
    const normalizedTime = Math.min(100, Math.max(0, currentTime));
    const svg = svgRef.current;

    const timelineThumb = svg.select('.timeline-thumb');
    if (!timelineThumb.empty()) {
      const timelineTrack = svg.select('.timeline-track');
      const trackWidth = timelineTrack.node().getBBox().width;
      timelineThumb.attr('cx', (trackWidth * normalizedTime) / 100);
    }

    if (normalizedTime < 100) {
      const visibleBars = Math.ceil((normalizedTime / 100) * svg.selectAll('.bar').size());
      svg.selectAll('.bar')
        .style('opacity', (d, i) => (i < visibleBars ? 1 : 0.3));
    } else {
      svg.selectAll('.bar').style('opacity', 1);
    }
  }, [currentTime]);

  // Hook for window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && svgRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        svgRef.current.attr('width', width).attr('height', height);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper functions
  const createDefaultGdpData = () => {
    return [
      {"id": "2000", "name": "2000", "type": "year", "properties": ["0.47", "4.0"]},
      {"id": "2005", "name": "2005", "type": "year", "properties": ["0.82", "7.9"]},
      {"id": "2010", "name": "2010", "type": "year", "properties": ["1.66", "8.5"]},
      {"id": "2015", "name": "2015", "type": "year", "properties": ["2.10", "8.0"]},
      {"id": "2020", "name": "2020", "type": "year", "properties": ["2.66", "-6.6"]},
      {"id": "2021", "name": "2021", "type": "year", "properties": ["3.18", "8.7"]},
      {"id": "2022", "name": "2022", "type": "year", "properties": ["3.39", "7.2"]},
      {"id": "2023", "name": "2023", "type": "year", "properties": ["3.74", "6.3"]},
      {"id": "2024", "name": "2024", "type": "year", "properties": ["4.05", "6.5"]},
      {"id": "2025", "name": "2025", "type": "year", "properties": ["4.44", "6.5"]}
    ];
  };

  const renderSimpleChart = () => {
    if (!containerRef.current || !data || !data.nodes) return;
    
    console.log('Rendering enhanced GDP chart');
    const container = d3.select(containerRef.current);
    container.selectAll('*').remove();
    
    const width = container.node().clientWidth;
    const height = container.node().clientHeight || 500;
    
    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#1a202c');
    
    svgRef.current = svg;
    
    let gdpData = [];
    if (data && data.nodes && Array.isArray(data.nodes)) {
      gdpData = data.nodes
        .filter(node => node.type === 'year')
        .sort((a, b) => parseInt(a.name) - parseInt(b.name));
    }

    if (gdpData.length === 0) {
      console.log('No year data found, using default data');
      gdpData = createDefaultGdpData();
    }
    
    const margin = { top: 60, right: 160, bottom: 80, left: 70 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    chartRef.current = g;
    
    const xScale = d3.scaleBand()
      .domain(gdpData.map(d => d.name))
      .range([0, chartWidth])
      .padding(0.3);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(gdpData, d => parseFloat(d.properties[0])) * 1.1])
      .range([chartHeight, 0])
      .nice();
    
    const bars = g.selectAll('.bar')
      .data(gdpData)
      .enter()
      .append('g')
      .attr('class', d => `bar node-${d.id}`);
    
    bars.append('rect')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(parseFloat(d.properties[0])))
      .attr('width', xScale.bandwidth())
      .attr('height', d => chartHeight - yScale(parseFloat(d.properties[0])))
      .attr('fill', d => {
        if (d.properties && d.properties.length > 1) {
          const growthRate = parseFloat(d.properties[1]);
          return growthRate >= 5 ? '#f56565' : '#4299e1';
        }
        return '#4299e1';
      })
      .attr('stroke', 'none')
      .attr('stroke-width', 0);
    
    bars.append('text')
      .attr('x', d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(parseFloat(d.properties[0])) - 10)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '10px')
      .text(d => `$${d.properties[0]}T`);
    
    bars.append('text')
      .attr('x', d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(parseFloat(d.properties[0])) - 25)
      .attr('text-anchor', 'middle')
      .style('fill', d => {
        if (d.properties && d.properties.length > 1) {
          const growthRate = parseFloat(d.properties[1]);
          return growthRate >= 5 ? '#f56565' : '#4299e1';
        }
        return '#4299e1';
      })
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text(d => {
        if (d.properties && d.properties.length > 1) {
          const growthRate = parseFloat(d.properties[1]);
          return growthRate > 0 ? `+${d.properties[1]}%` : `${d.properties[1]}%`;
        }
        return '';
      });
    
    g.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale)
        .tickValues(xScale.domain().filter((d, i) => i % 5 === 0 || i === gdpData.length - 1))
      )
      .selectAll('text')
      .style('text-anchor', 'end')
      .style('fill', 'white')
      .style('font-size', '12px')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');
    
    g.append('g')
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => `$${d}Tn`)
      )
      .selectAll('text')
      .style('fill', 'white')
      .style('font-size', '12px');
    
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -chartHeight / 2)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '14px')
      .text('GDP (Trillion USD)');
    
    g.append('text')
      .attr('y', chartHeight + 60)
      .attr('x', chartWidth / 2)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '14px')
      .text('Year');
    
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .text("India's GDP Growth (2000-2025)");
    
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 150}, ${margin.top})`);
    
    legend.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .style('fill', 'white')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Growth Rate');
    
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 15)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#4299e1');
    
    legend.append('text')
      .attr('x', 25)
      .attr('y', 27)
      .style('fill', 'white')
      .style('font-size', '12px')
      .text('Low Growth (<5%)');
    
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 40)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#f56565');
    
    legend.append('text')
      .attr('x', 25)
      .attr('y', 52)
      .style('fill', 'white')
      .style('font-size', '12px')
      .text('High Growth (>5%)');
    
    if (gdpData.length > 1) {
      const lineData = gdpData.map(d => ({
        year: d.name,
        value: parseFloat(d.properties[0])
      }));
      
      const line = d3.line()
        .x(d => xScale(d.year) + xScale.bandwidth() / 2)
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);
      
      g.append('path')
        .datum(lineData)
        .attr('class', 'trend-line')
        .attr('fill', 'none')
        .attr('stroke', '#90cdf4')
        .attr('stroke-width', 2)
        .attr('d', line);
      
      g.selectAll('.dot')
        .data(lineData)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.year) + xScale.bandwidth() / 2)
        .attr('cy', d => yScale(d.value))
        .attr('r', 4)
        .attr('fill', 'white');
    }
  };

  const getNodeSelector = (id) => {
    if (/^\d{4}$/.test(id)) return `.node-${id}`;
    if (id === 'trend-line') return '.trend-line';
    return `.node-${id}`;
  };

  // Early return for no data
  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div 
        ref={containerRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          minHeight: '500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#1a202c',
          color: 'white'
        }}
      >
        <div>No GDP data available to visualize</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: '500px' }}
    />
  );
};

export default GdpVisualization;
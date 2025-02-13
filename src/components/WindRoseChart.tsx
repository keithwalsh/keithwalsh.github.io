/**
 * @fileoverview Circular histogram visualization showing wind direction and speed
 * frequency distribution using D3.js.
 */

import { useEffect, useRef } from 'react'
import { Paper, Typography } from '@mui/material'
import * as d3 from 'd3'
import { WindRoseData } from '../utils/csvLoader'

interface WindRoseChartProps {
  data: WindRoseData[]
}

export function WindRoseChart({ data }: WindRoseChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove()

    // Validate data structure
    const validData = data.filter(d => 
      d.direction && 
      d.speed != null && 
      d.frequency != null &&
      typeof d.direction === 'string' &&
      typeof d.speed === 'number' &&
      typeof d.frequency === 'number'
    )

    // Chart dimensions
    const width = 385
    const height = 385
    const margin = 40
    const radius = Math.min(width, height) / 2 - margin

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    // Scales
    const angleScale = d3.scaleLinear()
      .domain([0, 360])
      .range([0, 2 * Math.PI])

    const radiusScale = d3.scaleLinear()
      .domain([0, d3.max(validData, d => d.frequency) || 0])
      .range([0, radius])

    const colorScale = d3.scaleSequential()
      .domain([0, d3.max(validData, d => d.speed) || 0])
      .interpolator(d3.interpolateViridis)

    // Create bars
    const barWidth = (2 * Math.PI) / (validData.length)
    
    svg.selectAll('path')
      .data(validData)
      .enter()
      .append('path')
      .attr('d', d => {
        const startAngle = angleScale(getDirectionDegrees(d.direction))
        return d3.arc()({
          innerRadius: 0,
          outerRadius: radiusScale(d.frequency),
          startAngle: startAngle,
          endAngle: startAngle + barWidth
        })
      })
      .attr('fill', d => colorScale(d.speed))
      .attr('stroke', 'white')
      .attr('stroke-width', '1px')

    // Add direction labels
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const labelRadius = radius + 20

    svg.selectAll('.direction-label')
      .data(directions)
      .enter()
      .append('text')
      .attr('class', 'direction-label')
      .attr('x', (_d, i) => labelRadius * Math.sin((i * Math.PI) / 4))
      .attr('y', (_d, i) => -labelRadius * Math.cos((i * Math.PI) / 4))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(d => d)
      .style('font-size', '12px')

  }, [data])

  function getDirectionDegrees(direction: string): number {
    const directionMap: { [key: string]: number } = {
      'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
      'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
      'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
      'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    }
    return directionMap[direction] || 0
  }

  return (
    <Paper elevation={3} sx={{ p: 3, minHeight: 385 }}>
      <Typography variant="h6" gutterBottom>
        Wind Rose
      </Typography>
      <svg ref={svgRef} />
    </Paper>
  )
} 
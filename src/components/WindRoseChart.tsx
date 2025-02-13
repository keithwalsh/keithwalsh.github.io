/**
 * @fileoverview Circular histogram visualization showing wind direction and speed
 * frequency distribution using D3.js.
 */

import { useEffect, useRef } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import * as d3 from 'd3'
import { WindRoseData } from '../utils/csvLoader'

interface WindRoseChartProps {
  data: WindRoseData[]
}

export function WindRoseChart({ data }: WindRoseChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data || data.length === 0) return

    // Debug log
    console.log('Rendering with data:', data)

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove()

    // Adjust dimensions
    const width = 385
    const height = 385
    const margin = 60
    const radius = Math.min(width, height) / 2 - margin

    // Calculate total frequency for each direction to normalize
    const directionTotals = new Map<string, number>()
    data.forEach(d => {
      const current = directionTotals.get(d.direction) || 0
      directionTotals.set(d.direction, current + d.frequency)
    })

    // Find the maximum total frequency across all directions
    const maxTotalFrequency = Math.max(...Array.from(directionTotals.values()))

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    // Add background circle
    svg.append('circle')
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', '#eee')
      .attr('stroke-width', '1px')

    // Group data by direction
    const directionGroups = d3.group(data, d => d.direction)
    
    // Scales
    const angleScale = d3.scaleLinear()
      .domain([0, 360])
      .range([0, 2 * Math.PI])

    // Adjust radiusScale to account for total frequencies
    const radiusScale = d3.scaleLinear()
      .domain([0, maxTotalFrequency])
      .range([0, radius])

    const colorScale = d3.scaleSequential()
      .domain([0, 25])
      .interpolator(d3.interpolateViridis)

    const barWidth = (2 * Math.PI) / 16 // 16 directions
    
    // Create stacked bars for each direction
    directionGroups.forEach((speedBins, direction) => {
      let cumFrequency = 0
      
      // Sort speed bins by speed value
      const sortedBins = speedBins.sort((a, b) => a.speed - b.speed)
      
      sortedBins.forEach(bin => {
        if (bin.frequency === 0) return

        const directionDegrees = getDirectionDegrees(direction)
        const startAngle = angleScale(directionDegrees) - barWidth / 2 // Offset by half width
        
        svg.append('path')
          .attr('d', d3.arc()({
            innerRadius: radiusScale(cumFrequency),
            outerRadius: radiusScale(cumFrequency + bin.frequency),
            startAngle: startAngle,
            endAngle: startAngle + barWidth
          }))
          .attr('fill', colorScale(bin.speed))
          .attr('stroke', 'white')
          .attr('stroke-width', '1px')

        cumFrequency += bin.frequency
      })
    })

    // Direction labels remain centered on the lines
    const directions = Array.from(directionGroups.keys())
    directions.forEach(direction => {
      const angle = angleScale(getDirectionDegrees(direction))
      const labelRadius = radius + 15
      const x = labelRadius * Math.sin(angle)
      const y = -labelRadius * Math.cos(angle)
      
      svg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .text(direction)
    })

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
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Wind Rose
      </Typography>
      <Box
            sx={{ 
              p: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: 385,
              maxWidth: 385,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: -6,
              marginBottom: -4.7,
            }}
      >
        <svg ref={svgRef} style={{ maxWidth: '100%', height: 'auto'}} />
      </Box>
    </Paper>
  )
} 
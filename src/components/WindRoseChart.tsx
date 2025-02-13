import { useEffect, useRef, useState } from 'react'
import { Box, Paper, Typography, Popper } from '@mui/material'
import * as d3 from 'd3'
import { WindRoseData } from '../utils/csvLoader'

interface WindRoseChartProps {
  data: WindRoseData[]
}

interface TooltipState {
  open: boolean
  x: number
  y: number
  content: Array<{ text: string; color?: string }>
}

export function WindRoseChart({ data }: WindRoseChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState>({
    open: false,
    x: 0,
    y: 0,
    content: [],
  })

  const speedRanges = [
    { range: '0-5', label: '0-5 km/h' },
    { range: '5-10', label: '5-10 km/h' },
    { range: '10-15', label: '10-15 km/h' },
    { range: '15-20', label: '15-20 km/h' },
    { range: '20-25', label: '20-25 km/h' },
    { range: '25-30', label: '25-30 km/h' },
    { range: '>=30', label: '>30 km/h' },
  ]

  function getTooltipContent(
    direction: string,
    bins: WindRoseData[]
  ): Array<{ text: string; color?: string }> {
    const lines = []
    // Direction header
    lines.push({ text: direction })

    speedRanges.forEach(range => {
      let freq = 0
      if (range.range === '>=30') {
        bins.filter(b => b.speed >= 30).forEach(b => (freq += b.frequency))
      } else {
        const lower = parseFloat(range.range.split('-')[0])
        bins.filter(b => b.speed === lower).forEach(b => (freq += b.frequency))
      }
      const color = d3.interpolateViridis(
        range.range === '>=30' ? 1 : parseInt(range.range.split('-')[1]) / 30
      )
      lines.push({
        text: `${range.label}: ${Math.round(freq).toLocaleString()} hrs.`,
        color,
      })
    })
    return lines
  }

  useEffect(() => {
    if (!data || data.length === 0) return

    // Debug log
    console.log('Rendering with data:', data)

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove()

    // Adjust dimensions
    const width = 385
    const height = 385
    const margin = 20
    const radius = Math.min(width, height) / 2 - margin
    const centerRadius = 10 // Radius for the white circle at center

    // Calculate total frequency for each direction to normalize
    const directionTotals = new Map<string, number>()
    data.forEach(d => {
      const current = directionTotals.get(d.direction) || 0
      directionTotals.set(d.direction, current + d.frequency)
    })

    // Calculate total hours for percentage calculation
    const totalHours = Array.from(directionTotals.values()).reduce(
      (sum, val) => sum + val,
      0
    )

    // Find the maximum total frequency across all directions
    const maxTotalFrequency = Math.max(...Array.from(directionTotals.values()))

    // Calculate max percentage and determine number of circles needed
    const maxPercentage = Math.ceil((maxTotalFrequency * 100) / totalHours)
    const roundedMaxPercentage = Math.ceil(maxPercentage / 2) * 2 // Round up to nearest 2%
    const numberOfCircles = Math.min(
      4,
      Math.max(3, Math.ceil(roundedMaxPercentage / 2))
    ) // Force 3 or 4 circles
    const percentagePerCircle =
      Math.ceil(roundedMaxPercentage / numberOfCircles / 2) * 2 // Ensure even numbers
    const maxScaleValue = maxTotalFrequency // Use actual maximum frequency

    // Debug log
    console.log('Scaling values:', {
      maxPercentage,
      roundedMaxPercentage,
      numberOfCircles,
      percentagePerCircle,
      maxScaleValue,
      maxTotalFrequency,
      totalHours,
    })

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    // Adjust radiusScale to account for center circle
    const radiusScale = d3
      .scaleLinear()
      .domain([0, maxScaleValue])
      .range([centerRadius, radius])

    // Add concentric circles for reference
    for (let i = 1; i <= numberOfCircles; i++) {
      const currentRadius =
        ((radius - centerRadius) * i) / numberOfCircles + centerRadius

      // Draw circle
      svg
        .append('circle')
        .attr('r', currentRadius)
        .attr('fill', 'none')
        .attr('stroke', i === numberOfCircles ? '#BABABA' : '#E3E8F2')
        .attr('stroke-width', i === numberOfCircles ? '1px' : '1px')
        .attr('stroke-dasharray', 'none')
    }

    // Group data by direction
    const directionGroups = d3.group(data, d => d.direction)

    // Scales
    const angleScale = d3
      .scaleLinear()
      .domain([0, 360])
      .range([0, 2 * Math.PI])

    const colorScale = d3
      .scaleSequential()
      .domain([0, 25])
      .interpolator(d3.interpolateViridis)

    const barWidth = (2 * Math.PI) / 16 // 16 directions

    // Add direction lines BEFORE creating the stacked bars
    const directions = Array.from(directionGroups.keys())
    directions.forEach(direction => {
      const angle = angleScale(getDirectionDegrees(direction))

      // Add the radial line
      svg
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', radius * Math.sin(angle))
        .attr('y2', -radius * Math.cos(angle))
        .attr('stroke', '#BABABA')
        .attr('stroke-width', '1px')
    })

    // Create stacked bars for each direction
    directionGroups.forEach((speedBins, direction) => {
      let cumFrequency = 0

      // Sort speed bins by speed value
      const sortedBins = speedBins.sort((a, b) => a.speed - b.speed)

      sortedBins.forEach(bin => {
        if (bin.frequency === 0) return

        const directionDegrees = getDirectionDegrees(direction)
        const startAngle = angleScale(directionDegrees) - barWidth / 2 // Offset by half width

        svg
          .append('path')
          .attr(
            'd',
            d3.arc()({
              innerRadius: radiusScale(cumFrequency),
              outerRadius: radiusScale(cumFrequency + bin.frequency),
              startAngle: startAngle,
              endAngle: startAngle + barWidth,
            })
          )
          .attr('fill', colorScale(bin.speed))
          .on('mouseover', event => {
            const tooltipContent = getTooltipContent(direction, speedBins)
            setTooltip({
              open: true,
              x: event.clientX,
              y: event.clientY,
              content: tooltipContent,
            })
          })
          .on('mousemove', event => {
            setTooltip(prev => ({
              ...prev,
              x: event.clientX,
              y: event.clientY,
            }))
          })
          .on('mouseout', () => {
            setTooltip(prev => ({ ...prev, open: false }))
          })
        cumFrequency += bin.frequency
      })
    })

    // Direction labels
    directions.forEach(direction => {
      const angle = angleScale(getDirectionDegrees(direction))
      const labelRadius = radius + 15
      const x = labelRadius * Math.sin(angle)
      const y = -labelRadius * Math.cos(angle)

      svg
        .append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .text(direction)
    })

    // Add percentage labels last so they appear on top
    for (let i = 1; i <= numberOfCircles; i++) {
      const currentRadius =
        ((radius - centerRadius) * i) / numberOfCircles + centerRadius
      const currentValue = (maxTotalFrequency * i) / numberOfCircles
      const percentage = Math.round((currentValue * 100) / totalHours)
      svg
        .append('text')
        .attr('x', 0)
        .attr('y', -currentRadius)
        .attr('dy', '1em')
        .attr('text-anchor', 'start')
        .attr('font-size', '10px')
        .attr('fill', 'rgba(0, 0, 0, 0.87)')
        .text(`${percentage}%`)
    }

    // Add white circle at center
    svg
      .append('circle')
      .attr('r', centerRadius)
      .attr('fill', 'white')
      .attr('stroke', '#E3E8F2')
      .attr('stroke-width', '1px')
  }, [data])

  function getDirectionDegrees(direction: string): number {
    const directionMap: { [key: string]: number } = {
      N: 0,
      NNE: 22.5,
      NE: 45,
      ENE: 67.5,
      E: 90,
      ESE: 112.5,
      SE: 135,
      SSE: 157.5,
      S: 180,
      SSW: 202.5,
      SW: 225,
      WSW: 247.5,
      W: 270,
      WNW: 292.5,
      NW: 315,
      NNW: 337.5,
    }
    return directionMap[direction] || 0
  }

  const virtualElement = {
    getBoundingClientRect: () => ({
      x: tooltip.x,
      y: tooltip.y,
      top: tooltip.y,
      left: tooltip.x,
      bottom: tooltip.y,
      right: tooltip.x,
      width: 0,
      height: 0,
      toJSON: () => '',
    }),
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Wind Rose
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: { xs: 'center', lg: 'flex-start' },
          gap: 2,
          height: '100%',
        }}
      >
        <svg
          ref={svgRef}
          style={{
            display: 'block',
            margin: '0 auto',
            maxWidth: '100%',
            height: 'auto',
          }}
        />

        {/* Legend */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', lg: 'column' },
            gap: 0.5,
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignSelf: 'center',
            mt: { xs: 2, lg: 0 },
          }}
        >
          {speedRanges.map(item => (
            <Box
              key={item.range}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: d3.interpolateViridis(
                    item.range === '>=30'
                      ? 1
                      : parseInt(item.range.split('-')[1]) / 30
                  ),
                  border: '1px solid white',
                }}
              />
              <Typography variant="caption">{item.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Popper
        open={tooltip.open}
        anchorEl={virtualElement}
        placement="top"
        style={{ pointerEvents: 'none' }}
      >
        <Paper
          sx={{
            boxShadow:
              '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
            backgroundColor: '#fff',
            color: 'rgba(0, 0, 0, 0.87)',
            borderRadius: '4px',
            mx: 2,
          }}
        >
          <table
            style={{
              borderSpacing: 0,
              fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid #E0E0E0',
                  width: '100%',
                }}
              >
                <td
                  colSpan={3}
                  style={{
                    padding: '8px 16px',
                    color: 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  <Typography>{tooltip.content[0]?.text}</Typography>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr style={{ height: '8px' }}>
                <td colSpan={3}></td>
              </tr>
              {tooltip.content.slice(1).map((line, index) => (
                <tr key={index}>
                  <td
                    style={{
                      verticalAlign: 'middle',
                      paddingLeft: '16px',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                      color: 'rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: line.color,
                        border: '2px solid #fff',
                        boxShadow:
                          '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                        boxSizing: 'content-box',
                      }}
                    />
                  </td>
                  <td
                    style={{
                      verticalAlign: 'middle',
                      paddingLeft: '8px',
                      paddingTop: '2px',
                      paddingBottom: '2px',
                      color: 'rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
                      {line.text.split(':')[0]}
                    </Typography>
                  </td>
                  <td
                    style={{
                      verticalAlign: 'middle',
                      paddingLeft: '32px',
                      paddingRight: '16px',
                      paddingTop: '2px',
                      paddingBottom: '2px',
                      color: 'rgba(0, 0, 0, 0.87)',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
                      {line.text.split(':')[1]}
                    </Typography>
                  </td>
                </tr>
              ))}
              <tr style={{ height: '8px' }}>
                <td colSpan={3}></td>
              </tr>
            </tbody>
          </table>
        </Paper>
      </Popper>
    </Paper>
  )
}

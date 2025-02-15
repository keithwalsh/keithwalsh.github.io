import { useEffect, useRef, useState } from 'react'
import { Box, Paper, Typography, Popper } from '@mui/material'
import * as d3 from 'd3'
import { WindRoseData } from '../utils/csvLoader'
import { useTheme } from '@mui/material/styles'

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
  const theme = useTheme()

  const speedRanges = [
    { range: '0-5', label: '0-5 km/h' },
    { range: '5-10', label: '5-10 km/h' },
    { range: '10-15', label: '10-15 km/h' },
    { range: '15-20', label: '15-20 km/h' },
    { range: '20-25', label: '20-25 km/h' },
    { range: '25-30', label: '25-30 km/h' },
    { range: '>=30', label: '>30 km/h' },
  ]

  // Move colorScale outside useEffect
  const colorScale = (speed: number) => {
    if (speed >= 30) return '#1a237e' // indigo[900]
    if (speed >= 25) return '#303f9f' // indigo[700]
    if (speed >= 20) return '#3f51b5' // indigo[500]
    if (speed >= 15) return '#5c6bc0' // indigo[400]
    if (speed >= 10) return '#7986cb' // indigo[300]
    if (speed >= 5) return '#9fa8da' // indigo[200]
    return '#c5cae9' // indigo[100]
  }

  function getTooltipContent(
    direction: string,
    bins: WindRoseData[]
  ): Array<{ text: string; color?: string }> {
    const lines = []
    // Direction header
    lines.push({ text: direction })

    // Calculate total hours for percentage
    const totalHours = data.reduce((sum, d) => sum + d.frequency, 0)

    speedRanges.forEach(range => {
      let freq = 0
      if (range.range === '>=30') {
        bins.filter(b => b.speed >= 30).forEach(b => (freq += b.frequency))
      } else {
        const lower = parseFloat(range.range.split('-')[0])
        bins.filter(b => b.speed === lower).forEach(b => (freq += b.frequency))
      }
      const percentage = ((freq / totalHours) * 100).toFixed(1)
      const color = colorScale(
        range.range === '>=30' ? 30 : parseFloat(range.range.split('-')[0])
      )
      lines.push({
        text: `${range.label}: ${Math.round(freq).toLocaleString()} hrs (${percentage}%)`,
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
        .attr(
          'stroke',
          i === numberOfCircles
            ? theme.palette.mode === 'dark'
              ? '#FFFFFF'
              : '#000000'
            : theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.3)'
              : 'rgba(0, 0, 0, 0.3)'
        )
        .attr('stroke-width', '1px')
        .attr('stroke-dasharray', 'none')
    }

    // Group data by direction
    const directionGroups = d3.group(data, d => d.direction)

    // Scales
    const angleScale = d3
      .scaleLinear()
      .domain([0, 360])
      .range([0, 2 * Math.PI])

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
        .attr(
          'stroke',
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.3)'
            : 'rgba(0, 0, 0, 0.3)'
        )
        .attr('stroke-width', '1px')
    })

    // Create a container for all outlines that will be added last
    // const outlinesContainer = svg.append('g').attr('class', 'outlines-container')

    // Create stacked bars for each direction
    directionGroups.forEach((speedBins, direction) => {
      // Create a group for all segments of this direction
      const directionGroup = svg
        .append('g')
        .attr('class', `direction-group-${direction}`)

      let cumFrequency = 0
      const sortedBins = speedBins.sort((a, b) => a.speed - b.speed)

      sortedBins.forEach(bin => {
        if (bin.frequency === 0) return

        const directionDegrees = getDirectionDegrees(direction)
        const startAngle = angleScale(directionDegrees) - barWidth / 2

        directionGroup
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
          .style('opacity', 0.8)

        cumFrequency += bin.frequency
      })

      // Add hover effects to the direction group
      directionGroup
        .on('mouseover', event => {
          // Show outline
          svg.select(`.direction-outline-${direction}`).style('opacity', 1)

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
          // Hide outline
          svg.select(`.direction-outline-${direction}`).style('opacity', 0)

          setTooltip(prev => ({ ...prev, open: false }))
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
        .attr(
          'fill',
          theme.palette.mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)'
        )
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
        .attr('x', 3)
        .attr('y', -currentRadius)
        .attr('dy', '1em')
        .attr('text-anchor', 'start')
        .attr('font-size', '10px')
        .attr(
          'fill',
          theme.palette.mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)'
        )
        .text(`${percentage}`)
    }

    // Add "Frequency (%)" label vertically
    svg
      .append('text')
      .attr('x', -7)
      .attr('y', -radius / 1.5) // Position halfway up the north line
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr(
        'fill',
        theme.palette.mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)'
      )
      .text('Frequency (%)')
      .attr('transform', `rotate(-90, -7, -${radius / 1.5})`)

    // Add white circle at center
    svg
      .append('circle')
      .attr('r', centerRadius)
      .attr('fill', theme.palette.mode === 'dark' ? '#262626' : 'white')
      .attr('stroke', '#E3E8F2')
      .attr('stroke-width', '1px')

    // Create outlines LAST - after ALL other elements
    const outlinesGroup = svg.append('g').attr('class', 'outlines-group')

    // Add outlines for each direction
    directionGroups.forEach((speedBins, direction) => {
      const directionDegrees = getDirectionDegrees(direction)
      const startAngle = angleScale(directionDegrees) - barWidth / 2

      outlinesGroup
        .append('path')
        .attr('class', `direction-outline-${direction}`)
        .attr(
          'd',
          d3.arc()({
            innerRadius: centerRadius,
            outerRadius: radiusScale(
              speedBins.reduce((sum, bin) => sum + bin.frequency, 0)
            ),
            startAngle: startAngle,
            endAngle: startAngle + barWidth,
          })
        )
        .attr('fill', 'none')
        .attr('stroke', theme.palette.mode === 'dark' ? '#fff' : '#000')
        .attr('stroke-width', 1)
        .style('opacity', 0)
        .style('pointer-events', 'none')
    })
  }, [data, theme.palette.mode])

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
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: colorScale(
                    item.range === '>=30'
                      ? 30
                      : parseInt(item.range.split('-')[0])
                  ),
                }}
              />
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              fontSize: '0.75rem',
              maxWidth: { xs: '100%', lg: '200px' },
              textAlign: 'left',
              color: 'text.secondary',
            }}
          >
            The directional sector lengths indicate the frequency of wind from
            each direction (shown as a percentage). The colour bands within each
            sector represent the wind speed ranges.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              fontSize: '0.75rem',
              maxWidth: { xs: '100%', lg: '200px' },
              textAlign: 'left',
              color: 'text.secondary',
            }}
          >
            Overall the sectors that extend farther outward and/or have larger
            color bands reveal which direction and wind speed occur most
            frequently.
          </Typography>
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
            backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#fff',
            color:
              theme.palette.mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)',
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
                  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#2F2F2F' : '#E0E0E0'}`,
                  width: '100%',
                }}
              >
                <td
                  colSpan={3}
                  style={{
                    padding: '8px 16px',
                    color:
                      theme.palette.mode === 'dark'
                        ? '#B0B0B0'
                        : 'rgba(0, 0, 0, 0.6)',
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
                      color:
                        theme.palette.mode === 'dark'
                          ? '#B0B0B0'
                          : 'rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: line.color,
                        border: `2px solid ${theme.palette.mode === 'dark' ? '#121212' : '#fff'}`,
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
                      color:
                        theme.palette.mode === 'dark'
                          ? '#B0B0B0'
                          : 'rgba(0, 0, 0, 0.6)',
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
                      color:
                        theme.palette.mode === 'dark'
                          ? '#FFFFFF'
                          : 'rgba(0, 0, 0, 0.87)',
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

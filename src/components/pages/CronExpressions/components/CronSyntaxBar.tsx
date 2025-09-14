import { Box, Card, CardContent, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import EmergencyIcon from '@mui/icons-material/Emergency'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useCallback, memo } from 'react'
import type { BadgeProps, CronVisualExplanationProps, FieldData, InfoPanelProps, SpecialCharactersTableProps } from '../types/cronSyntaxTypes'
import { parseExample, validateFieldData, validateSpecialCharactersData } from '../utils/cronSyntaxHelpers'
import {
  getMainContainerStyles,
  getBadgeStyles,
  getCardStyles,
  getCodeBlockStyles,
  getFieldLabelStyles,
  getHiddenStyles,
  getResponsiveContainerStyles,
  getSymbolCellStyles,
  getFieldRangeStyles,
  getInfoDescriptionStyles,
  getExampleItemStyles,
  getSpecialCharactersTitleStyles,
  getTableRowStyles,
  getTableExampleChipStyles,
} from '../styles'
import { ANIMATION_CONFIG, defaultFields, defaultSpecialCharacters } from '../constants/cronSyntaxConstants'
import { LinSubHeader } from '../../../shared-components/LinSubHeader'

/**
 * <CronVisualExplanation fields={customFields} />
 * - Click a field → badge highlights + detailed info panel updates
 * - Info panel shows comprehensive descriptions and examples
 * - Special characters table explains cron syntax symbols
 */
const CronVisualExplanation = memo(function CronVisualExplanation({
  fields = defaultFields,
  onFieldChange,
  className,
}: CronVisualExplanationProps) {
  const [activeField, setActiveField] = useState<FieldData | null>(null)

  // Validate input data
  const validatedFields = useMemo(() => {
    if (!validateFieldData(fields)) {
      console.warn('Invalid field data provided, using default fields')
      return defaultFields
    }
    return fields
  }, [fields])

  const handleFieldClick = useCallback(
    (field: FieldData) => {
      setActiveField(prev => {
        const newValue = prev === field ? null : field
        if (onFieldChange) {
          onFieldChange(newValue)
        }
        return newValue
      })
    },
    [onFieldChange]
  )

  // Style functions (memoized only for theme-dependent styles)
  const mainContainerStyles = getMainContainerStyles()
  const hiddenStyles = getHiddenStyles()
  const responsiveContainerStyles = getResponsiveContainerStyles()
  const fieldRangeStyles = getFieldRangeStyles()

  return (
    <Box>
      {/* Title */}
      <LinSubHeader title="Cron Expression Syntax" />
      <Stack
        spacing={4}
        alignItems="center"
        sx={mainContainerStyles}
        className={className}
      >
        {/* Container for badges and rail */}
        <Box
          sx={responsiveContainerStyles}
          role="region"
          aria-labelledby="cron-syntax-title"
          aria-describedby="cron-field-instructions"
        >
          {/* Hidden instructions for screen readers */}
          <Typography id="cron-field-instructions" sx={hiddenStyles}>
            Interactive cron expression fields. Use Tab to navigate between
            fields, Enter or Space to select and view details.
          </Typography>

          {/* Rail behind the stars */}
          <Box 
            sx={{
              position: 'absolute',
              top: { xs: "15px", sm: "15px", md: "20px", lg: "20px", xl: "20px" },
              ml: "10%",
              mr: "10%",
              borderTop: (theme) => `2px dashed ${theme.palette.grey[400]}`,
              width: "80%",
              zIndex: 0,
            }} 
            aria-hidden="true" 
          />

          {/* Star badges */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{
              width: "100%", 
              px: 0,
              position: "relative",
              zIndex: 1
            }}
            role="tablist"
            aria-label="Cron expression fields"
          >
            {validatedFields.map((field, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  width: "200px"
                }}
                role="tab"
                tabIndex={0}
                aria-selected={activeField === field}
                aria-controls={activeField === field ? 'info-panel' : undefined}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleFieldClick(field)
                  }
                }}
                onClick={() => handleFieldClick(field)}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={ANIMATION_CONFIG.SPRING}
                  style={{
                    marginBottom: 12,
                    willChange: 'transform',
                  }}
                >
                  <Badge isActive={activeField === field}>
                    <EmergencyIcon 
                      sx={{ 
                        fontSize: { xs: '1rem', sm: '1rem', md: '1.25rem', lg: '1.25rem', xl: '1.25rem' },
                        color: "primary.contrastText"
                      }}
                      aria-hidden="true" 
                    />
                  </Badge>
                </motion.div>
                <Typography
                  variant="body2"
                  component="div"
                  textAlign="center"
                  sx={getFieldLabelStyles(activeField === field)}
                  aria-label={`${field.short} field, range ${field.range}. ${field.desc}`}
                >
                  <Box component="span" sx={{ display: { xs: 'block', sm: 'none' } }}>
                    {field.abbreviation}
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {field.short}
                  </Box>
                  <Box component="span" sx={fieldRangeStyles}>
                    {field.range}
                  </Box>
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Info Panel */}
        <Box
          id="info-panel"
          role="tabpanel"
          aria-live="polite"
          aria-labelledby={
            activeField
              ? `field-${activeField.short.toLowerCase().replace(/\s+/g, '-')}`
              : undefined
          }
        >
          <InfoPanel activeField={activeField} />
        </Box>

        {/* Special Characters Table */}
        <SpecialCharactersTable characters={defaultSpecialCharacters} />
      </Stack>
    </Box>
  )
})

export default CronVisualExplanation

/* ---------- Sub‑components ---------- */

const InfoPanel = memo(({ activeField }: InfoPanelProps) => {
  const theme = useTheme()

  const cardStyles = useMemo(() => getCardStyles(theme), [theme])
  const codeBlockStyles = useMemo(() => getCodeBlockStyles(theme), [theme])
  const infoDescriptionStyles = getInfoDescriptionStyles()
  const exampleItemStyles = getExampleItemStyles()

  return (
    <Card sx={cardStyles}>
      <CardContent
        sx={{ 
          p: { xs: 2, sm: 2, md: 4, lg: 4, xl: 4 },
        }}
      >
        <AnimatePresence mode="wait">
          {activeField ? (
            <motion.div
              key={activeField.short}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: ANIMATION_CONFIG.DURATION.MEDIUM,
                ease: ANIMATION_CONFIG.EASE,
              }}
              style={{ willChange: 'opacity, transform' }}
            >
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
              >
                {activeField.short} {activeField.range}
              </Typography>

              <Typography variant="body2" paragraph sx={infoDescriptionStyles}>
                {activeField.detailedDesc}
              </Typography>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Examples:
              </Typography>

              <Stack spacing={1}>
                {activeField.examples.map((example, idx) => {
                  const { code, description } = parseExample(example)
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: idx * ANIMATION_CONFIG.STAGGER_DELAY,
                        duration: ANIMATION_CONFIG.DURATION.SHORT,
                        ease: 'easeOut',
                      }}
                      style={{ willChange: 'opacity, transform' }}
                    >
                      <Box sx={exampleItemStyles}>
                        <Typography component="code" sx={codeBlockStyles}>
                          {code}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: '0.8rem',
                          }}
                        >
                          {description}
                        </Typography>
                      </Box>
                    </motion.div>
                  )
                })}
              </Stack>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: ANIMATION_CONFIG.DURATION.MEDIUM,
                ease: ANIMATION_CONFIG.EASE,
              }}
              style={{ willChange: 'opacity' }}
            >
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Click a field above to view its details
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.6
                }}
              >
                Each field in a cron expression controls when your scheduled
                task runs. The five fields represent minute, hour, day of month,
                month, and day of week respectively. Use special characters like
                *, /, and , to create flexible scheduling patterns. Click a
                field to toggle its information panel.
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
})

InfoPanel.displayName = 'InfoPanel'

const Badge = memo(({ children, isActive }: BadgeProps) => {
  const theme = useTheme()
  const badgeStyles = useMemo(
    () => getBadgeStyles(isActive, theme),
    [isActive, theme]
  )

  return <Box sx={badgeStyles}>{children}</Box>
})

Badge.displayName = 'Badge'

const SpecialCharactersTable = memo(
  ({ characters = defaultSpecialCharacters }: SpecialCharactersTableProps) => {
    const theme = useTheme()

    // Validate input data
    const validatedCharacters = useMemo(() => {
      if (!validateSpecialCharactersData(characters)) {
        console.warn(
          'Invalid special characters data provided, using default characters'
        )
        return defaultSpecialCharacters
      }
      return characters
    }, [characters])

    const symbolCellStyles = useMemo(() => getSymbolCellStyles(theme), [theme])
    const tableRowStyles = useMemo(() => getTableRowStyles(theme), [theme])
    const specialCharactersTitleStyles = getSpecialCharactersTitleStyles()
    const tableExampleChipStyles = getTableExampleChipStyles()

    return (
      <Box>
        <Typography variant="h6" sx={specialCharactersTitleStyles}>
          Special Characters
        </Typography>

        <TableContainer component={Paper}>
          <Table size="small" aria-label="Special characters reference table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Symbol</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Examples</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validatedCharacters.map(char => (
                <TableRow key={char.symbol} sx={tableRowStyles}>
                  <TableCell>
                    <Chip label={char.symbol} sx={symbolCellStyles} />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: '0.8rem',
                      }}
                    >
                      {char.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.8rem',
                      }}
                    >
                      {char.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={1}>
                      {char.examples.map((example, idx) => (
                        <Box key={idx}>
                          <Chip
                            label={example.value}
                            sx={tableExampleChipStyles}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: '0.65rem',
                            }}
                          >
                            {example.meaning}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )
  }
)

SpecialCharactersTable.displayName = 'SpecialCharactersTable'

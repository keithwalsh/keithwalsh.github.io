import {
  Box,
  Stack,
  Typography,
  useTheme,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material'
import EmergencyIcon from '@mui/icons-material/Emergency'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useCallback, memo } from 'react'

// Local imports
import type {
  FieldData,
  CronVisualExplanationProps,
  InfoPanelProps,
  BadgeProps,
  SpecialCharactersTableProps,
} from '../types/cronSyntaxTypes'
import {
  validateFieldData,
  validateSpecialCharactersData,
  parseExample,
} from '../utils/cronSyntaxHelpers'
import {
  getMainContainerStyles,
  getContainerStyles,
  getRailStyles,
  getBadgeStyles,
  getCardStyles,
  getCodeBlockStyles,
  getFieldLabelStyles,
  getHiddenStyles,
  getResponsiveContainerStyles,
  getSymbolCellStyles,
  getFieldContainerStyles,
  getFieldRangeStyles,
  getInfoDescriptionStyles,
  getExampleItemStyles,
  getDefaultInfoTextStyles,
  getSpecialCharactersTitleStyles,
  getTableRowStyles,
  getTableExampleChipStyles,
  getTableExampleDescStyles,
} from '../styles'
import {
  defaultFields,
  defaultSpecialCharacters,
  ANIMATION_CONFIG,
} from '../constants/cronSyntaxConstants'

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
  const theme = useTheme()
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
  const railStyles = useMemo(() => getRailStyles(theme), [theme])
  const containerStyles = getContainerStyles()
  const mainContainerStyles = getMainContainerStyles()
  const hiddenStyles = getHiddenStyles()
  const responsiveContainerStyles = getResponsiveContainerStyles()
  const fieldContainerStyles = getFieldContainerStyles()
  const fieldRangeStyles = getFieldRangeStyles()

  return (
    <Box>
      {/* Title */}
      <Typography variant="h6" gutterBottom id="cron-syntax-title">
        Cron Expression Syntax
      </Typography>
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
          <Box sx={railStyles} aria-hidden="true" />

          {/* Star badges */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={containerStyles}
            role="tablist"
            aria-label="Cron expression fields"
          >
            {validatedFields.map((field, idx) => (
              <Box
                key={idx}
                sx={fieldContainerStyles}
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
                    <EmergencyIcon fontSize="medium" aria-hidden="true" />
                  </Badge>
                </motion.div>
                <Typography
                  variant="body2"
                  component="div"
                  textAlign="center"
                  sx={getFieldLabelStyles(activeField === field)}
                  aria-label={`${field.short} field, range ${field.range}. ${field.desc}`}
                >
                  {field.short}
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
  const defaultInfoTextStyles = getDefaultInfoTextStyles()

  return (
    <Card sx={cardStyles}>
      <CardContent sx={{ p: 4 }}>
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
                variant="h5"
                fontWeight={700}
                gutterBottom
                color="primary"
              >
                {activeField.short} {activeField.range}
              </Typography>

              <Typography variant="body1" paragraph sx={infoDescriptionStyles}>
                {activeField.detailedDesc}
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
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
                        <Typography variant="body2" color="text.secondary">
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
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Click on any field above to see detailed information
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={defaultInfoTextStyles}
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
    const tableExampleDescStyles = getTableExampleDescStyles()

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
                    <Typography fontWeight={600}>{char.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
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
                            sx={tableExampleDescStyles}
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

/**
 * @fileoverview Drag-and-drop zone component for file uploads with visual
 * feedback and keyboard accessibility.
 */

import { Box, Typography } from '@mui/material'
import { CloudUpload } from '@mui/icons-material'
import { ChangeEvent, DragEvent, useState } from 'react'

/**
 * Props for the DropZone component.
 */
interface DropZoneProps {
  /** File types to accept (e.g., 'image/*', '.pdf', etc.) */
  accept?: string
  /** Callback function triggered when a file is selected via click */
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  /** Callback function triggered when a file is dropped */
  onFileDrop?: (file: File) => void
  /** Optional validation function using pure utilities */
  validateFile?: (file: File) => boolean
}

/**
 * A drag-and-drop zone component that provides visual feedback and handles
 * file selection through both drag-and-drop and click interactions.
 *
 * @param props - The component props
 * @returns The DropZone component
 */
function DropZone({
  accept = 'image/*',
  onFileChange,
  onFileDrop,
  validateFile,
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  // Handle file processing for both drop and file input
  const processFile = (file: File) => {
    // Use validation function if provided, otherwise use default image validation
    const isValid = validateFile ? validateFile(file) : true

    if (!isValid && accept.includes('image')) {
      console.warn('Selected file may not be a valid image')
      return
    }

    // If onFileDrop callback is provided, use it, otherwise create a synthetic event
    if (onFileDrop) {
      onFileDrop(file)
    } else {
      // Create a synthetic event for backward compatibility
      const syntheticEvent = {
        target: { files: [file] },
        currentTarget: { files: [file] },
        nativeEvent: {} as Event,
        bubbles: false,
        cancelable: false,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: false,
        preventDefault: () => {},
        isDefaultPrevented: () => false,
        stopPropagation: () => {},
        isPropagationStopped: () => false,
        persist: () => {},
        timeStamp: Date.now(),
        type: 'change',
      } as unknown as ChangeEvent<HTMLInputElement>
      onFileChange(syntheticEvent)
    }
  }

  // Drag event handlers
  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(event.dataTransfer.files)
    const file = files[0]

    if (file) {
      processFile(file)
    }
  }

  // Click handler for the drop zone
  const handleClick = () => {
    const input = document.getElementById('file-input') as HTMLInputElement
    input?.click()
  }

  return (
    <Box
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label="Drag and drop files here or click to select"
      aria-describedby="file-upload-description"
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleClick()
        }
      }}
      sx={{
        width: '100%',
        minWidth: { xs: 280, sm: 280, md: 290, lg: 340, xl: 370 },
        minHeight: 210,
        borderColor: 'action.disabled',
        borderWidth: '2px',
        borderStyle: 'dashed',
        borderRadius: 1.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        mb: 2,
        backgroundColor: 'action.hover',
        '&:hover': {
          backgroundColor: 'action.selected',
          borderColor: 'text.secondary',
        },
        '&:focus-visible': {
          outline: '3px solid primary.main',
          outlineOffset: '2px',
        },
      }}
    >
      <CloudUpload
        sx={{
          fontSize: 48,
          color: isDragOver ? 'primary.main' : 'text.secondary',
          mb: 1,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: isDragOver ? 'primary.main' : 'text.primary',
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {isDragOver ? 'Drop your image here' : 'Drag & Drop or Click to Browse'}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          textAlign: 'center',
          mt: 0.5,
        }}
      >
        {isDragOver ? '' : 'Supports: JPG, PNG, GIF, WebP'}
      </Typography>
    </Box>
  )
}

export default DropZone

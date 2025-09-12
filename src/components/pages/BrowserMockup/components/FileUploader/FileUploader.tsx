/**
 * @fileoverview File upload component with drag-and-drop interface for
 * browser window mockup functionality.
 */

import { Box } from '@mui/material'
import { ChangeEvent } from 'react'
import { isImageFile } from '../../utils'
import DropZone from './DropZone'
import { LinInline, LinInstructionsCard } from '../../../../../components/shared-components'

/**
 * Props for the FileUploader component.
 */
interface FileUploaderProps {
  /** File types to accept (e.g., 'image/*', '.pdf', etc.) */
  accept?: string
  /** Callback function triggered when a file is selected */
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  /** Callback function triggered when a file is dropped */
  onFileDrop?: (file: File) => void
  /** Optional validation function using pure utilities */
  validateFile?: (file: File) => boolean
}

/**
 * A file upload component that provides an intuitive drag-and-drop interface
 * for selecting files with themed styling and visual feedback.
 *
 * @param props - The component props
 * @returns The FileUploader component
 */
function FileUploader({
  accept = 'image/*',
  onFileChange,
  onFileDrop,
  validateFile,
}: FileUploaderProps) {
  // Enhanced file change handler with optional validation
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Use validation function if provided, otherwise use default image validation
    const isValid = validateFile ? validateFile(file) : isImageFile(file)

    if (!isValid && accept.includes('image')) {
      console.warn('Selected file may not be a valid image')
    }

    onFileChange(event)
  }

  // Enhanced validation function for the DropZone
  const dropZoneValidateFile = (file: File) => {
    return validateFile ? validateFile(file) : isImageFile(file)
  }

  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'left' }}>
      <LinInline showDivider={false}>
        <LinInstructionsCard 
          heading="How to Use"
          body={
            <ol>
              <li>Drag and drop or click to select an image</li>
              <li>Image appears in browser mockup after upload</li>
              <li>Adjust the browser window width using the slider</li>
              <li>Click on the URL bar to edit the displayed address</li>
              <li>Click "Download" to save the mockup</li>
            </ol>
          }
        />
        <DropZone
          accept={accept}
          onFileChange={handleFileChange}
          onFileDrop={onFileDrop}
          validateFile={dropZoneValidateFile}
        />
      </LinInline>
      {/* Hidden file input */}
      <input
        id="file-input"
        type="file"
        accept={accept}
        onChange={handleFileChange}
        aria-label={`Select ${accept.includes('image') ? 'image' : 'file'} to upload`}
        style={{ display: 'none' }}
      />

      {/* Hidden description for screen readers */}
      <Box
        id="file-upload-description"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        Upload {accept.includes('image') ? 'an image file' : 'a file'} to
        display in the browser window mockup. You can drag and drop a file or
        click to select one.
      </Box>
    </Box>
  )
}

export default FileUploader

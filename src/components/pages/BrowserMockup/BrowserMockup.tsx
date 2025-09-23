import React, { useRef, useState, useEffect } from 'react'
import { Box, Container, useTheme, Alert } from '@mui/material'
import { BrowserWindow, FileUploader, SectionErrorBoundary } from './components'
import { useFileReader, useDownloadImage } from './hooks'
import { isImageFile, formatFileSize } from './utils/fileHelpers'
import {
  extractFileMetadata,
  createFileSummary,
} from './utils/fileMetadataHelpers'
import type { BrowserWindowRef } from './components/BrowserWindow/BrowserWindow'

function BrowserMockup() {
  const initialUrl = 'http://localhost:3000'
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const browserWindowRef = useRef<BrowserWindowRef>(null)
  const browserSectionRef = useRef<HTMLDivElement>(null)
  const [hasImageBeenLoaded, setHasImageBeenLoaded] = useState(false)

  // Use the custom file reader hook
  const {
    content: imageUrl,
    readFile,
    error,
    file,
  } = useFileReader({
    readAs: 'dataURL',
    acceptedTypes: ['image/*'],
    maxSize: 5 * 1024 * 1024, // 5MB limit
  })

  // Use the download hook
  const { downloadImage, isDownloading } = useDownloadImage()

  // Effect to handle smooth scroll transition when image is loaded for the first time
  useEffect(() => {
    if (imageUrl && !hasImageBeenLoaded) {
      setHasImageBeenLoaded(true)

      // Enhanced scroll with smoother, more dramatic movement
      const performSmoothScroll = () => {
        const element = browserSectionRef.current
        if (element) {
          requestAnimationFrame(() => {
            const elementRect = element.getBoundingClientRect()
            const currentScrollY = window.scrollY

            const targetScrollY = currentScrollY + elementRect.top - 5 // Scroll down much more

            window.scrollTo({
              top: Math.max(0, targetScrollY),
              behavior: 'smooth',
            })
          })
        }
      }

      setTimeout(() => performSmoothScroll(), 200)
    }
  }, [imageUrl, hasImageBeenLoaded])

  // Handler for file selection with business logic separated
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    await processFile(selectedFile)
  }

  // Handler for file drop
  const handleFileDrop = async (file: File) => {
    await processFile(file)
  }

  // Common file processing logic
  const processFile = async (selectedFile: File) => {
    // Extract metadata using pure utility functions
    const metadata = extractFileMetadata(selectedFile)
    const summary = createFileSummary(metadata)

    // Use pure utility function to check if it's an image
    if (!isImageFile(selectedFile)) {
      console.warn(`Selected file is not an image: ${selectedFile.type}`)
    }

    console.log(`Processing file: ${summary}`)
    await readFile(selectedFile)
  }

  // Handler for downloading the browser window
  const handleDownload = () => {
    const browserElement = browserWindowRef.current?.getBrowserWindowElement()
    if (browserElement) {
      downloadImage(browserElement, {
        filename: 'browser-window-screenshot',
        format: 'png',
        backgroundColor: isDark ? '#121212' : '#ffffff',
      })
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 0,
              maxWidth: 600,
              mx: { xs: 2, sm: 3, md: 3, lg: 3, xl: 3 },
            }}>
            {error}
          </Alert>
        )}

        {file && (
          <Alert
            severity="success"
            sx={{
              mb: 0,
              maxWidth: 600,
              mx: { xs: 2, sm: 3, md: 3, lg: 3, xl: 3 },
            }}
          >
            Selected: {file.name} ({formatFileSize(file.size)})
          </Alert>
        )}

        <SectionErrorBoundary sectionName="File Uploader">
          <FileUploader
            accept="image/*"
            onFileChange={handleFileSelect}
            onFileDrop={handleFileDrop}
          />
        </SectionErrorBoundary>

        {imageUrl && typeof imageUrl === 'string' && (
          <SectionErrorBoundary sectionName="Browser Window Preview">
            <Box
              ref={browserSectionRef}
              sx={{
                opacity: hasImageBeenLoaded ? 1 : 0,
                transform: hasImageBeenLoaded
                  ? 'translateY(0)'
                  : 'translateY(40px)',
                transition:
                  'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                mt: 4, // Add even more top margin for dramatic scroll effect
                mx: 2,
                width: '100%',
              }}
            >
              <BrowserWindow
                ref={browserWindowRef}
                imageUrl={imageUrl}
                url={initialUrl}
                initialWidth={700}
                onDownload={handleDownload}
                isDownloading={isDownloading}
              />
            </Box>
          </SectionErrorBoundary>
        )}
      </Box>
    </Container>
  )
}

export default BrowserMockup

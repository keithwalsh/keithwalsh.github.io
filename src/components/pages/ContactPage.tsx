/**
 * @fileoverview Contact page component providing contact information and a form for
 * user inquiries.
 */

import { Box, Container, Typography, TextField, Button, Stack } from "@mui/material"
import { useState } from "react"
import emailjs from '@emailjs/browser'
import { EMAIL_CONFIG } from "./config"

interface ContactFormData {
    name: string
    email: string
    phone: string
    message: string
}

interface EmailJSError extends Error {
    text?: string
    status?: number
}

export function ContactPage() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        message: ""
    })
    const [isSending, setIsSending] = useState(false)

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSending(true)

        try {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(formData.email)) {
                throw new Error('Please enter a valid email address')
            }

            const templateParams = {
                to_name: 'Admin',
                from_name: formData.name.trim(),
                from_email: formData.email.trim(),
                reply_to: formData.email.trim(),
                phone_number: formData.phone.trim(),
                message: formData.message.trim(),
            }

            // Validate required fields
            if (!templateParams.from_name || !templateParams.message) {
                throw new Error('Please fill in all required fields')
            }

            const result = await emailjs.send(
                EMAIL_CONFIG.SERVICE_ID,
                EMAIL_CONFIG.TEMPLATE_ID,
                templateParams,
                EMAIL_CONFIG.PUBLIC_KEY
            )

            if (result.status === 200) {
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    message: ""
                })
                alert('Message sent successfully!')
            } else {
                throw new Error(`Unexpected response status: ${result.status}`)
            }
        } catch (error) {
            const emailJSError = error as EmailJSError
            console.error('EmailJS Error:', {
                message: emailJSError.message,
                text: emailJSError.text,
                status: emailJSError.status
            })
            alert(emailJSError.text || emailJSError.message || 'Failed to send message. Please try again later.')
        } finally {
            setIsSending(false)
        }
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Contact Us
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Stack spacing={3}>
                        <TextField
                            required
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Phone (optional)"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Message"
                            name="message"
                            multiline
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isSending}
                            sx={{ mt: 2 }}
                        >
                            {isSending ? 'Sending...' : 'Send Message'}
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Container>
    )
}

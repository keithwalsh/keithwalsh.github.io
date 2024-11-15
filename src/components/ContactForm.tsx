/**
 * @fileoverview Contact form component using Formik for form management and EmailJS
 * for email delivery.
 */

import { TextField, Button, Box } from "@mui/material"
import { useFormik } from "formik"
import * as yup from "yup"
import emailjs from "@emailjs/browser" 
import { EMAIL_CONFIG } from "./pages/config"
import { MuiTelInput } from 'mui-tel-input'

interface FormValues {
    name: string
    email: string
    phone: string
    message: string
}

const validationSchema = yup.object({
    name: yup
        .string()
        .required("Name is required"),
    email: yup
        .string()
        .email("Enter a valid email")
        .required("Email is required"),
    phone: yup
        .string()
        .optional(),
    message: yup
        .string()
        .required("Message is required")
})

const initialValues: FormValues = {
    name: "",
    email: "",
    phone: "",
    message: ""
}

interface ContactFormProps {
    onAlert: (message: string, severity: 'success' | 'error') => void
}

export function ContactForm({ onAlert }: ContactFormProps) {
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await emailjs.send(
                    EMAIL_CONFIG.SERVICE_ID,
                    EMAIL_CONFIG.TEMPLATE_ID,
                    {
                        from_name: values.name,
                        from_email: values.email,
                        phone: values.phone,
                        message: values.message
                    },
                    EMAIL_CONFIG.PUBLIC_KEY
                )
                resetForm()
                onAlert('Message sent successfully!', 'success')
            } catch (error) {
                onAlert('Failed to send message. Please try again.', 'error')
            } finally {
                setSubmitting(false)
            }
        }
    })

    const handlePhoneChange = (value: string) => {
        formik.setFieldValue('phone', value)
    }

    return (
        <>
            <Box 
                component="form"
                onSubmit={async (e) => {
                    e.preventDefault()
                    const errors = await formik.validateForm()
                    
                    if (Object.keys(errors).length > 0) {
                        onAlert('Please fill in all required fields', 'error')
                        return
                    }
                    
                    formik.handleSubmit(e)
                }}
                sx={{ width: '100%' }}
            >
                <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{ mb: 2 }}
                />
                <MuiTelInput
                    fullWidth
                    value={formik.values.phone}
                    onChange={handlePhoneChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    defaultCountry="US"
                    preferredCountries={['US', 'GB', 'CA']}
                    label="Phone (optional)"
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    id="message"
                    name="message"
                    label="Message"
                    multiline
                    rows={4}
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.message && Boolean(formik.errors.message)}
                    helperText={formik.touched.message && formik.errors.message}
                    sx={{ mb: 2 }}
                />
                <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    type="submit"
                >
                    Send Message
                </Button>
            </Box>
        </>
    )
} 
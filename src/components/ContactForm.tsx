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
import type { MuiTelInputProps } from 'mui-tel-input'

type CountryCode = MuiTelInputProps['defaultCountry']

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
    defaultCountry?: CountryCode
}

interface FormFieldProps {
    id: keyof FormValues
    label: string
    multiline?: boolean
    rows?: number
    formik: ReturnType<typeof useFormik<FormValues>>
}

function FormField({ id, label, multiline = false, rows, formik }: FormFieldProps) {
    return (
        <TextField
            fullWidth
            id={id}
            name={id}
            label={label}
            value={formik.values[id]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched[id] && Boolean(formik.errors[id])}
            helperText={formik.touched[id] && (formik.errors[id] as string)}
            multiline={multiline}
            rows={rows}
            sx={{ mb: 2 }}
        />
    )
}

export function ContactForm({ 
    onAlert, 
    defaultCountry = 'US' as CountryCode
}: ContactFormProps) {
    const formik = useFormik<FormValues>({
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
                        phone_number: values.phone,
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
                <FormField id="name" label="Name" formik={formik} />
                <FormField id="email" label="Email" formik={formik} />
                <MuiTelInput
                    fullWidth
                    value={formik.values.phone}
                    onChange={handlePhoneChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    defaultCountry={defaultCountry}
                    preferredCountries={['US', 'GB', 'CA']}
                    label="Phone (optional)"
                    sx={{ mb: 2 }}
                />
                <FormField 
                    id="message" 
                    label="Message" 
                    multiline 
                    rows={4} 
                    formik={formik} 
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
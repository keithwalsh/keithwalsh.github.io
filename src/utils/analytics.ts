/**
 * @fileoverview Google Analytics 4 configuration and tracking utilities for React
 * application.
 */

import ReactGA4 from 'react-ga4'

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX' // Replace with your actual Measurement ID

export const initGA = () => {
  try {
    ReactGA4.initialize(GA_MEASUREMENT_ID)
    console.log('GA initialized successfully')
  } catch (error) {
    console.error('Error initializing GA:', error)
  }
}

export const logPageView = (path: string) => {
  try {
    ReactGA4.send({
      hitType: 'pageview',
      page: path,
    })
    console.log('Pageview logged:', path)
  } catch (error) {
    console.error('Error logging pageview:', error)
  }
}

export const logEvent = (category: string, action: string) => {
  ReactGA4.event({
    category: category,
    action: action,
  })
}

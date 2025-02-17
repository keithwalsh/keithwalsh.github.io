/**
 * @fileoverview Google Analytics 4 configuration and tracking utilities for React
 * application.
 */

import ReactGA4 from 'react-ga4'

export const initGA = (measurementId: string) => {
  ReactGA4.initialize(measurementId)
}

export const logPageView = (path: string) => {
  ReactGA4.send({
    hitType: 'pageview',
    page: path,
  })
}

export const logEvent = (category: string, action: string) => {
  ReactGA4.event({
    category: category,
    action: action,
  })
}

/**
 * @fileoverview Custom hook for managing accordion expansion state and change handler
 */

import { useState } from 'react'

export function useAccordionChange() {
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  return { expanded, handleChange }
}

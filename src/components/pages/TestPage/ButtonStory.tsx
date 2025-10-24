/**
 * @fileoverview Example story demonstrating the Button component using the
 * ComponentPreview system.
 */

import { Button } from '@mui/material';
import { ComponentPreview, PropDefinition } from './ComponentPreview';

const codeExample = `import * as React from 'react';
import Button from '@mui/material/Button';

export default function BasicButton() {
  return (
    <Button variant="contained">
      Click Me
    </Button>
  );
}`;

// Define the props configuration
const propDefinitions: PropDefinition[] = [
  {
    name: 'variant',
    description: 'The variant to use.',
    type: '"text" | "outlined" | "contained"',
    defaultValue: 'contained',
    controlType: 'select',
    options: ['text', 'outlined', 'contained']
  },
  {
    name: 'color',
    description: 'The color of the component.',
    type: '"primary" | "secondary" | "success" | "error" | "info" | "warning"',
    defaultValue: 'primary',
    controlType: 'select',
    options: ['primary', 'secondary', 'success', 'error', 'info', 'warning']
  },
  {
    name: 'size',
    description: 'The size of the component.',
    type: '"small" | "medium" | "large"',
    defaultValue: 'medium',
    controlType: 'select',
    options: ['small', 'medium', 'large']
  },
  {
    name: 'disabled',
    description: 'If true, the component is disabled.',
    type: 'boolean',
    defaultValue: false,
    controlType: 'boolean'
  },
  {
    name: 'fullWidth',
    description: 'If true, the button will take up the full width of its container.',
    type: 'boolean',
    defaultValue: false,
    controlType: 'boolean'
  },
  {
    name: 'text',
    description: 'The text to display on the button.',
    type: 'string',
    defaultValue: 'Click Me',
    controlType: 'text'
  },
  {
    name: 'onClick',
    description: 'Callback fired when the button is clicked.',
    type: '(event: MouseEvent) => void',
    defaultValue: '-',
    controlType: 'callback'
  }
];

export const ButtonStory = () => {
  // Render function for the component
  const renderButton = (props: Record<string, any>) => {
    return (
      <Button
        variant={props.variant}
        color={props.color}
        size={props.size}
        disabled={props.disabled}
        fullWidth={props.fullWidth}
        onClick={() => alert('Button clicked!')}
      >
        {props.text || 'Click Me'}
      </Button>
    );
  };

  return (
    <ComponentPreview
      title="Button"
      description="Buttons allow users to take actions and make choices with a single tap."
      codeExample={codeExample}
      propDefinitions={propDefinitions}
      renderComponent={renderButton}
      initialProps={{
        variant: 'contained',
        color: 'primary',
        size: 'medium',
        disabled: false,
        fullWidth: false,
        text: 'Click Me'
      }}
    />
  );
};


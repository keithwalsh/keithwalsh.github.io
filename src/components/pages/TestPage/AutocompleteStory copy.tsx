/**
 * @fileoverview Example story demonstrating the Autocomplete component using
 * the ComponentPreview system.
 */

import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { ComponentPreview, PropDefinition } from './ComponentPreview';

// Define the movie option type
interface MovieOption {
  label: string;
  year: number;
}

// Top 100 films as per IMDB
const top100Films: MovieOption[] = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
  { label: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { label: 'The Good, the Bad and the Ugly', year: 1966 },
  { label: 'Fight Club', year: 1999 },
  { label: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { label: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { label: 'Forrest Gump', year: 1994 },
  { label: 'Inception', year: 2010 },
  { label: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: 'Goodfellas', year: 1990 },
  { label: 'The Matrix', year: 1999 },
  { label: 'Seven Samurai', year: 1954 },
  { label: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { label: 'City of God', year: 2002 },
  { label: 'Se7en', year: 1995 },
  { label: 'The Silence of the Lambs', year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: 'Life Is Beautiful', year: 1997 },
  { label: 'The Usual Suspects', year: 1995 },
  { label: 'Léon: The Professional', year: 1994 },
  { label: 'Spirited Away', year: 2001 },
  { label: 'Saving Private Ryan', year: 1998 },
  { label: 'Once Upon a Time in the West', year: 1968 },
];

const codeExample = `import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import top100Films from './top100Films';

export default function ComboBox() {
  return (
    <Autocomplete
      disablePortal
      options={top100Films}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
  );
}`;

// Define the props configuration
const propDefinitions: PropDefinition[] = [
  {
    name: 'disabled',
    description: 'If true, the component is disabled.',
    type: 'boolean',
    defaultValue: false,
    controlType: 'boolean'
  },
  {
    name: 'loading',
    description: 'If true, the component is in a loading state.',
    type: 'boolean',
    defaultValue: false,
    controlType: 'boolean'
  },
  {
    name: 'size',
    description: 'The size of the component.',
    type: '"small" | "medium"',
    defaultValue: 'medium',
    controlType: 'select',
    options: ['small', 'medium']
  },
  {
    name: 'variant',
    description: 'The variant to use for the TextField.',
    type: '"outlined" | "filled" | "standard"',
    defaultValue: 'outlined',
    controlType: 'select',
    options: ['outlined', 'filled', 'standard']
  },
  {
    name: 'width',
    description: 'The width of the component in pixels.',
    type: 'number',
    defaultValue: 300,
    controlType: 'number',
    min: 200,
    max: 500,
    step: 10
  },
  {
    name: 'placeholder',
    description: 'Placeholder text for the input field.',
    type: 'string',
    defaultValue: 'Search movies...',
    controlType: 'text'
  },
  {
    name: 'onChange',
    description: 'Callback fired when the value changes.',
    type: '(event: SyntheticEvent, value: T) => void',
    defaultValue: '-',
    controlType: 'callback'
  },
  {
    name: 'options',
    description: 'Array of options.',
    type: 'T[]',
    defaultValue: '-',
    controlType: 'object'
  }
];

export const AutocompleteStory = () => {
  const [selectedMovie, setSelectedMovie] = useState<MovieOption | null>(null);

  // Render function for the component
  const renderAutocomplete = (props: Record<string, any>) => {
    return (
      <Autocomplete
        disablePortal
        options={top100Films}
        sx={{ width: props.width || 300 }}
        value={selectedMovie}
        onChange={(_, newValue) => setSelectedMovie(newValue)}
        disabled={props.disabled}
        loading={props.loading}
        size={props.size}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Movie"
            variant={props.variant}
            placeholder={props.placeholder}
          />
        )}
      />
    );
  };

  return (
    <ComponentPreview
      title="Combo box"
      description="The value must be chosen from a predefined set of allowed values."
      codeExample={codeExample}
      propDefinitions={propDefinitions}
      renderComponent={renderAutocomplete}
      initialProps={{
        disabled: false,
        loading: false,
        size: 'medium',
        variant: 'outlined',
        width: 300,
        placeholder: 'Search movies...'
      }}
    />
  );
};


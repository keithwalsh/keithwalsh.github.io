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
    name: 'inputData',
    description: 'The outer array represents rows. The inner array represent cells within each row.',
    type: 'string[][] | null',
    defaultValue: 'null',
    controlType: 'object'
  },
  {
    name: 'columnAlignments',
    description: "Acceptable values are 'left', 'center', 'right', or 'none'. Defaults to 'none' when unspecified.",
    type: 'readonly Alignment[]',
    defaultValue: '[]',
    controlType: 'object'
  },
  {
    name: 'isCompact',
    description: 'Disables column width alignment to provide a more compact markdown table string.',
    type: 'boolean',
    defaultValue: false,
    controlType: 'boolean'
  },
  {
    name: 'hasPadding',
    description: 'One space added before and after the content in each cell.',
    type: 'boolean',
    defaultValue: true,
    controlType: 'boolean'
  },
  {
    name: 'hasTabs',
    description: 'Adds a tab character after each | and before the content.',
    type: 'boolean',
    defaultValue: false,
    controlType: 'boolean'
  },
  {
    name: 'hasHeader',
    description: 'Indicates whether the first row of `data` is a header.',
    type: 'boolean',
    defaultValue: true,
    controlType: 'boolean'
  },
  {
    name: 'convertLineBreaks',
    description: 'Replace newlines with <br> tags in table cells.',
    type: 'boolean',
    defaultValue: false,
    controlType: 'boolean'
  },
  {
    name: 'topPadding',
    description: 'Controls the padding-top (in pixels) of the <pre> element display.',
    type: 'number',
    defaultValue: 16,
    controlType: 'number'
  },
  {
    name: 'theme',
    description: 'Controls the colour scheme of the <pre> element display.',
    type: "'light' | 'dark'",
    defaultValue: 'light',
    controlType: 'select'
  },
  {
    name: 'className',
    description: 'Class will be applied to the <pre> element display.',
    type: 'string',
    defaultValue: 'undefined',
    controlType: 'string'
  },
  {
    name: 'preStyle',
    description: 'Allows direct styling of the display with CSS properties.',
    type: 'React.CSSProperties',
    defaultValue: 'undefined',
    controlType: 'object'
  },
  {
    name: 'minWidth',
    description: 'Optional minimum width in pixels for the table container.',
    type: 'number',
    defaultValue: 'undefined',
    controlType: 'number'
  },
  {
    name: 'showLineNumbers',
    description: 'Show or hide line numbers in the code block.',
    type: 'boolean',
    defaultValue: true,
    controlType: 'boolean'
  },
  {
    name: 'onGenerate',
    description: 'Callback to receive the generated Markdown table string.',
    type: '(markdownTableString: string) => void',
    defaultValue: 'undefined',
    controlType: 'callback'
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


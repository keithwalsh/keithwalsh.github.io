/**
 * @fileoverview Example story demonstrating the MarkdownTable component using
 * the ComponentPreview system.
 */

import { MarkdownTable } from 'react-markdown-table-ts';
import { ComponentPreview, PropDefinition } from './ComponentPreview';

// Sample data for the markdown table
const sampleTableData: string[][] = [
  ['Package ID', 'Weight (kg)', 'Status', 'Destination'],
  ['PKG-2024-001', '12.50', 'In Transit', 'Dublin, IE'],
  ['PKG-2024-002', '3.75', 'Delivered', 'New York, US'],
  ['PKG-2024-003', '8.20', 'Processing', 'Frankfurt, DE'],
  ['PKG-2024-004', '5.60', 'In Transit', 'London, GB']
];

const codeExample = `import { MarkdownTable } from 'react-markdown-table-ts';

const data: string[][] = [
  ['Package ID', 'Weight (kg)', 'Status', 'Destination'],
  ['PKG-2024-001', '12.50', 'In Transit', 'Dublin, IE'],
  ['PKG-2024-002', '3.75', 'Delivered', 'New York, US'],
  ['PKG-2024-003', '8.20', 'Processing', 'Frankfurt, DE'],
  ['PKG-2024-004', '5.60', 'In Transit', 'London, GB']
];

export default function TableExample() {
  return (
    <MarkdownTable
      inputData={data}
      columnAlignments={['left', 'center', 'center', 'left']}
      theme="light"
      showLineNumbers={true}
    />
  );
}`;

// Define the props configuration
const propDefinitions: PropDefinition[] = [
  {
    name: 'inputData',
    description: 'Outer arrays are rows; inner arrays are cells.',
    type: 'string[][] | null',
    defaultValue: 'null',
    controlType: 'object'
  },
  {
    name: 'columnAlignments',
    description: "One of 'left', 'center', 'right', or 'none'. Defaults to 'none'.",
    type: 'readonly Alignment[]',
    defaultValue: '[]',
    controlType: 'object'
  },
  {
    name: 'isCompact',
    description: 'Disables column width alignment.',
    type: 'boolean',
    defaultValue: 'false',
    controlType: 'boolean'
  },
  {
    name: 'hasPadding',
    description: 'Adds a space before and after cell content.',
    type: 'boolean',
    defaultValue: 'true',
    controlType: 'boolean'
  },
  {
    name: 'hasTabs',
    description: 'Adds a tab character after each | and before the content.',
    type: 'boolean',
    defaultValue: 'false',
    controlType: 'boolean'
  },
  {
    name: 'hasHeader',
    description: 'Indicates whether the first row of `data` is a header.',
    type: 'boolean',
    defaultValue: 'true',
    controlType: 'boolean'
  },
  {
    name: 'convertLineBreaks',
    description: 'Replace newlines with <br> tags in table cells.',
    type: 'boolean',
    defaultValue: 'false',
    controlType: 'boolean'
  },
  {
    name: 'topPadding',
    description: 'Sets the <pre> element\'s top padding.',
    type: 'number',
    defaultValue: '16',
    controlType: 'number'
  },
  {
    name: 'theme',
    description: 'Controls the display colour scheme.',
    type: "'light' | 'dark'",
    defaultValue: 'light',
    controlType: 'select',
    options: ['light', 'dark']
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
    defaultValue: 'true',
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
  // Render function for the component
  const renderMarkdownTable = (props: Record<string, any>) => {
    // Use sample data if inputData is not provided, null, or empty
    const tableData = props.inputData && props.inputData.length > 0 
      ? props.inputData 
      : sampleTableData;
    
    return (
      <MarkdownTable
        inputData={tableData}
        columnAlignments={['left', 'right', 'center', 'none']}
        isCompact={props.isCompact}
        hasPadding={props.hasPadding}
        hasTabs={props.hasTabs}
        hasHeader={props.hasHeader}
        convertLineBreaks={props.convertLineBreaks}
        topPadding={props.topPadding}
        theme={props.theme}
        className={props.className}
        preStyle={props.preStyle}
        minWidth={props.minWidth}
        showLineNumbers={props.showLineNumbers}
        onGenerate={props.onGenerate}
      />
    );
  };

  return (
    <ComponentPreview
      title="Markdown Table"
      description="A React component that converts structured data into Markdown table syntax and displays it within a <pre> tag."
      codeExample={codeExample}
      propDefinitions={propDefinitions}
      renderComponent={renderMarkdownTable}
      initialProps={{
        columnAlignments: [],
        isCompact: false,
        hasPadding: true,
        hasTabs: false,
        hasHeader: true,
        convertLineBreaks: false,
        topPadding: 16,
        theme: 'light',
        showLineNumbers: true
      }}
    />
  );
};


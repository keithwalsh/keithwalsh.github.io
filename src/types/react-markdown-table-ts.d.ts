declare module 'react-markdown-table-ts' {
  import { ComponentType } from 'react';

  type Alignment = 'left' | 'center' | 'right' | 'none';

  export interface MarkdownTableProps {
    inputData?: string[][] | null;
    columnAlignments?: readonly Alignment[];
    isCompact?: boolean;
    hasPadding?: boolean;
    hasTabs?: boolean;
    hasHeader?: boolean;
    convertLineBreaks?: boolean;
    topPadding?: number;
    theme?: 'light' | 'dark';
    className?: string;
    preStyle?: React.CSSProperties;
    minWidth?: number;
    showLineNumbers?: boolean;
    onGenerate?: (markdownTableString: string) => void;
  }

  export const MarkdownTable: ComponentType<MarkdownTableProps>;
}


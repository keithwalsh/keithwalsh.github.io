/**
 * @fileoverview Type declarations for @microlink/react-json-view package.
 */

declare module '@microlink/react-json-view' {
  import { Component } from 'react';

  interface ReactJsonProps {
    src: any;
    name?: string | false;
    theme?: string | object;
    style?: React.CSSProperties;
    indentWidth?: number;
    collapsed?: boolean | number;
    collapseStringsAfterLength?: number | false;
    shouldCollapse?: (field: any) => boolean;
    enableClipboard?: boolean;
    displayObjectSize?: boolean;
    displayDataTypes?: boolean;
    displayArrayKey?: boolean;
    onEdit?: (edit: any) => void;
    onAdd?: (add: any) => void;
    onDelete?: (del: any) => void;
    onSelect?: (select: any) => void;
    sortKeys?: boolean;
    quotesOnKeys?: boolean;
    groupArraysAfterLength?: number;
    iconStyle?: string;
    validationMessage?: string;
  }

  export default class ReactJson extends Component<ReactJsonProps> {}
}

// Type definitions for CronSyntaxBar component

export interface FieldData {
    short: string;
    range: string;
    desc: string;
    detailedDesc: string;
    examples: string[];
  }
  
  export interface SpecialCharacterData {
    symbol: string;
    name: string;
    description: string;
    examples: {
      value: string;
      meaning: string;
    }[];
  }
  
  export interface CronVisualExplanationProps {
    fields?: FieldData[];
    title?: string;
    onFieldChange?: (field: FieldData | null) => void;
    className?: string;
  }
  
  export interface InfoPanelProps {
    activeField: FieldData | null;
  }
  
  export interface BadgeProps {
    children: React.ReactNode;
    isActive: boolean;
  }
  
  export interface SpecialCharactersTableProps {
    characters?: SpecialCharacterData[];
  } 
import {AuxTextBoxConfig} from "./AuxTextBox/types";

export enum EAuxSize { S, M, L }
export enum EAuxAlignH { L, C, R }
export enum EAuxAlignV { T, M, B }

export type AuxCommonProps = {
  id?: string;
  extData?: any;
  className?: string;
};

export type AuxCommonTextBoxProps = AuxCommonProps & {
  text?: string;
};

export type AuxTextBoxProps = AuxCommonTextBoxProps & {
  props?: AuxTextBoxConfig;
};

export type AuxLevelTextBoxProps = AuxTextBoxProps & {
  level?: number;
  isExpanded?: boolean;
  isExpanderVisible?: boolean;
  onExpanderClick?: (id?: string, extData?: any, isExpanded?: boolean) => number[];
  onExpanderRows?: (rowNums: number[], isExpanded?: boolean) => void;
};

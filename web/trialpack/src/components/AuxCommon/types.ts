import {AuxTextBoxConfig} from "./AuxTextBox/types";

export enum EAuxSize { S, M, L }
export enum EAuxAlignH { L, C, R }
export enum EAuxAlignV { T, M, B }

export type AuxCommonProps = {
  id?: string;
  className?: string;
}

export type AuxCommonTextBoxProps = AuxCommonProps & {
  text?: string;
}

export type AuxTextBoxProps = AuxCommonTextBoxProps & {
  props?: AuxTextBoxConfig;
};

export type AuxLevelTextBoxProps = AuxTextBoxProps & {
  isExpanderVisible?: boolean;
};

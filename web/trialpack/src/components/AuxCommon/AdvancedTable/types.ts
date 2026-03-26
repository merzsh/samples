import React from "react";
import {AuxTextBoxProps, AuxLevelTextBoxProps} from "../types";

export enum EAdvTblBackground { HEADER }

export type AdvTblCellBorder = {
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
}

export type AuxCompsProps = AuxTextBoxProps | AuxLevelTextBoxProps;

export type AdvTblCellPropsAbstract<T extends AuxCompsProps> = {
  id: string;
  border: AdvTblCellBorder;
  component: React.FC<T>;
  componentProps: T;
  background?: EAdvTblBackground;
}

export type AdvTblCellProps<T> = T extends AuxCompsProps ? AdvTblCellPropsAbstract<T> : never;

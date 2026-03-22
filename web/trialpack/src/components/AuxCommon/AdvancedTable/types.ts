import React from "react";
import {AuxTextBoxProps} from "../AuxTextBox/AuxTextBox";

export enum EAdvTblBackground { HEADER }

export type AdvTblCellBorder = {
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
}

export type AdvTblCellProps = {
  id: string;
  border: AdvTblCellBorder;
  component: React.FC<any>;
  componentProps: AuxTextBoxProps,
  background?: EAdvTblBackground;
}

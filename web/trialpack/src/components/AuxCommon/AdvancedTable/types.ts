import {ReactElement} from "react";

export enum EAdvTblBackground { HEADER }

export type AdvTblCellBorder = {
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
}

export type AdvTblCellProps = {
  id: string;
  component: ReactElement;
  border: AdvTblCellBorder;
  background?: EAdvTblBackground;
}

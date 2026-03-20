import {EAuxAlignH, EAuxAlignV, EAuxSize} from "../types";

export type AuxLabelConfig = {
  fontSize?: EAuxSize;
  alignH?: EAuxAlignH;
  alignV?: EAuxAlignV;
  isBold?: boolean;
  isNonSelectable?: boolean;
}

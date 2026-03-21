import {EAuxAlignH, EAuxAlignV, EAuxSize} from "../types";

export type AuxTextBoxConfig = {
  fontSize?: EAuxSize;
  alignH?: EAuxAlignH;
  alignV?: EAuxAlignV;
  isBold?: boolean;
  isNonSelectable?: boolean;
  isEditable?: boolean;
}

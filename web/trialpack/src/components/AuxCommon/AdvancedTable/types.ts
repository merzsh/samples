/**
 * TrialPack is web application contains several basic samples to ease web development experience.
 * Copyright (c) 2024-2026 Andrew Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
 *
 * This file is part of TrialPack.
 *
 * TrialPack is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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
  isHorizResizable?: boolean;
}

export type AdvTblCellProps<T> = T extends AuxCompsProps ? AdvTblCellPropsAbstract<T> : never;

export type AdvTblRowSelectStyles = {
  dataCellBackSelected: string;
  headerCellBackSelected: string;
  headerCellBackUnselected: string;
}

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

import {AuxTextBoxConfig} from "./AuxTextBox/types";
import React from "react";
import {AdvTblCellProps, AuxCompsProps} from "./AdvancedTable/types";
import {AuxGantBoxConfig} from "./AuxGantBox/types";

export enum EAuxSize { S, M, L }
export enum EAuxAlignH { L, C, R }
export enum EAuxAlignV { T, M, B }

export enum EColID { A = 'A', B = 'B', C = 'C', D = 'D', E = 'E', F = 'F', G = 'G', H = 'H', I = 'I', J = 'J', K = 'K', L = 'L',
  M = 'M', N = 'N', O = 'O', P = 'P', Q = 'Q', R = 'R', S = 'S', T = 'T', U = 'U', V = 'V', W = 'W', X = 'X', Y = 'Y', Z = 'Z', }
export enum EAuxTextBoxType { TEXT = 'text', NUM = 'number', DATE = 'date' }

export enum EAuxCompExtData { CURR_COL_NAME = 'currColumnName', KEY_COL_VALUE = 'keyColumnValue' }

export type AuxCompExtData = {
  [EAuxCompExtData.CURR_COL_NAME]?: string;
  [EAuxCompExtData.KEY_COL_VALUE]?: string;
}

export type AuxCommonProps = {
  id?: string;
  extData?: any;
  className?: string;
};

export type AuxCommonTextBoxProps = AuxCommonProps & {
  value?: string;
  type?: EAuxTextBoxType;
  level?: number;
  onChange?: (value: string, prevValue?: string) => void;
};

export type AuxTextBoxProps = AuxCommonTextBoxProps & {
  props?: AuxTextBoxConfig;
};

export type AuxGantBoxProps = AuxCommonTextBoxProps & {
  props?: AuxGantBoxConfig;
};

export type OnExpanderRowsProps = {
  rowNums: number[];
  isExpanded?: boolean;
}

export type OnExpanderRowsTabProps = OnExpanderRowsProps & {
  tableId?: string;
  defaultSortColumn?: EColID;
  works?: AdvTblCellProps<AuxCompsProps>[][];
}

export type AuxLevelTextBoxProps = AuxTextBoxProps & {
  isExpanded?: boolean;
  isExpanderVisible?: boolean;
  onExpanderClick?: (id: string) => number[];
  onExpanderRows?: (props: OnExpanderRowsProps) => void;
};

export type AdvancedTableProps = AuxCommonProps & {
  header: AdvTblCellProps<AuxTextBoxProps>[][];
  works: AdvTblCellProps<AuxCompsProps>[][];
  headerCellUnionsMapping?: Map<string, number>;
  defaultSortColumn?: EColID;
  isWithRowNums?: boolean;
  freeRowsCount?: number;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  onRowSelect?: (cellId: string, isRowSelected: boolean) => void;
  onExpanderRows?: (props: OnExpanderRowsProps) => void;
};

export type AuxViewsProps = AuxCommonProps & {
  resizerScreenAdjustmentInPx?: number;
}

export type AuxOnColumnResize = (e: React.MouseEvent<HTMLDivElement>) => void;

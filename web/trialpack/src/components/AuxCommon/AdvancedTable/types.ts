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
import {
  AuxCommonProps,
  EColID,
  OnExpanderRowsProps
} from "../types";
import {AuxCompsProps, OnGetChildrenIds} from "../AuxUiCompGenerator/types";

export enum EAdvTblBackground { HEADER }

export enum EBorderType {REGULAR, TIMELINE}

export type AdvTblCellBorder = {
  left?: EBorderType;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
}

export type AuxCompExtData = {
  currColumnName?: string;
  keyColumnValue?: string;
  rawValue?: string;
}

export type AdvTblCellPropsAbstract<T extends AuxCompsProps> = {
  id: string;
  border: AdvTblCellBorder;
  component: React.FC<T>;
  componentProps: T;
  extData?: AuxCompExtData,
  background?: EAdvTblBackground;
  isHorizResizable?: boolean;
  isGroupHighlighting?: boolean;
}

export type AdvTblCellProps<T> = T extends AuxCompsProps ? AdvTblCellPropsAbstract<T> : never;

export type AdvancedTableProps = AuxCommonProps & {
  header: AdvTblCellProps<AuxCompsProps>[][];
  data: AdvTblCellProps<AuxCompsProps>[][];
  headerCellUnionsMapping?: Map<string, number>;
  defaultSortColumn?: EColID;
  isWithRowNums?: boolean;
  freeRowsCount?: number;
  onGetChildrenIds?: OnGetChildrenIds;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  onRowSelect?: (cellId: string, isRowSelected: boolean) => void;
  onExpanderRows?: (props: OnExpanderRowsProps) => void;
};

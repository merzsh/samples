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
import {AuxTextBoxProps} from "../AuxTextBox/types";
import {AuxLevelTextBoxProps} from "../AuxLevelTextBox/types";
import {AuxGantBoxProps} from "../AuxGantBox/types";
import {EColID, OnExpanderRowsProps} from "../types";

export type AuxCompsProps = AuxTextBoxProps | AuxLevelTextBoxProps | AuxGantBoxProps;

export type OnGetChildrenIds = (parentId: string) => string[];
export type OnGetPropsByCellId = (id: string, colId?: EColID) => AuxCompsProps | undefined;
export type OnGetRowNumByValue = (value: string) => number;
export type OnExpanderRows = (props: OnExpanderRowsProps) => void;

export type AuxUiCompGeneratorProps = {
  component: React.FC<AuxCompsProps>;
  componentProps: AuxCompsProps;
  tableId: string;
  defaultSortColumn?: EColID;
  onGetChildrenIds?: OnGetChildrenIds;
  onGetPropsByCellId?: OnGetPropsByCellId;
  onGetRowNumByValue?: OnGetRowNumByValue;
  onExpanderRows?: OnExpanderRows;
};

export type OnExpanderClickCallback = (id: string) => number[];
export type OnExpanderClickHandlerProps = {id: string} &
  Pick<AuxUiCompGeneratorProps, 'defaultSortColumn' | 'onGetChildrenIds' | 'onGetPropsByCellId' | 'onGetRowNumByValue'>
export type OnExpanderClickHandler = (props: OnExpanderClickHandlerProps) => number[];

export type OnExpanderRowsCallback = (props: OnExpanderRowsProps) => void;
export type OnExpanderRowsHandlerProps = OnExpanderRowsProps &
  Pick<AuxUiCompGeneratorProps, 'tableId' | 'onGetPropsByCellId' | 'onExpanderRows'>;
export type OnExpanderRowsHandler = (props: OnExpanderRowsHandlerProps) => void;

export type AuxFcCompsProps<T> = T extends React.FC<AuxTextBoxProps>
  ? AuxTextBoxProps
  : T extends React.FC<AuxLevelTextBoxProps>
    ? AuxLevelTextBoxProps
    : T extends React.FC<AuxGantBoxProps>
      ? AuxGantBoxProps
      : never;

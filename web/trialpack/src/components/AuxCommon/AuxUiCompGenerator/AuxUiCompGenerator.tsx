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

import React, {ReactElement, useCallback} from 'react';
import {AuxFcCompsProps, AuxUiCompGeneratorProps, OnExpanderClickCallback, OnExpanderRowsCallback} from "./types";
import AuxTextBox from "../AuxTextBox";
import AuxLevelTextBox from "../AuxLevelTextBox";
import AuxGantBox from "../AuxGantBox";
import {onExpanderClickHandler, onExpanderRowsHandler} from "./utils";

export const AuxUiCompGenerator: React.FC<AuxUiCompGeneratorProps> = (
  { component, componentProps, tableId, defaultSortColumn,
    onGetChildrenIds, onGetPropsByCellId, onGetRowNumByValue,
    onExpanderRows}
): ReactElement | undefined => {

  const onExpanderClickCallback = useCallback<OnExpanderClickCallback>((id) => {
    return onExpanderClickHandler({ id, defaultSortColumn, onGetChildrenIds, onGetPropsByCellId, onGetRowNumByValue });
  }, [defaultSortColumn, onGetChildrenIds, onGetPropsByCellId, onGetRowNumByValue]);

  const onExpanderRowsCallback = useCallback<OnExpanderRowsCallback>((
    {rowNums, isExpanded}
  ) => {
    return onExpanderRowsHandler({ rowNums, isExpanded, tableId, onGetPropsByCellId, onExpanderRows });
  }, [tableId, onGetPropsByCellId, onExpanderRows]);

  switch (component) {
    case AuxTextBox:
      return <AuxTextBox { ...componentProps as AuxFcCompsProps<typeof AuxTextBox> } />;
    case AuxLevelTextBox:
      const propsAuxLevelTextBox = {
        ...componentProps as AuxFcCompsProps<typeof AuxLevelTextBox>,
        onExpanderClick: onExpanderClickCallback,
        onExpanderRows: onExpanderRowsCallback,
      };
      return <AuxLevelTextBox { ...propsAuxLevelTextBox } />;
    case AuxGantBox:
      return <AuxGantBox {...componentProps as AuxFcCompsProps<typeof AuxGantBox>} />;
    default:
      return undefined;
  }
};

export default AuxUiCompGenerator;

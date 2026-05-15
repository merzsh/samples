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

import {AuxCompsProps, OnExpanderClickHandler, OnExpanderRowsHandler} from "./types";
import {EColID} from "../types";
import {STR_HTML_SPACE} from "../constants";

export const onExpanderClickHandler: OnExpanderClickHandler = (
  {id, defaultSortColumn, onGetChildrenIds,
    onGetPropsByCellId, onGetRowNumByValue}
) => {
  const result: number[] = [];
  if (!id || !defaultSortColumn || !onGetChildrenIds || !onGetPropsByCellId || !onGetRowNumByValue) return result;

  const props = onGetPropsByCellId(id, defaultSortColumn);
  if (props?.value === undefined) return result;

  const childrenIds = onGetChildrenIds(props.value);
  if (!childrenIds.length) return result;

  childrenIds
    .forEach(childrenId => {
      const rowNum = onGetRowNumByValue(childrenId);
      if (rowNum) result.push(rowNum);
    });

  return result;
};

export const onExpanderRowsHandler: OnExpanderRowsHandler = (
  {rowNums, isExpanded, tableId, onGetPropsByCellId, onExpanderRows}
) => {
  if (!rowNums.length || !onGetPropsByCellId) return;

  let expandedNodes: [number, boolean][] = [];
  const [start] = rowNums, end = rowNums[rowNums.length - 1], result: typeof rowNums = [];
  if (start <= 0 && end <= 0 && start > end) return;

  let props = onGetPropsByCellId(`${EColID.B}${start-1}`);

  if (!props) return;
  else if (!expandedNodes.length && props.level !== undefined && 'isExpanded' in props) {
    props.isExpanded = !!isExpanded;
    expandedNodes.push([props.level, props.isExpanded]);
  }

  const [expRoot] = expandedNodes, [_, expRootIsExpanded] = expRoot;
  let [expLastLevel, expLastIsExpanded] = expRoot;

  for (let i = start; i <= end; i++) {
    props = onGetPropsByCellId(`${EColID.B}${i}`);
    if (!props || !('isExpanded' in props)) continue;

    const STYLE_SHOW = 'table-row', STYLE_HIDE = 'none';
    let style;

    const checkExpPath = (): string => {
      for (let j = 0; j < expandedNodes.length; j++) {
        const exp = expandedNodes[j], [_, expIsExpanded] = exp;
        if (!expIsExpanded) {
          return STYLE_HIDE;
        }
      }
      return STYLE_SHOW;
    }

    if (!expRootIsExpanded) style = STYLE_HIDE;
    else {
      style = checkExpPath();

      if (props.isExpanderVisible && props.level !== undefined) {
        while (props.level <= expLastLevel && expandedNodes.length) {
          expandedNodes = expandedNodes.slice(0, expandedNodes.length - 1);
          [expLastLevel, expLastIsExpanded] = expandedNodes[expandedNodes.length - 1];
        }

        style = checkExpPath();

        expLastLevel = props.level;
        expLastIsExpanded = props.isExpanded;
        expandedNodes.push([expLastLevel, expLastIsExpanded]);
      }
    }

    const row = document.getElementById(`${tableId ?? ''}${i}`);
    if (row) {
      row.style.display = style;
      result.push(style === STYLE_SHOW ? i : -1 * i);
    }
  }

  if (onExpanderRows) onExpanderRows({ rowNums: result, isExpanded });
};

export function cloneCompProps<T extends AuxCompsProps>(
  componentProps: T, id?: string, isSetValue2empty = false
): T {

  return {
    ...componentProps,
    id: id ? id : componentProps.id,
    value: isSetValue2empty ? STR_HTML_SPACE : componentProps.value,
    props: {
      ...componentProps.props,
    },
  };
}

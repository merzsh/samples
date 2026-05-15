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

import {AdvTblCellProps, EAdvTblBackground} from "./types";
import AuxTextBox from "../AuxTextBox";
import {
  EAuxAlignH,
  EColID,
} from "../types";
import {STR_DIGITS} from "../constants";
import {ROW_SELECTION_STYLES} from "./constants";
import {AuxCompsProps} from "../AuxUiCompGenerator/types";
import {getColIdBySeqNumber} from "../utils";
import {cloneCompProps} from "../AuxUiCompGenerator/utils";

export function genEmptyRows(array: AdvTblCellProps<AuxCompsProps>[][], addedRowsCount: number):
  AdvTblCellProps<AuxCompsProps>[][] {

  if (!array.length || !addedRowsCount) return [];

  const result: typeof array = [];

  const cols = array[array.length - 1];

  for (let i = 0; i < addedRowsCount; i++) {
    const colsCopy: typeof cols = [];

    cols.forEach((col, ind) => {
      const id = `${getColIdBySeqNumber(ind)}`;

      const newCellProps: typeof col = {
        ...col,
        extData: {
          ...col.extData,
        },
        border: {
          ...col.border,
        }
      };
      newCellProps.componentProps = cloneCompProps(col.componentProps, id, true);

      colsCopy.push(newCellProps);
    })

    result.push(colsCopy);
  }

  return result;
}

export function genRowNumCell<T extends AdvTblCellProps<AuxCompsProps>>(colsRow: T[] , rowNum: number): T {
  if (!colsRow.length){
    throw new ReferenceError('colsRow is empty!');
  }

  const templateCol = colsRow.find(item => item.component === AuxTextBox);
  if (!templateCol){
    throw new ReferenceError('templateCol is empty!');
  }

  return {
    ...templateCol,
    id: `_${rowNum ? rowNum : ''}`,
    background: EAdvTblBackground.HEADER,
    componentProps: {
      ...templateCol.componentProps,
      extData: { currColumnName: '_'},
      props: {
        ...templateCol.componentProps.props,
        alignH: EAuxAlignH.C,
        isEditable: false,
        isReadOnlyMarkDisabled: true,
      },
      value: `${rowNum ? rowNum : ''}`,
    }
  };
}

export function sortDataRows(a: AdvTblCellProps<AuxCompsProps>[], b: AdvTblCellProps<AuxCompsProps>[],
                          defaultSortColumn = EColID.A): number {

  const cellA = a.find(
    item => getColNameByCellId(item.id) === defaultSortColumn);
  if (!cellA) return 0;

  const cellAData = cellA.componentProps.value;
  if (!cellAData) return 1;

  const cellB = b.find(
    item => getColNameByCellId(item.id) === defaultSortColumn);
  if (!cellB) return 0;

  const cellBData = cellB.componentProps.value;
  if (!cellBData) return 1;

  return cellAData < cellBData ? -1 : cellAData > cellBData ? 1 : 0;
}

export function setRowSelection(cellId: string, isRowSelected: boolean, rowColsCount: number, tableId?: string, ): void {
  if (!cellId || rowColsCount <= 0) return;

  let rowNum = parseInt(cellId.substring(1));
  rowNum = isNaN(rowNum) ? 0 : rowNum;
  if (!rowNum) return;

  for (let i = 0; i < rowColsCount; i++) {
    const cell = document.getElementById(
      `${tableId && tableId.length >= 4 ? tableId.substring(0, 4) + '@' : ''}${getColIdBySeqNumber(i)}${rowNum}`);

    if (cell && cell instanceof HTMLTableCellElement) {
      if (isRowSelected && !cell.classList.contains(ROW_SELECTION_STYLES.dataCellBackSelected)) {
        cell.classList.add(ROW_SELECTION_STYLES.dataCellBackSelected);
      } else {
        cell.classList.remove(ROW_SELECTION_STYLES.dataCellBackSelected);
      }
    }
  }

  const rowNumCell = document.getElementById(cellId);
  if (rowNumCell && rowNumCell instanceof HTMLTableCellElement) {
    const style2rem = isRowSelected ? ROW_SELECTION_STYLES.headerCellBackUnselected : ROW_SELECTION_STYLES.headerCellBackSelected;
    const style2add = isRowSelected ? ROW_SELECTION_STYLES.headerCellBackSelected : ROW_SELECTION_STYLES.headerCellBackUnselected;

    rowNumCell.classList.remove(style2rem);
    rowNumCell.classList.add(style2add);
  }
}

export function getComponentClass(colId: string): string {
  return colId.startsWith('_') ? 'comp-row-num' : 'comp-row-regular'
}

export function getRowNumByCellId(cellId: string): number {
  if (!cellId) return 0;

  let resultStrNum = '';
  const ids = cellId.split('@');

  cellId = ids.length === 1 ? ids[0] : ids[1];

  for (let i = 0; i < cellId.length; i++) {
    if (!STR_DIGITS.includes(cellId.charAt(i))) continue;
    else resultStrNum += cellId.charAt(i);
  }

  if (!resultStrNum) return 0;

  let result = parseInt(resultStrNum);

  return isNaN(result) ? 0 : result;
}

export function getColNameByCellId(cellId: string): string {
  let result = '';
  if (!cellId) return result;

  const ids = cellId.split('@');
  cellId = ids.length === 1 ? ids[0] : ids[1];

  for (let i = 0; i < cellId.length; i++) {
    if (!STR_DIGITS.includes(cellId.charAt(i))) {
      result += cellId.charAt(i);
    }
  }

  return result;
}

export function getTableShortId(tableFullId?: string): string {
  if (!tableFullId) return '';

  return tableFullId.substring(0,4) + '@';
}

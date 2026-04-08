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

import {AdvTblCellProps, AdvTblRowSelectStyles, AuxCompsProps, EAdvTblBackground} from "./types";
import React from "react";
import AuxTextBox from "../AuxTextBox";
import {AuxLevelTextBoxProps, EAuxAlignH, EColID, OnExpanderRowsProps} from "../types";
import AuxLevelTextBox from "../AuxLevelTextBox";

export function addEmptyRows(array: AdvTblCellProps<AuxCompsProps>[][], addedRowsCount: number):
  AdvTblCellProps<AuxCompsProps>[][] {

  if (!array.length || !addedRowsCount) return [];

  const cols = array[array.length-1];

  for (let i = 0; i < addedRowsCount; i++) {
    const colsCopy: AdvTblCellProps<AuxCompsProps>[] = [];

    cols.forEach((col, ind) => {
      const id = `${Object.values(EColID)[ind]}`;

      const newCellProps = {
        ...col,
        id,
        componentProps: {
          ...col.componentProps,
          id,
          value: '',
        },
      }

      colsCopy.push(newCellProps);
    })

    array.push(colsCopy);
  }

  return array;
}

export function getColsRow<T extends AdvTblCellProps<AuxCompsProps>>(colsRow: T[] , rowNum?: number): (T)[] {
  if (!colsRow.length) return [];

  if (rowNum !== undefined && colsRow.length) {
    const templateCol = colsRow.find(item => item.component === AuxTextBox);

    if (templateCol) {
      const rowNumCol = {
        ...templateCol,
        id: `_${rowNum ? rowNum : ''}`,
        background: EAdvTblBackground.HEADER,
        componentProps: {
          ...templateCol.componentProps,
          props: {
            ...templateCol.componentProps.props,
            alignH: EAuxAlignH.C,
            isEditable: false,
          },
          value: `${rowNum ? rowNum : ''}`,
        }
      };

      colsRow.unshift(rowNumCol);
    }
  }

  return colsRow;
}

export function sortWorks(a: AdvTblCellProps<AuxCompsProps>[], b: AdvTblCellProps<AuxCompsProps>[], defaultSortColumn = EColID.A): number {
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

export function setRowSelection(rowNumCellId: string, cellSelectionStyles: AdvTblRowSelectStyles, is2SelectRow?: boolean) {
  if (!rowNumCellId) return;

  let rowNum = parseInt(rowNumCellId.substring(1));
  rowNum = isNaN(rowNum) ? 0 : rowNum;
  if (!rowNum) return;

  const colIds = Object.values(EColID);
  const count = colIds.length;

  for (let i = 0; i < count; i++) {
    const cell = document.getElementById(`${colIds[i]}${rowNum}`);
    if (cell && cell instanceof HTMLTableCellElement) {
      if (is2SelectRow && !cell.classList.contains(cellSelectionStyles.dataCellBackSelected)) {
        cell.classList.add(cellSelectionStyles.dataCellBackSelected);
      } else {
        cell.classList.remove(cellSelectionStyles.dataCellBackSelected);
      }
    }
  }

  const rowNumCell = document.getElementById(rowNumCellId);
  if (rowNumCell && rowNumCell instanceof HTMLTableCellElement) {
    const style2rem = is2SelectRow ? cellSelectionStyles.headerCellBackUnselected : cellSelectionStyles.headerCellBackSelected;
    const style2add = is2SelectRow ? cellSelectionStyles.headerCellBackSelected : cellSelectionStyles.headerCellBackUnselected;

    rowNumCell.classList.remove(style2rem);
    rowNumCell.classList.add(style2add);
  }
}

export function onColumnResize(e: React.MouseEvent<HTMLDivElement>) {
  const target = e.target as HTMLDivElement;
  if (!target.parentElement) return;

  let startX = e.pageX;
  let startWidth = target.parentElement.offsetWidth;

  // Function to handle mouse movement during drag
  function onMouseMove(e: any) {
    if (!target.parentElement) return;

    const diffX = e.pageX - startX;
    // Calculate new width, preventing columns from becoming too small
    const newWidth = Math.max(50, startWidth + diffX);
    target.parentElement.style.width = newWidth + 'px';
  }

  // Function to stop resizing on mouse up
  function onMouseUp() {
    if (!target.parentElement) return;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    target.parentElement.classList.remove('active');
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

export function getComponentClass(colId: string): string {
  return colId.startsWith('_') ? 'comp-row-num' : 'comp-row-regular'
}

export function getRowNumByCellId(CellId: string): number {
  if (!CellId) return 0;

  let resultStrNum = '';

  for (let i = 0; i < CellId.length; i++) {
    if (!'0123456789'.includes(CellId.charAt(i))) continue;
    else resultStrNum += CellId.charAt(i);
  }

  if (!resultStrNum) return 0;

  let result = parseInt(resultStrNum);

  return isNaN(result) ? 0 : result;
}

export function getColNameByCellId(CellId: string): string {
  let result = '';
  if (!CellId) return result;

  for (let i = 0; i < CellId.length; i++) {
    if (!'0123456789'.includes(CellId.charAt(i))) {
      result += CellId.charAt(i);
    }
  }

  return result;
}

export function onExpanderRows({rowNums, isExpanded, works, defaultSortColumn}: OnExpanderRowsProps &
  {works?: AdvTblCellProps<AuxCompsProps>[][]; defaultSortColumn?: EColID;}) {

  if (!rowNums.length) return;

  const [row1st] = rowNums;
  if (!row1st) return;

  const work1st = works?.[row1st-1];
  if (!work1st) return;

  const comp = AuxLevelTextBox;

  const cell1st = [...work1st.values()].find(item =>
    item.component === comp);
  if (!cell1st) return;

  const cell1stProps: AuxLevelTextBoxProps = cell1st.componentProps;

  for (let i = 0; i < rowNums.length; i++) {
    let work = works?.[rowNums[i]-1];
    if (!work) return;

    if (defaultSortColumn) {
      const sortCell = [...work].find(item =>
        getColNameByCellId(item.id) === defaultSortColumn);
      if (sortCell && !sortCell.componentProps.value) return;
    }

    const cell = [...work].find(item =>
      item.component === comp);
    if (!cell) return;

    const cellProps: AuxLevelTextBoxProps = cell.componentProps;

    if (isExpanded && (cellProps.isExpanded === false || cellProps.isExpanded === undefined && cellProps.level === cell1stProps.level)) {
      cellProps.isExpanded = true;
    } else if (!isExpanded && cellProps.isExpanded) {
      cellProps.isExpanded = false;
    } else if (!isExpanded && cellProps.isExpanded === false) {
      cellProps.isExpanded = undefined;
    }

    const row = document.getElementById(`${rowNums[i].toString()}`);
    if (row) {
      row.style.display = cellProps.isExpanded ? 'table-row' : 'none';
    }
  }
}

export function getTableChildrenRows(works: AdvTblCellProps<AuxCompsProps>[][], id: string, defaultSortColumn: EColID): number[] {
  const result: number[] = [];

  if (!works.length || !id) return result;

  const masterRowNum = getRowNumByCellId(id);
  if (!masterRowNum) return result;

  const masterRow = works[masterRowNum-1];

  const masterCell = masterRow.find(
    item => getColNameByCellId(item.id) === defaultSortColumn);
  if (!masterCell) return result;

  const masterRowCodePrefix = masterCell.componentProps.value;
  if (typeof masterRowCodePrefix !== 'string') return result;

  for (let i = masterRowNum; i < works.length; i++) {
    const cell = works[i].find(
      item => getColNameByCellId(item.id) === defaultSortColumn);

    if (cell) {
      const currRowCode = cell.componentProps.value;
      if (typeof currRowCode === 'string' && currRowCode.startsWith(masterRowCodePrefix)) {
        result.push(i+1);
      }
    }
  }

  return result;
}

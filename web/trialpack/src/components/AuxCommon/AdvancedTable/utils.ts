import {AdvTblCellProps, AuxCompsProps, EAdvTblBackground} from "./types";
import React from "react";
import AuxTextBox from "../AuxTextBox";
import {COLUMN_IDS} from "../constants";

export function addEmptyRows(array: Map<string, AdvTblCellProps<AuxCompsProps>>[], addedRowsCount: number):
  Map<string, AdvTblCellProps<AuxCompsProps>>[] {

  if (!array.length || !addedRowsCount) return [];

  const cols = [...array[array.length-1].values()];
  const result = array.slice();

  for (let i = 0; i < addedRowsCount; i++) {
    const colsCopy = new Map<string, AdvTblCellProps<AuxCompsProps>>();

    cols.forEach((col, ind) => {
      const id = `${COLUMN_IDS[ind]}${array.length + i + 1}`;

      const newCellProps = {
        ...col,
        id,
        componentProps: {
          ...col.componentProps,
          id,
          text: '',
        },
      }

      colsCopy.set(id, newCellProps);
    })

    result.push(colsCopy);
  }

  return result;
}

export function getColsRow<T extends AdvTblCellProps<AuxCompsProps>>(colsRow: Map<string, T> , rowNum?: number): (T)[] {
  if (!colsRow.size) return [];

  const result = [...colsRow.values()];

  if (rowNum !== undefined && result.length) {
    const templateCol = result.find(item => item.component === AuxTextBox);

    if (templateCol) {
      const rowNumCol = {
        ...templateCol,
        id: `_${rowNum ? rowNum : ''}`,
        background: EAdvTblBackground.HEADER,
        componentProps: {
          ...templateCol.componentProps,
          text: `${rowNum ? rowNum : ''}`,
        }
      };

      result.unshift(rowNumCol);
    }
  }

  return result;
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

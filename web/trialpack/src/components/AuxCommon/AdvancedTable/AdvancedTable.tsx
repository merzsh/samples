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

import * as s from './AdvancedTable.modules.scss';
import React, {ReactElement, useCallback, useRef} from 'react';
import clsx from 'clsx';
import {AdvTblCellProps, AdvTblCellPropsAbstract, AuxCompsProps, EAdvTblBackground} from "./types";
import AuxTextBox from "../AuxTextBox";
import {AuxLevelTextBoxProps, AuxTextBoxProps} from "../types";
import {COLUMN_IDS} from "../constants";
import AuxLevelTextBox from "../AuxLevelTextBox";

type AdvancedTableProps = {
  header: Map<string, AdvTblCellPropsAbstract<AuxTextBoxProps>>;
  body: Map<string, AdvTblCellProps<AuxCompsProps>>[];
  isWithRowNums?: boolean;
  freeRowsCount?: number;
  className?: string;
};

export const AdvancedTable: React.FC<AdvancedTableProps> =
  ({header, body, isWithRowNums,
     freeRowsCount, className}) => {

  const currCellIdRef = useRef('');
  const debugArr = useRef(['aaa', 'bbb', 'ccc']);

  const onDataCellClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (!(target instanceof HTMLDivElement) || !e.currentTarget.id) return;

    // deselect previous cell
    if (currCellIdRef.current) {
      if (currCellIdRef.current.startsWith('_')) {
        setRowSelection(currCellIdRef.current);
      } else {
        const prevCell = document.getElementById(currCellIdRef.current);
        if (prevCell && prevCell instanceof HTMLTableCellElement) {
          prevCell.classList.remove(s['adv-table__cell_selected']);
        }
      }
    }

    // select current cell
    const currCell = document.getElementById(e.currentTarget.id);
    if (!currCell || !(currCell instanceof HTMLTableCellElement)) return;

    if (currCell.id.startsWith('_')) {
      setRowSelection(currCell.id, true);
    } else {
      currCell.classList.add(s['adv-table__cell_selected']);
    }

    currCellIdRef.current = currCell.id;
  }, []);

  if (!header.size) return ;

  return (
    <div>
      <table className={clsx(className, s['adv-table'])} >
        <thead>
        <tr>
          {getColsRow(header, isWithRowNums ? 0 : undefined).map(col => {
            return (
              <th id={col.id} key={col.id} className={clsx(s['adv-table__th'], {
                [`${s['adv-table__cell_background-head-colored']}`]: col.background === EAdvTblBackground.HEADER,
                [`${s['adv-table__cell_border-left']}`]: col.border.left,
                [`${s['adv-table__cell_border-right']}`]: col.border.right,
                [`${s['adv-table__cell_border-top']}`]: col.border.top,
                [`${s['adv-table__cell_border-bottom']}`]: col.border.bottom
              })} >
                <div className={clsx(s['adv-table__cell'], s['adv-table__cell_headed'])}
                     onDoubleClick={onColumnInitSize} onMouseDown={onColumnResize}>
                  {generateComponent<AuxTextBoxProps>({
                    component: AuxTextBox,
                    componentProps: {
                      id: col.id,
                      className: col.id.startsWith('_') ? s['comp-row-num'] : s['comp-row-regular'],
                      text: col.componentProps.text,
                      props: col.componentProps.props,
                    }})}
                  {col.id !== '_'
                    ? (<div className={`${s['adv-table__cell-resizer']}`} />)
                    : undefined}
                </div>
              </th>
            );
          })}
        </tr>
        </thead>
        <tbody>
        {addEmptyRows(body, freeRowsCount ?? 1).map((row, rowIndex) => {
          return (
            <tr key={`${rowIndex}`}>
              {getColsRow(row, isWithRowNums ? (rowIndex + 1) : undefined).map((col) => {
                let comp: ReactElement | undefined;
                const compClassName = col.id.startsWith('_') ? s['comp-row-num'] : s['comp-row-regular'];

                switch(col.component) {
                  case AuxTextBox:
                    comp = generateComponent<AuxTextBoxProps>({
                      ...col,
                      componentProps: {
                        ...col.componentProps,
                        className: compClassName,
                      }
                    });
                    break;
                  case AuxLevelTextBox:
                    comp = generateComponent<AuxLevelTextBoxProps>({
                      ...col,
                      componentProps: {
                        ...col.componentProps,
                        className: compClassName,
                      }
                    });
                    break;
                  default:
                    comp = undefined;
                }

                return (
                  <td id={col.id} key={col.id}
                      className={clsx(s['adv-table__th'], s['adv-table__cell'], {
                        [`${s['adv-table__cell_dated-row-num']}`]: col.id.startsWith('_'),
                        [`${s['adv-table__cell_dated']}`]: !col.id.startsWith('_'),
                        [`${s['adv-table__cell_background-head-colored']}`]: col.background === EAdvTblBackground.HEADER,
                        [`${s['adv-table__cell_border-left']}`]: col.border.left,
                        [`${s['adv-table__cell_border-right']}`]: col.border.right,
                        [`${s['adv-table__cell_border-top']}`]: col.border.top,
                        [`${s['adv-table__cell_border-bottom']}`]: col.border.bottom
                      })}
                      onClick={onDataCellClick}>
                    {comp}
                  </td>
                );
              })}
            </tr>
          );
        })}
        </tbody>
      </table>

      <table className={clsx(s['debug'])}>
        <thead>
        <tr>
          {debugArr.current.map((item, index) => {
            return (
              <td key={`td${index}`} className={clsx(s['debug__td'])} onClick={() => {
                debugArr.current[index] += '@';
              }}>
                <div className={clsx(s['debug__content'])}>{item}</div>
              </td>
            );
          })}
        </tr>
        </thead>
      </table>
    </div>
  );
};

function generateComponent <T extends AuxCompsProps>(comp: Pick<AdvTblCellPropsAbstract<T>, 'component' | 'componentProps'>):
  ReactElement | undefined {

  let result: ReactElement | undefined = undefined;

  switch (comp.component) {
    case AuxTextBox:
      result = <AuxTextBox {...{
        ...comp.componentProps,
      }} />
      break;
    case AuxLevelTextBox:
      result = <AuxLevelTextBox {...{
        ...comp.componentProps,
      }} />
      break;
  }
  return result;
}

function addEmptyRows(array: Map<string, AdvTblCellProps<AuxCompsProps>>[], addedRowsCount: number):
  Map<string, AdvTblCellProps<AuxCompsProps>>[] {

  if (!array.length || !addedRowsCount) return [];

  const [row] = array;
  const cols = [...row.values()];
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

function setRowSelection(rowNumCellId: string, is2SelectRow?: boolean) {
  if (!rowNumCellId) return;

  let rowNum = parseInt(rowNumCellId.substring(1));
  rowNum = isNaN(rowNum) ? 0 : rowNum;
  if (!rowNum) return;

  const count = COLUMN_IDS.length;
  for (let i = 0; i < count; i++) {
    const cell = document.getElementById(`${COLUMN_IDS[i]}${rowNum}`);
    if (cell && cell instanceof HTMLTableCellElement) {
      if (is2SelectRow && !cell.classList.contains(s['adv-table__cell_selected'])) {
        cell.classList.add(s['adv-table__cell_selected']);
      } else {
        cell.classList.remove(s['adv-table__cell_selected']);
      }
    }
  }

  const rowNumCell = document.getElementById(rowNumCellId);
  if (rowNumCell && rowNumCell instanceof HTMLTableCellElement) {
    if (is2SelectRow) {
      rowNumCell.classList.remove(s['adv-table__cell_background-head-colored']);
      rowNumCell.classList.add(s['adv-table__cell_background-head-select-colored']);
    } else {
      rowNumCell.classList.remove(s['adv-table__cell_background-head-select-colored']);
      rowNumCell.classList.add(s['adv-table__cell_background-head-colored']);
    }
  }
}

function getColsRow<T extends AdvTblCellProps<AuxCompsProps>>(colsRow: Map<string, T> , rowNum?: number): (T)[] {
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

function onColumnInitSize(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.width = '';
}

function onColumnResize(e: React.MouseEvent<HTMLDivElement>) {
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

export default AdvancedTable;

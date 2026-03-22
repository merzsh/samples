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
import {AdvTblCellProps, EAdvTblBackground} from "./types";
import AuxTextBox from "../AuxTextBox";
import {EAuxAlignH, EAuxSize} from "../types";
import {COLUMN_IDS} from "../constants";
import {AuxTextBoxProps} from "../AuxTextBox/AuxTextBox";

type AdvancedTableProps = {
  header: Map<string, AdvTblCellProps>;
  body: Map<string, AdvTblCellProps>[];
  isWithRowNums?: boolean;
  freeRowsCount?: number;
  className?: string;
};

export const AdvancedTable: React.FC<AdvancedTableProps> = ({header, body,
                                                              isWithRowNums, freeRowsCount,
                                                              className}) => {
  const currCellIdRef = useRef('');
  const debugArr = useRef(['aaa', 'bbb', 'ccc']);

  const onDataCellClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (!(target instanceof HTMLDivElement) || !target.parentElement?.id) return;

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
    const currCell = document.getElementById(target.parentElement.id);
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
          {getColsRow(header, isWithRowNums).map(col => {
            return (
              <th id={col.id} key={col.id} className={clsx(s['adv-table__th'], {
                [`${s['adv-table__cell_background-head-colored']}`]: col.background === EAdvTblBackground.HEADER,
                [`${s['adv-table__cell_border-left']}`]: col.border.left,
                [`${s['adv-table__cell_border-right']}`]: col.border.right,
                [`${s['adv-table__cell_border-top']}`]: col.border.top,
                [`${s['adv-table__cell_border-bottom']}`]: col.border.bottom
              })}>
                <div className={clsx(s['adv-table__cell'], s['adv-table__cell_headed'])}>
                  {generateComponent(AuxTextBox, {
                    id: col.id,
                    className: col.id.startsWith('_') ? s['comp-row-num'] : s['comp-row-regular'],
                    text: col.componentProps.text,
                    props: col.componentProps.props,
                  })}
                  {col.id !== '_'
                    ? (<div className={`${s['adv-table__cell-resizer']}`} onMouseDown={onColumnResize}
                            onDoubleClick={onColumnInitSize}/>)
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
              {getColsRow(row, isWithRowNums, rowIndex + 1).map(col => {
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
                    {generateComponent(AuxTextBox, {
                      id: col.id,
                      className: col.id.startsWith('_') ? s['comp-row-num'] : s['comp-row-regular'],
                      text: col.componentProps.text,
                      props: col.componentProps.props,
                    })}
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
                console.log(12345, "DebugTable.td.onClick");
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

function generateComponent (comp: React.FC<any>, compProps: AuxTextBoxProps):
  ReactElement | undefined {
  let result: ReactElement | undefined;

  switch (comp) {
    case AuxTextBox:
      result = <AuxTextBox id={`atb${compProps.id}`}
                           className={compProps.className}
                           text={compProps.text}
                           props={compProps.props} />
      break;
    default:
      result = undefined;
  }

  return result;
}

function addEmptyRows(array: Map<string, AdvTblCellProps>[], addedRowsCount: number): Map<string, AdvTblCellProps>[] {
  if (array.length < 2 || !addedRowsCount) return [];

  const [_, row] = array;
  const cols = [...row.values()];
  const result: Map<string, AdvTblCellProps>[] = array.slice();

  for (let i = 0; i < addedRowsCount; i++) {
    const colsCopy: Map<string, AdvTblCellProps> = new Map<string, AdvTblCellProps>();
    cols.forEach((col, ind) => {
      const id = `${COLUMN_IDS[ind]}${array.length+i+1}`;
      colsCopy.set(id, {
        id,
        background: col.background,
        border: {...col.border},
        component: AuxTextBox,
        componentProps: {
          text: '',
          props: {
            isNonSelectable: true,
            isEditable: true,
            fontSize: EAuxSize.M,
            alignH: EAuxAlignH.L,
          }
        },
      });
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

function getColsRow(colsRow: Map<string, AdvTblCellProps>, isWithRowNums?: boolean, rowNum?: number): AdvTblCellProps[] {
  const result = [...colsRow.values()];

  if (isWithRowNums && result.length) {
    const [firstCol] = result;

    result.unshift({
      id: `_${rowNum ?? ''}`,
      border: firstCol.border,
      background: EAdvTblBackground.HEADER,
      component: AuxTextBox,
      componentProps: {
        text: `${rowNum ?? ''}`,
        props: {
          isNonSelectable: true,
          fontSize: EAuxSize.M,
        }
      },
    });
  }

  return result;
}

function onColumnInitSize(e: React.MouseEvent<HTMLDivElement>) {
  const target = e.target as HTMLDivElement;
  if (!target.parentElement) return;

  target.parentElement.style.width = '';
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

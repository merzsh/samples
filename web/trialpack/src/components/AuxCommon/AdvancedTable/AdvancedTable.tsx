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
import React, {useRef} from 'react';
import clsx from 'clsx';
import {AdvTblCellProps, EAdvTblBackground} from "./types";

type AdvancedTableProps = {
  header: Map<string, AdvTblCellProps>;
  body: Map<string, AdvTblCellProps>[];
  className?: string;
};

export const AdvancedTable: React.FC<AdvancedTableProps> = ({header, body, className}) => {
  const currCellIdRef = useRef('');
  const debugArr = useRef(['aaa', 'bbb', 'ccc']);

  function onColumnResize(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();

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

  function onColumnInitSize(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();

    const target = e.target as HTMLDivElement;
    if (!target.parentElement) return;

    target.parentElement.style.width = '';
  }

  function onDataCellClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();

    const target = e.target as HTMLDivElement;
    if (!target.parentElement) return;

    if (currCellIdRef.current) {
      const prevCell = document.getElementById(currCellIdRef.current);
      if (prevCell && prevCell instanceof HTMLTableCellElement) {
        prevCell.classList.remove(s['adv-table__cell_selected']);
      }
    }

    const currCell = document.getElementById(target.parentElement.id);
    if (!currCell || !(currCell instanceof HTMLTableCellElement)) return;

    currCell.classList.add(s['adv-table__cell_selected']);
    currCellIdRef.current = target.parentElement.id;
  }

  return (
    <div>
      <table className={clsx(className, s['adv-table'])}>
        <thead>
        <tr>
          {[...header.values()].map(col => {
            return (
              <th id={col.id} key={col.id} className={clsx(s['adv-table__th'], {
                [`${s['adv-table__cell_back-light-grayed']}`]: col.background === EAdvTblBackground.HEADER,
                [`${s['adv-table__cell_border-left']}`]: col.border.left,
                [`${s['adv-table__cell_border-right']}`]: col.border.right,
                [`${s['adv-table__cell_border-top']}`]: col.border.top,
                [`${s['adv-table__cell_border-bottom']}`]: col.border.bottom
              })}>
                <div className={clsx(s['adv-table__cell'], s['adv-table__cell_headed'])}>
                  {col.component}
                  <div className={`${s['adv-table__cell-resizer']}`} onMouseDown={onColumnResize}
                       onDoubleClick={onColumnInitSize}/>
                </div>
              </th>
            );
          })}
        </tr>
        </thead>
        <tbody>
        {body.map((row, rowIndex) => {
          return (
            <tr key={`${rowIndex}`}>
              {[...row.values()].map(col => {
                return (
                  <td id={col.id} key={col.id}
                      className={clsx(s['adv-table__th'], s['adv-table__cell'], s['adv-table__cell_dated'], {
                        [`${s['adv-table__cell_border-left']}`]: col.border.left,
                        [`${s['adv-table__cell_border-right']}`]: col.border.right,
                        [`${s['adv-table__cell_border-top']}`]: col.border.top,
                        [`${s['adv-table__cell_border-bottom']}`]: col.border.bottom
                      })}
                      onClick={onDataCellClick}>
                    {col.component}
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

export default AdvancedTable;

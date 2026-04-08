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
import {
  AdvTblCellProps,
  AuxCompsProps,
  EAdvTblBackground
} from "./types";
import AuxTextBox from "../AuxTextBox";
import {AuxLevelTextBoxProps, AuxTextBoxProps, EColID} from "../types";
import AuxLevelTextBox from "../AuxLevelTextBox";
import {
  addEmptyRows,
  getColsRow,
  getComponentClass,
  getTableChildrenRows,
  onColumnResize,
  onExpanderRows,
  setRowSelection, sortWorks
} from "./utils";

type AdvancedTableProps = {
  header: AdvTblCellProps<AuxTextBoxProps>[];
  works: AdvTblCellProps<AuxCompsProps>[][];
  defaultSortColumn?: EColID;
  isWithRowNums?: boolean;
  freeRowsCount?: number;
  className?: string;
};

const ROW_SELECTION_STYLES = {
  dataCellBackSelected: s['adv-table__cell_selected'],
  headerCellBackSelected: s['adv-table__cell_background-head-select-colored'],
  headerCellBackUnselected: s['adv-table__cell_background-head-colored'],
};

export const AdvancedTable: React.FC<AdvancedTableProps> =
  ({header, works, defaultSortColumn = EColID.A,
     isWithRowNums, freeRowsCount, className}) => {

  const currCellIdRef = useRef('');
  const debugArr = useRef(['aaa', 'bbb', 'ccc']);

  const onDataCellClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (!(target instanceof HTMLDivElement) || !e.currentTarget.id) return;

    // deselect previous cell
    if (currCellIdRef.current) {
      if (currCellIdRef.current.startsWith('_')) {
        setRowSelection(currCellIdRef.current, ROW_SELECTION_STYLES);
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
      setRowSelection(currCell.id, ROW_SELECTION_STYLES, true);
    } else {
      currCell.classList.add(s['adv-table__cell_selected']);
    }

    currCellIdRef.current = currCell.id;
  }, []);

  if (!header.length) return;

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
                     onDoubleClick={(event) => {
                       event.currentTarget.style.width = '';
                     }}>
                  {generateComponent<AuxTextBoxProps>({
                    component: AuxTextBox,
                    componentProps: {
                      ...col.componentProps,
                      className: s[getComponentClass(col.id)],
                    }})}
                  {col.id !== '_'
                    ? (<div className={`${s['adv-table__cell-resizer']}`} onMouseDown={onColumnResize} />)
                    : undefined}
                </div>
              </th>
            );
          })}
        </tr>
        </thead>
        <tbody>
        {addEmptyRows(
          works.sort((a, b) =>
            sortWorks(a, b, defaultSortColumn)), freeRowsCount ?? 1)
          .map((row, rowIndex) => {
            return (
              <tr id={`${rowIndex+1}`} key={`${rowIndex+1}`}>
                {getColsRow(row, isWithRowNums ? (rowIndex + 1) : undefined).map((col) => {
                  let comp: ReactElement | undefined;
                  const props: AdvTblCellProps<AuxCompsProps> = {
                    ...col,
                    componentProps: {
                      ...col.componentProps,
                      className: s[getComponentClass(col.id)],
                    }
                  };

                  if (!col.id.startsWith('_')) {
                    const cellId = `${col.id}${rowIndex+1}`;
                    props.id = cellId;
                    props.componentProps.id = cellId;
                  }

                  switch(col.component) {
                    case AuxTextBox:
                      comp = generateComponent<AuxTextBoxProps>(props);
                      break;
                    case AuxLevelTextBox:
                      comp = generateComponent<AuxLevelTextBoxProps>(props, works, defaultSortColumn);
                      break;
                    default:
                      comp = undefined;
                  }

                  return (
                    <td id={props.id} key={props.id}
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
          })
        }
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

function generateComponent <T extends AuxCompsProps>(comp: Pick<AdvTblCellProps<T>, 'component' | 'componentProps'>,
                                                     works?: AdvTblCellProps<AuxCompsProps>[][], defaultSortColumn?: EColID):
  ReactElement | undefined {

  let result: ReactElement | undefined = undefined;

  switch (comp.component) {
    case AuxTextBox:
      result = <AuxTextBox {...{
        ...comp.componentProps,
      }} />
      break;
    case AuxLevelTextBox:
      result = <AuxLevelTextBox
        {...{...comp.componentProps,}}
        onExpanderClick={(id) => works && defaultSortColumn ? getTableChildrenRows(works, id, defaultSortColumn) : []}
        onExpanderRows={(props) => {
          onExpanderRows({
            ...props,
            works: works,
            defaultSortColumn,
          })
        }}
      />
      break;
  }
  return result;
}

export default AdvancedTable;

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
import React, {ReactElement, useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {
  AdvTblCellProps,
  AuxCompsProps,
  EAdvTblBackground
} from "./types";
import AuxTextBox from "../AuxTextBox";
import {AuxLevelTextBoxProps, AuxOnColumnResize, AuxTextBoxProps, EAuxCompExtData, EColID} from "../types";
import AuxLevelTextBox from "../AuxLevelTextBox";
import {
  genEmptyRows,
  genRowNumCell,
  getComponentClass,
  getTableChildrenRows,
  onExpanderRows,
  setRowSelection,
  sortWorks
} from "./utils";
import {STR_INIT} from "../constants";
import {onResize} from "../utils";

type AdvancedTableProps = {
  header: AdvTblCellProps<AuxTextBoxProps>[];
  works: AdvTblCellProps<AuxCompsProps>[][];
  defaultSortColumn?: EColID;
  isWithRowNums?: boolean;
  freeRowsCount?: number;
  className?: string;
  id?: string;
};

const ROW_SELECTION_STYLES = {
  dataCellBackSelected: s['adv-table__cell_selected'],
  headerCellBackSelected: s['adv-table__cell_background-head-select-colored'],
  headerCellBackUnselected: s['adv-table__cell_background-head-colored'],
};

export const AdvancedTable: React.FC<AdvancedTableProps> =
  ({header, works, defaultSortColumn = EColID.A,
     isWithRowNums, freeRowsCount, className, id}) => {

  const worksRef = useRef<typeof works>([]);
  const currCellIdRef = useRef('');
  const resizeHandlersRef = useRef(new Map<string, AuxOnColumnResize>());

  const [tableKey, setTableKey] = useState<string>();

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

  useEffect(() => {
    worksRef.current = [];

    const tabKey = works.reduce((acc, cur) => {
      const [colId] = cur;
      return acc + colId.componentProps.extData?.keyColumnValue + ',';
    }, STR_INIT);

    setTableKey(tabKey);
  }, [works]);

  if (!header.length || !tableKey) return;

  return (
    <div id={id} className={className}>
      <div className={s['adv-table-container']}>
        <table className={s['adv-table']}>
          <thead>
          <tr>
            {(isWithRowNums ? [genRowNumCell(header, 0), ...header] : header).map(col => {
              let resizeHandler;
              const resizerId = `col-resizer-${col.id}`

              if (!(resizeHandler = resizeHandlersRef.current.get(resizerId))) {
                resizeHandler = onResize(resizerId, () => 512);
                resizeHandlersRef.current.set(resizerId, resizeHandler);
              }

              return (
                <th id={col.id} key={col.id} className={clsx(s['adv-table__th'], {
                  [`${s['adv-table__cell_background-head-colored']}`]: col.background === EAdvTblBackground.HEADER,
                  [`${s['adv-table__cell_border-left']}`]: col.border.left,
                  [`${s['adv-table__cell_border-right']}`]: col.border.right,
                  [`${s['adv-table__cell_border-top']}`]: col.border.top,
                  [`${s['adv-table__cell_border-bottom']}`]: col.border.bottom
                })}>
                  <div className={clsx(s['adv-table__cell'], s['adv-table__cell_headed'])}
                       onDoubleClick={(event) => {
                         event.currentTarget.style.width = '';
                       }}>
                    {generateComponent<AuxTextBoxProps>({
                      component: AuxTextBox,
                      componentProps: {
                        ...col.componentProps,
                        className: s[getComponentClass(col.id)],
                      }
                    })}
                    {col.id !== '_'
                      ? (<div id={resizerId} className={`${s['adv-table__cell-resizer']}`}
                              onMouseDown={resizeHandler} />)
                      : undefined}
                  </div>
                </th>
              );
            })}
          </tr>
          </thead>
          <tbody>
          {[...[...works].sort((a, b) => sortWorks(a, b, defaultSortColumn)),
            ...genEmptyRows(works, freeRowsCount ?? 1)]
            .map((row, rowIndex) => {
              const rowRef: typeof row = [];

              const rowUi = (
                <tr id={`${rowIndex + 1}`} key={`${rowIndex + 1}`} className={s['adv-table__tr']}>
                  {(isWithRowNums ? [genRowNumCell(row, rowIndex + 1), ...row] : row).map(col => {
                    const colRef: typeof col = {
                      ...col,
                      componentProps: {
                        ...col.componentProps,
                      }
                    }

                    if (!col.id.startsWith('_')) {
                      const cellId = `${col.id}${rowIndex + 1}`;
                      colRef.id = cellId;
                      colRef.componentProps.id = cellId;
                    }

                    rowRef.push(colRef);

                    let uiCell: ReactElement | undefined;

                    switch (col.component) {
                      case AuxTextBox:
                        uiCell = generateComponent<AuxTextBoxProps>(colRef);
                        break;
                      case AuxLevelTextBox:
                        uiCell = generateComponent<AuxLevelTextBoxProps>(colRef, worksRef.current, defaultSortColumn);
                        break;
                      default:
                        uiCell = undefined;
                    }

                    const rowKey: string = colRef.componentProps.extData && EAuxCompExtData.KEY_COL_VALUE in colRef.componentProps.extData
                      ? colRef.componentProps.extData[EAuxCompExtData.KEY_COL_VALUE]
                      : `${rowIndex + 1}`;
                    const cellKey = `${rowKey}~${colRef.id}~${colRef.componentProps.value}`;

                    const isLevelColored = !colRef.id.startsWith('_') && !colRef.id.startsWith(defaultSortColumn);

                    return (
                      <td id={colRef.id} key={cellKey}
                          className={clsx(s['adv-table__th'], s['adv-table__cell'], {
                            [`${s['adv-table__cell_dated-row-num']}`]: colRef.id.startsWith('_'),
                            [`${s['adv-table__cell_dated']}`]: !colRef.id.startsWith('_'),
                            [`${s['adv-table__cell_background-head-colored']}`]: colRef.background === EAdvTblBackground.HEADER,
                            [`${s['adv-table__cell_border-left']}`]: colRef.border.left,
                            [`${s['adv-table__cell_border-right']}`]: colRef.border.right,
                            [`${s['adv-table__cell_border-top']}`]: colRef.border.top,
                            [`${s['adv-table__cell_border-bottom']}`]: colRef.border.bottom,
                            [`${s['adv-table__cell_leveled-1']}`]: colRef.componentProps.level === 0 && isLevelColored,
                            [`${s['adv-table__cell_leveled-2']}`]: colRef.componentProps.level === 1 && isLevelColored,
                            [`${s['adv-table__cell_leveled-3']}`]: colRef.componentProps.level === 2 && isLevelColored,
                          })}
                          onClick={onDataCellClick}>
                        {uiCell}
                      </td>
                    );
                  })}
                </tr>
              );

              worksRef.current.push(rowRef);

              return rowUi;
            })
          }
          </tbody>
        </table>
      </div>
    </div>
  );
  };

function generateComponent<T extends AuxCompsProps>(comp: Pick<AdvTblCellProps<T>, 'component' | 'componentProps'>,
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

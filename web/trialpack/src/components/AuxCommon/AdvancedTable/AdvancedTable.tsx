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
import React, {memo, ReactElement, useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {AdvTblCellProps, AuxCompsProps, EAdvTblBackground, EBorderType} from "./types";
import AuxTextBox from "../AuxTextBox";
import {
  AdvancedTableProps,
  AuxLevelTextBoxProps,
  AuxOnColumnResize,
  AuxTextBoxProps,
  EAuxCompExtData,
  EColID,
  OnExpanderRowsProps,
  OnExpanderRowsTabProps
} from "../types";
import AuxLevelTextBox from "../AuxLevelTextBox";
import {
  genEmptyRows,
  genRowNumCell,
  getComponentClass,
  getTableChildrenRowNums,
  getTableShortId, onExpanderRowsHandler,
  sortWorks
} from "./utils";
import {onResize} from "../utils";
import {colIds, colIdsMap} from "./constants";

export const AdvancedTable: React.FC<AdvancedTableProps> =
  ({header, headerCellUnionsMapping, works,
     defaultSortColumn = EColID.A, isWithRowNums, freeRowsCount,
     onRowSelect, onExpanderRows, className, id}) => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const worksRef = useRef<typeof works>([]);
  const currCellIdRef = useRef('');
  const resizeHandlersRef = useRef(new Map<string, AuxOnColumnResize>());

  useEffect(() => {
    if (!works.length) return;
    setIsLoading(true);

    let [newRow] = works;
    const result = new Array<typeof newRow>(works.length);

    for (let i = 0; i < works.length; i++) {
      if (!works[i].length) return;

      let [curCell] = works[i];
      newRow = new Array<typeof curCell>(works[i].length);

      for (let j = 0; j < works[i].length; j++) {
        curCell = works[i][j];
        newRow[j] = {
          ...curCell,
          componentProps: {
            ...curCell.componentProps,
            props: { ...curCell.componentProps.props },
            extData: { ...curCell.componentProps.extData },
          }
        }
      }

      result[i] = newRow;
    }

    worksRef.current = [...result.sort((a, b) =>
      sortWorks(a, b, defaultSortColumn)), ...genEmptyRows(result, freeRowsCount ?? 1)];

    setIsLoading(false);
  }, [works]);

  const onDataCellClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (!(target instanceof HTMLDivElement) || !e.currentTarget.id) return;

    // deselect previous cell
    if (currCellIdRef.current) {
      if (currCellIdRef.current.startsWith('_')) {
        if (!onRowSelect || !id) return;
        onRowSelect(currCellIdRef.current, false);
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
      if (!onRowSelect || !id) return;
      onRowSelect(currCell.id, true);
    } else {
      currCell.classList.add(s['adv-table__cell_selected']);
    }

    currCellIdRef.current = currCell.id;
  }, []);

  if (!header.length || !works.length || isLoading) return undefined;

  return (
    <div id={id} className={clsx(className, s['adv-table-container'])}>
      <table className={s['adv-table']}>
        <thead>
        {(headerCellUnionsMapping ? header : header.filter((_, i) => !i))
          .map((headerRow, headerRowIndex) => {
            return (
              <tr key={`${id}-header-row-${headerRowIndex}`}>
                {(isWithRowNums && !headerRowIndex ? [genRowNumCell(headerRow, 0), ...headerRow] : headerRow).map(col => {
                  let resizeHandler;
                  const resizerId = `col-resizer-${col.id}`

                  if (!(resizeHandler = resizeHandlersRef.current.get(resizerId))) {
                    resizeHandler = onResize(resizerId, () => 512);
                    resizeHandlersRef.current.set(resizerId, resizeHandler);
                  }

                  let isHorizGroupCell: boolean | undefined = undefined;
                  let cellsAddedToUnionCount: number | undefined = undefined;
                  const colId = col.componentProps.extData?.currColumnName;

                  if (headerCellUnionsMapping && colId) {
                    if (header.length - headerRowIndex > 1) {
                      isHorizGroupCell = false;
                      cellsAddedToUnionCount = header.length - headerRowIndex;
                    }

                    if (colId !== '_') {
                      const val = headerCellUnionsMapping.get(colId);
                      if (val !== undefined) {
                        isHorizGroupCell = !!val;
                        if (isHorizGroupCell) cellsAddedToUnionCount = val + 1;
                      }
                    }
                  }

                  return (
                    <th id={col.id} key={col.id}
                        className={clsx(s['adv-table__th'], s['adv-table__th_fixed'], {
                          [`${s['adv-table__th_fixed-l1']}`]: headerRowIndex === 0,
                          [`${s['adv-table__th_fixed-l2']}`]: headerRowIndex === 1,
                          [`${s['adv-table__cell_background-head-colored']}`]: col.background === EAdvTblBackground.HEADER,
                          [`${s['adv-table__cell_border-left']}`]: col.border.left,
                          [`${s['adv-table__cell_border-right']}`]: col.border.right === EBorderType.REGULAR,
                          [`${s['adv-table__cell_border-top']}`]: col.border.top,
                          [`${s['adv-table__cell_border-bottom']}`]: col.border.bottom
                        })}
                        rowSpan={isHorizGroupCell === false ? cellsAddedToUnionCount : undefined}
                        colSpan={isHorizGroupCell === true ? cellsAddedToUnionCount : undefined}
                    >
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
                        {col.id !== '_' && col.isHorizResizable
                          ? (<div id={resizerId} className={`${s['adv-table__cell-resizer']}`}
                                  onMouseDown={resizeHandler} />)
                          : undefined}
                      </div>
                    </th>
                  );
                })}
              </tr>
            );
          })
        }
        </thead>
        <tbody>
        {worksRef.current.map((row, rowIndex) => {
          let keyColNum = colIdsMap.get(defaultSortColumn) ?? 0;
          keyColNum = isWithRowNums ? keyColNum + 1 : keyColNum;

          return (
            <tr id={`${getTableShortId(id)}${rowIndex + 1}`} key={`${rowIndex + 1}`} className={s['adv-table__tr']}>
              {(isWithRowNums ? [genRowNumCell(row, rowIndex + 1), ...row] : row).map((col, colInd) => {
                if (!col.id.startsWith('_')) {
                  const cellId = `${getTableShortId(id)}${col.id}${rowIndex + 1}`;
                  col.id = cellId;
                  col.componentProps.id = cellId;
                }

                let uiCell: ReactElement | undefined;

                switch (col.component) {
                  case AuxTextBox:
                    uiCell = generateComponent<AuxTextBoxProps>(col);
                    break;
                  case AuxLevelTextBox:
                    uiCell = generateComponent<AuxLevelTextBoxProps>(col, onExpanderRows, getTableShortId(id), defaultSortColumn, worksRef.current);
                    break;
                  default:
                    uiCell = undefined;
                }

                const rowKey: string = col.componentProps.extData && EAuxCompExtData.KEY_COL_VALUE in col.componentProps.extData
                  ? (col.componentProps.extData[EAuxCompExtData.KEY_COL_VALUE] ?
                    col.componentProps.extData[EAuxCompExtData.KEY_COL_VALUE] : '_')
                  : `${rowIndex + 1}`;
                const cellKey = `${rowKey}~${col.id}~${col.componentProps.value}`;

                const isLevelColored = !col.id.startsWith('_') && colInd !== keyColNum;

                return (
                  <td id={col.id} key={cellKey}
                      className={clsx(s['adv-table__th'], s['adv-table__cell'], {
                        [`${s['adv-table__cell_dated-row-num']}`]: col.id.startsWith('_'),
                        [`${s['adv-table__cell_dated']}`]: !col.id.startsWith('_'),
                        [`${s['adv-table__cell_background-head-colored']}`]: col.background === EAdvTblBackground.HEADER,
                        [`${s['adv-table__cell_border-left']}`]: col.border.left,
                        [`${s['adv-table__cell_border-right']}`]: col.border.right === EBorderType.REGULAR,
                        [`${s['adv-table__cell_border-right-timeline']}`]: col.border.right === EBorderType.TIMELINE,
                        [`${s['adv-table__cell_border-top']}`]: col.border.top,
                        [`${s['adv-table__cell_border-bottom']}`]: col.border.bottom,
                        [`${s['adv-table__cell_leveled-1']}`]: col.componentProps.level === 0 && isLevelColored,
                        [`${s['adv-table__cell_leveled-2']}`]: col.componentProps.level === 1 && isLevelColored,
                        [`${s['adv-table__cell_leveled-3']}`]: col.componentProps.level === 2 && isLevelColored,
                      })}
                      onClick={!col.componentProps.props?.isNonSelectable ? onDataCellClick : undefined}>
                    {uiCell}
                  </td>
                );
              })}
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
};

function generateComponent<T extends AuxCompsProps>(comp: Pick<AdvTblCellProps<T>, 'component' | 'componentProps'>,
                                                    onExpanderRows?: (props: OnExpanderRowsProps) => void,
                                                    tableId?: string,
                                                    defaultSortColumn?: string,
                                                    works?: AdvTblCellProps<AuxCompsProps>[][]):
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
        onExpanderClick={(id) => works && defaultSortColumn ? getTableChildrenRowNums(works, id, defaultSortColumn) : []}
        onExpanderRows={(props) => {
          const propsTab: OnExpanderRowsTabProps = {
            ...props,
            tableId,
            works,
            defaultSortColumn: defaultSortColumn ? colIds.find(colId => colId.toString() === defaultSortColumn) : colIds[0],
          };

          const rowNums = onExpanderRowsHandler(propsTab);
          if (onExpanderRows) onExpanderRows({ rowNums, isExpanded: propsTab.isExpanded, });
        }}
      />
      break;
  }
  return result;
}

export default memo(AdvancedTable);

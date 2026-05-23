/**
 * TrialPack is web application contains several basic samples to ease web development experience.
 * Copyright (c) 2024-2026 Andrei Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
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
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {
  AdvancedTableProps,
  AdvTblCellProps,
  DataCacheCol,
  DataCacheRow,
  EAdvTblBackground,
  EBorderType,
} from "./types";
import {
  AuxOnColumnResize,
  EColID,
} from "../types";
import {
  genEmptyRow,
  genRowNumCell,
  getColNameByCellId,
  getComponentClass,
  getRowNumByCellId,
  getTableShortId,
} from "./utils";
import {onResize} from "../utils";
import {AuxCompsProps, OnGetPropsByCellId, OnGetRowNumByValue, OnGetChildrenIds} from "../AuxUiCompGenerator/types";
import {colIds, colIdsMap} from "../constants";
import AuxUiCompGenerator from "../AuxUiCompGenerator";

export const AdvancedTable: React.FC<AdvancedTableProps> =
  ({header, headerCellUnionsMapping, data,
     defaultSortColumn = EColID.A, isWithRowNums, freeRowsCount, defaultSortColumnOrderedValues,
     onRowSelect, onExpanderRows, className, id}) => {

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dataCacheRef = useRef(new Map<string, DataCacheRow | undefined>());
  const dataNonSumWorkRow = useRef<AdvTblCellProps<AuxCompsProps>[]>();
  const currCellIdRef = useRef('');
  const resizeHandlersRef = useRef(new Map<string, AuxOnColumnResize>());

  useEffect(() => {
    if (!data.length) return;
    setIsLoading(true);

    if (dataCacheRef.current.size) dataCacheRef.current.clear();

    if (defaultSortColumnOrderedValues?.length) {
      defaultSortColumnOrderedValues.forEach((rowId, index) => {
        dataCacheRef.current.set(rowId, { currRowNum: index, dataRowNum: 0, cols: [] });
      });
    }

    const defaultSortColumnNum = colIdsMap.get(defaultSortColumn) ?? 0;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (defaultSortColumnNum >= row.length) break;

      const rowId = row[defaultSortColumnNum].extData?.rawValue ?? '',
        cols = new Array<DataCacheCol>(row.length);
      let cacheRow = dataCacheRef.current.get(rowId);

      if (cacheRow) {
        cacheRow.dataRowNum = i;
        cacheRow.cols = cols;
      } else {
        cacheRow = {
          dataRowNum: i,
          currRowNum: i,
          cols,
        };
      }

      dataCacheRef.current.set(rowId, cacheRow);
    }

    [dataNonSumWorkRow.current] = data;

    if (freeRowsCount) {
      [...Array(freeRowsCount).keys()].forEach(index => {
        dataCacheRef.current.set(`~${index}`, undefined);
      });
    }

    setIsLoading(false);
  }, [data]);

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

  const onGetRowNumByValue = useCallback<OnGetRowNumByValue>((value) => {
    const rowNum = dataCacheRef.current.get(value);
    return rowNum ? rowNum.currRowNum + 1 : 0;
  },[]);

  const onGetChildrenIds = useCallback<OnGetChildrenIds>((parentId) => {
      return [...dataCacheRef.current.keys()]
        .filter(key => key !== parentId && key.startsWith(parentId))
        .sort((a,b) => a < b ? -1 : a > b ? 1 : 0);
    }, []
  );

  const onGetPropsByCellId = useCallback<OnGetPropsByCellId>((id, colId) => {
    if (!id) return undefined;

    const rowNum = getRowNumByCellId(id);
    if (!rowNum || rowNum <= 0 || rowNum > dataCacheRef.current.size) return undefined;

    const rowCache = [...dataCacheRef.current.values()][rowNum - 1];
    if (rowCache?.dataRowNum === undefined) return undefined;

    const row = data[rowCache.dataRowNum];
    if (!row) return undefined;

    let colIdInt: EColID | undefined;

    if (colId) colIdInt = colId;
    else {
      const colName = getColNameByCellId(id);
      if (!colName) return undefined;

      colIdInt = colIds.find(item => item === colName);
    }
    if (!colIdInt) return undefined;

    const colNum = colIdsMap.get(colIdInt);
    if (colNum === undefined) return undefined;

    return row?.[colNum].componentProps;
  },[data]);

  if (!header.length || !data.length || isLoading) return undefined;

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
                  const resizerId = `col-resizer-${col.id}`;

                  if (!(resizeHandler = resizeHandlersRef.current.get(resizerId))) {
                    resizeHandler = onResize(resizerId, () => 512);
                    resizeHandlersRef.current.set(resizerId, resizeHandler);
                  }

                  let isHorizGroupCell: boolean | undefined = undefined;
                  let cellsAddedToUnionCount: number | undefined = undefined;
                  const colId = col.extData?.currColumnName;

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
                          [`${s['adv-table__cell_border-right']}`]: col.border.left === EBorderType.REGULAR,
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
                        <AuxUiCompGenerator {...{
                          component: col.component as React.FC<AuxCompsProps>,
                          componentProps: {
                            ...col.componentProps,
                            className: s[getComponentClass(col.id)],
                          },
                          tableId: getTableShortId(id),
                        }} />
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
        {[...dataCacheRef.current.entries()].map((rowMap, rowIndex) => {
          const tableId = getTableShortId(id), [key, val] = rowMap;

          let row: typeof dataNonSumWorkRow.current;
          const isEmptyRow = key.startsWith('~');

          if (!isEmptyRow && val) row = data?.[val.dataRowNum ?? 0];
          else if (isEmptyRow && dataNonSumWorkRow.current) row = genEmptyRow(dataNonSumWorkRow.current);
          else if (!row) return undefined;

          return (
            <tr id={`${tableId}${rowIndex + 1}`} key={`${rowIndex + 1}`} className={s['adv-table__tr']}>
              {(isWithRowNums ? [genRowNumCell(row, rowIndex + 1), ...row] : row).map((col, colIndex) => {
                let cellId = col.id;

                if (!col.id.startsWith('_') && val?.cols && colIndex < val.cols.length) {
                  cellId = `${tableId}${col.id}${rowIndex + 1}`;

                  if (!val.cols[colIndex]) val.cols[colIndex] = { cellId };
                  else val.cols[colIndex].cellId = cellId;
                }

                const rowKey: string = col.extData?.keyColumnValue
                  ? (col.extData.keyColumnValue ? col.extData.keyColumnValue : '_')
                  : `${rowIndex + 1}`;
                const cellKey = `${rowKey}~${cellId}~${col.componentProps.value}`;

                const isLevelColored = !col.id.startsWith('_') && col.isGroupHighlighting;

                return (
                  <td id={cellId} key={cellKey}
                      className={clsx(s['adv-table__th'], s['adv-table__cell'], {
                        [`${s['adv-table__cell_dated-row-num']}`]: col.id.startsWith('_'),
                        [`${s['adv-table__cell_dated']}`]: !col.id.startsWith('_'),
                        [`${s['adv-table__cell_background-head-colored']}`]: col.background === EAdvTblBackground.HEADER,
                        [`${s['adv-table__cell_border-left-timeline']}`]: col.border.left === EBorderType.TIMELINE,
                        [`${s['adv-table__cell_border-left']}`]: col.border.left === EBorderType.REGULAR,
                        [`${s['adv-table__cell_border-right']}`]: col.border.right,
                        [`${s['adv-table__cell_border-top']}`]: col.border.top,
                        [`${s['adv-table__cell_border-bottom']}`]: col.border.bottom,
                        [`${s['adv-table__cell_leveled-1']}`]: col.componentProps.level === 0 && isLevelColored,
                        [`${s['adv-table__cell_leveled-2']}`]: col.componentProps.level === 1 && isLevelColored,
                        [`${s['adv-table__cell_leveled-3']}`]: col.componentProps.level === 2 && isLevelColored,
                      })}
                      onClick={col.componentProps.props && 'isNonSelectable' in col.componentProps.props && col.componentProps.props.isNonSelectable ? undefined : onDataCellClick}
                  >
                    <AuxUiCompGenerator {...{
                      component: col.component as React.FC<AuxCompsProps>,
                      componentProps: col.componentProps,
                      compId: cellId,
                      tableId,
                      defaultSortColumn,
                      onGetChildrenIds,
                      onGetPropsByCellId,
                      onGetRowNumByValue,
                      onExpanderRows,
                    }} />
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

export default memo(AdvancedTable);

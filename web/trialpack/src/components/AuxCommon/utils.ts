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

import React from "react";
import {AuxOnColumnResize} from "./types";
import {colIds, NUM_VIEW_SEPARATOR_WIDTH, TOTAL_ABC_CAPACITY} from "./constants";

export function getColIdBySeqNumber(colNum: number): string {
  if (colNum < 0 || colNum > 625) {
    throw new RangeError('AdvancedTable.getColIdBySeqNumber(colNum): colNum might be between 0 and 625' +
      `current value is ${colNum}`);
  }

  const posCount = Math.floor(colNum / TOTAL_ABC_CAPACITY);
  if (!posCount) {
    return colIds[colNum];
  }

  return colIds[posCount - 1] + colIds[colNum % TOTAL_ABC_CAPACITY];
}

export const onResize = (elemId: string, onCalcMaxWidth: (target: HTMLDivElement) => number,
                         resizerScreenAdjustmentInPx = 0): AuxOnColumnResize => {
  let target: HTMLDivElement | undefined = undefined;
  let width: number | undefined = undefined

  // Function to handle mouse movement during drag
  function onMouseMove(e: any) {
    if (!target?.parentElement || width === undefined) return;

    const newWidth = width + e.movementX, minWidth = 32, maxWidth = onCalcMaxWidth(target) + NUM_VIEW_SEPARATOR_WIDTH;

    if (newWidth > minWidth && newWidth < maxWidth) {
      let minWidthText = '', maxWidthText = '', widthText = '';

      if (e.movementX > 0) {
        minWidthText = `${newWidth}px`;
        maxWidthText = `${maxWidth}px`;
        widthText = `${newWidth}px`;
      } else if (e.movementX < 0) {
        minWidthText = `${minWidth}px`;
        maxWidthText = `${newWidth}px`;
        widthText = `${newWidth + resizerScreenAdjustmentInPx}px`;
      }

      target.parentElement.style.minWidth = minWidthText;
      target.parentElement.style.maxWidth = maxWidthText;
      target.parentElement.style.width = widthText;

      width = newWidth;
    }
  }

  // Function to stop resizing on mouse up
  function onMouseUp() {
    if (!target?.parentElement) return;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function onResize(e: React.MouseEvent<HTMLDivElement>): void {
    if (target === undefined) target = e.target as HTMLDivElement;
    if (width === undefined) {
      const right = Math.round(document.getElementById(elemId)?.parentElement?.getBoundingClientRect()?.right ?? 0);
      const left = Math.round(document.getElementById(elemId)?.parentElement?.getBoundingClientRect()?.left ?? 0);
      width = right - left;
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  return onResize;
}

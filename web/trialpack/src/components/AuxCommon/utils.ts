import React from "react";
import {AuxOnColumnResize} from "./types";

export const onResize = (elemId: string, onCalcMaxWidth: (target: HTMLDivElement) => number,
                         resizerScreenAdjustmentInPx = 0): AuxOnColumnResize => {
  let target: HTMLDivElement | undefined = undefined;
  let width: number | undefined = undefined

  // Function to handle mouse movement during drag
  function onMouseMove(e: any) {
    if (!target?.parentElement || width === undefined) return;

    const newWidth = width + e.movementX, minWidth = 32, maxWidth = onCalcMaxWidth(target);

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

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

import * as s from './AuxTextBox.modules.scss';
import React, {useCallback, useRef} from 'react';
import clsx from 'clsx';
import {AuxTextBoxProps, EAuxAlignH, EAuxSize, EAuxTextBoxType} from "../types";
import {getFormattedValue} from "./utils";
import {NUM_INIT, STR_HTML_SPACE, STR_INIT, STR_KEY_ENTER, STR_KEY_ESCAPE} from "../constants";
import {prop} from "../../../utils/utils";

export const AuxTextBox: React.FC<AuxTextBoxProps> = ({value, type,
                                                        onChange, props,
                                                        id, className}) => {
  const [isEditable, setIsEditable] = React.useState(false);
  const [valueInt, setValueInt] = React.useState<string>(value ? value : STR_HTML_SPACE);
  const [isInputError, setIsInputError] = React.useState(false);
  const colWidthRef = useRef(0);

  const valueIntPrev = useRef(value);

  const onGoToEditMode = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditable || !(props && props.isEditable)) return;

    if (e.target instanceof HTMLDivElement) {
      colWidthRef.current = e.target.offsetWidth;
    }

    setIsEditable(!isEditable);
  }, [isEditable]);

  return (
    <div id={`atb-${id}`} className={clsx(className, s['aux-text-box'], {
      [`${s['aux-text-box_non-selectable']}`]: props?.isNonSelectable,
      [`${s['aux-text-box_is-weighted']}`]: props?.isBold,
      [`${s['aux-text-box_is-unweighted']}`]: !props?.isBold,
      [`${s['aux-text-box_is-medium-sized']}`]: props?.fontSize === EAuxSize.M,
      [`${s['aux-text-box_is-small-sized']}`]: props?.fontSize === EAuxSize.S,
      [`${s['aux-text-box_left_aligned']}`]: props?.alignH === EAuxAlignH.L,
      [`${s['aux-text-box_right_aligned']}`]: props?.alignH === EAuxAlignH.R
    })} onDoubleClick={onGoToEditMode}>
      {isEditable ? (
        <input
          style={{width: `${colWidthRef.current-2}px`}}
          className={clsx({
            [`${s['aux-text-box-input']}`]: !isInputError,
            [`${s['aux-text-box-input_errored']}`]: isInputError,
          })}
          type={'text'}
          value={valueInt === STR_HTML_SPACE ? STR_INIT : valueInt}
          autoFocus
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            let isErr = false, val = e.target.value;

            if (type === EAuxTextBoxType.NUM) {
              if (val) {
                const trm = val.replace(/^0+/, '').trim();
                val = trm ? trm : NUM_INIT.toString();
              }

              if (!isNaN(Number(val))) {
                valueIntPrev.current = val;
              } else {
                isErr = true;
              }
            }

            setValueInt(val ? val : STR_HTML_SPACE);
            setIsInputError(isErr);
          }}
          onKeyDown={(event) => {
            if (event.key === STR_KEY_ENTER) {
              (event.target as HTMLInputElement).blur();
            } else if (event.key === STR_KEY_ESCAPE) {
              setValueInt(value ? value : STR_HTML_SPACE);
            }
          }}
          onBlur={() => {
            let val: string;
            if (isInputError) {
              val = valueIntPrev.current ?? STR_INIT;
              setValueInt(val);
              setIsInputError(false);
            } else {
              val = valueInt ?? STR_INIT;
            }
            setIsEditable(false);

            if (onChange && val !== value) {
              onChange(val, value);
            }
          }}
        />
      ) : (
        <div className={clsx(s['aux-text-box-text'], {
          [`${s['aux-text-box-text_as-center']}`]: props?.alignH === EAuxAlignH.C,
          [`${s['aux-text-box-text_as-right']}`]: props?.alignH === EAuxAlignH.R,
          [`${s['aux-text-box-text_disabled']}`]: !props?.isEditable && !props?.isNonSelectable,
          [`${s['aux-text-box_is-monospaced']}`]: props?.isMonospaced,
        })}>
          {getFormattedValue(valueInt ?? STR_INIT, type, props?.isSuppressZeros, props?.dateDisplayTemplate)}
        </div>
      )}
    </div>
  );
};

export default AuxTextBox;

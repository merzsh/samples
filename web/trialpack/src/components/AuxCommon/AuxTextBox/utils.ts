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
import {MSG_DATE_FORMATTING_ERROR, STR_HTML_SPACE} from "../constants";
import {EAuxTextBoxType} from "../types";
import {format} from "date-fns";
import {STR_ISO_DATE_TEMPLATE} from "../../../utils/constants";

export function procAsNumSuppressZero(value: string, returnHtmlSpaceIfEmpty?: boolean): string {
  return value.length === 1 && value[0] === '0' ? returnHtmlSpaceIfEmpty ? STR_HTML_SPACE : '' : value;
}

export function getFormattedValue(value: string, type?: EAuxTextBoxType, isSuppressZeros?: boolean,
                                  dateDisplayTemplate?: string): string {

  if (!value) return STR_HTML_SPACE;
  else if (value === STR_HTML_SPACE || !type) return value;

  switch (type) {
    case EAuxTextBoxType.TEXT:
      return value;
    case EAuxTextBoxType.NUM:
      return isSuppressZeros ? procAsNumSuppressZero(value, true) : value;
    case EAuxTextBoxType.DATE:
      try {
        return format(value, dateDisplayTemplate ? dateDisplayTemplate : STR_ISO_DATE_TEMPLATE);
      } catch (err) {
        console.warn(`AuxTextBox: ${MSG_DATE_FORMATTING_ERROR} '${dateDisplayTemplate}'`, err);
        return value;
      }
    default:
      throw new Error(`AuxTextBox: value type '${type}' is not supported`);
  }
}

/**
 * TrialPack is web application contains several basic samples to ease web development experience.
 * Copyright (c) 2024-2025 Andrew Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
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

import { EType } from '../types';
import {
  STR_ABC_ALL_LETTERS_DIGITS,
  STR_MSG_ARGUMENT,
  STR_MSG_CLASS,
  STR_MSG_COMPONENT,
  STR_MSG_ENUM_KEY_FOR_VALUE_NOT_FOUND,
  STR_MSG_FUNCTION,
  STR_MSG_METHOD,
  STR_NAME_COMPONENT_UTILS
} from './constants';

/**
 * Check argument is not null or is not undefined
 *
 * @param compName - component name (who calls this function) for diagnostic purpose
 * @param funcName - function name
 * @param argName - argument name
 * @param argValue - argument value
 * @throws ReferenceError - argument value is 'null' or 'undefined'
 */
export function checkArgIsNotNull(compName: string, funcName: string, argName: string, argValue: any) {
  if (argValue === null || argValue === undefined) {
    throw new ReferenceError(`${UP1(STR_MSG_FUNCTION)}/${STR_MSG_METHOD} ${STR_MSG_ARGUMENT} '${funcName}(${argName})' is ` +
      `${EType.NUL} or ${EType.UDF} (${STR_MSG_COMPONENT}/${STR_MSG_CLASS} is '${compName}')`);
  }
}

/**
 * Checks argument on queried data type
 * (arguments are similar checkArgIsNotNull() function, except argType - queried argument type to check for)
 *
 * @throws ReferenceError - if types are differ
 */
export function checkArgHasType(compName: string, funcName: string, argName: string, argValue: any, argType: EType) {
  const argValueType = typeof argValue;
  if (argValueType !== argType) {
    throw new ReferenceError(`${UP1(STR_MSG_FUNCTION)}/${STR_MSG_METHOD} ${STR_MSG_ARGUMENT} '${funcName}(${argName})' has ` +
      `different type '${argValueType}' than queried - '${argType}' (${STR_MSG_COMPONENT}/${STR_MSG_CLASS} is '${compName}')`);
  }
}

/**
 * Check argument for empty string or zero
 * (arguments are similar checkArgIsNotNull() function)
 * @throws RangeError - if argValue is zero, NaN or empty string
 */
export function checkArgValIsNotEmpty(compName: string, funcName: string, argName: string, argValue: string | number) {
  const STR_ERR_PART_1 = `${UP1(STR_MSG_FUNCTION)}/${STR_MSG_METHOD} ${STR_MSG_ARGUMENT} '${funcName}(${argName})'`,
    STR_ERR_PART_2 = `(${STR_MSG_COMPONENT}/${STR_MSG_CLASS} is '${compName}')`;
  let strErrMsg = '';

  try {
    checkArgHasType(compName, funcName, argName, argValue, EType.STR);
    // type is 'string'
    strErrMsg = `${STR_ERR_PART_1} has initial 'string' value ${STR_ERR_PART_2}`;
  } catch (ex) {
    if (ex instanceof ReferenceError) {
      // type is 'number'
      if (isNaN(argValue as number)) {
        strErrMsg = `${STR_ERR_PART_1} has NaN 'number' value ${STR_ERR_PART_2}`;
      } else {
        strErrMsg = `${STR_ERR_PART_1} has initial 'number' value ${STR_ERR_PART_2}`;
      }
    } else throw ex;
  }

  if (!argValue) {
    throw new RangeError(strErrMsg);
  }
}

/**
 * Check for number sequence in string argument
 * (arguments similar checkArgIsNotNull() function)
 */
export function checkArgIs10DigitNumber(compName: string, funcName: string, argName: string, argValue: string) {
  checkArgValIsNotEmpty(compName, funcName, argName, argValue);

  if (!/\d{10,}/.test(argValue)) {
    throw new RangeError(
      `Internal error: argument '${argName}' is not a 10-digit number in function '${funcName}' (component is '${compName}')`
    );
  }
}

/**
 * Gets enum key with associated value provided
 *
 * @param enumType - enum definition name; EnumName in '' expression like 'enum EnumName {KEY = "value"}'
 * @param enumValue - enum value (returns by expression like EnumName.KEY)
 * @param compName - component name (who calls this function) for diagnostic purpose
 * @return - enum key for enumValue arg associated with
 * @throws RangeError - if there is no key associated with value provided
 */
export function getEnumKeyByValue(enumType: any, enumValue: any, compName?: string): string {
  const STR_FUNC_NAME = 'getEnumKeyByValue', STR_ENUM = 'enum';
  const comp = `${compName ? compName + ' -> ' : ''}${STR_NAME_COMPONENT_UTILS}`;
  checkArgIsNotNull(comp, STR_FUNC_NAME, `${STR_ENUM}Type`, enumType);
  checkArgIsNotNull(comp, STR_FUNC_NAME, `${STR_ENUM}Value`, enumValue);

  const values = Object.values(enumType);
  for (let i = 0; i < values.length; i++) {
    if (values[i] === enumValue) {
      return Object.keys(enumType)[i];
    }
  }

  throw new RangeError(STR_MSG_ENUM_KEY_FOR_VALUE_NOT_FOUND);
}

/**
 * Copies from source to target object properties persists in last one (non-immutable).
 * This function was implemented try to fix common copy behavior of JS such as spread operator and Object.assign().
 * Those JS tools copies to target object ALL available properties of source object -
 * such behavior confuse working with semantically different types
 * (more thin target types can have properties of more wide source types with spread operator affecting under objects, for example)
 *
 * @param target - target object (modifiable by reference)
 * @param source - source object
 * @param compName - component name (who calls this function) for diagnostic purpose
 */
export function copyObj(target: any, source: any, compName?: string): void {
  const STR_FUNC_NAME = 'copyObj';
  const comp = `${compName ? compName + ' -> ' : ''}${STR_NAME_COMPONENT_UTILS}`;
  checkArgHasType(comp, STR_FUNC_NAME, 'target', target, EType.OBJ);
  checkArgHasType(comp, STR_FUNC_NAME, 'source', target, EType.OBJ);

  const targetKeys = Object.keys(target);
  for (const key of targetKeys) {
    if (key in source) {
      target[key] = source[key];
    }
  }
}

/**
 * Capitalize first character of string
 * @param str - provided string
 * @return - result string
 */
export function firstCharCapital(str: string): string {
  if (!str) {
    return str;
  }
  return str.toUpperCase().substring(0, 1) + str.substring(1);
}

/**
 * Abbreviation for read convenience
 */
export function UP1(str: string): string {
  return firstCharCapital(str);
}

/**
 * Generates GUID like sequence with requested position length and base alphabet characters.
 *
 * @param idLen - length of returned id (positive number)
 * @param abc - input alphabet (at least one symbol)
 * @param compName - component name (who calls this function) for diagnostic purpose (optional)
 */
export function generateId(idLen: number, abc = STR_ABC_ALL_LETTERS_DIGITS, compName?: string): string {
  const STR_FUNC_NAME = 'generateId';
  const comp = `${compName ? compName + ' -> ' : ''}${STR_NAME_COMPONENT_UTILS}`;
  checkArgValIsNotEmpty(comp, STR_FUNC_NAME, 'idLen', idLen);
  checkArgValIsNotEmpty(comp, STR_FUNC_NAME, 'abc', abc);

  let result = '';
  let abcLen = abc.length;
  for ( let i = 0; i < idLen; i++ ) {
    result += abc.charAt(Math.floor(Math.random() * abcLen));
  }
  return result;
}

/**
 * Delay timer
 *
 * @param ms - delay timeout in milliseconds
 */
export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

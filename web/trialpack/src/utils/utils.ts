/**
 * TrialPack is web application contains several basic samples to ease web development experience.
 * Copyright (c) 2024 Andrey Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
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

/**
 * Check argument is not null
 *
 * @param component - component name
 * @param funcName - function name
 * @param argName - argument name
 * @param argValue - argument value
 */
export function checkArgIsNotNull(component: string, funcName: string, argName: string, argValue: any) {
  if (argValue === null || argValue === undefined) {
    throw new ReferenceError(
      `Internal error: argument '${argName}' is null or undefined in function '${funcName}' (component '${component}')`
    );
  }
}

/**
 * Check argument for empty string or zero
 * (arguments similar checkArgIsNotNull() function)
 */
export function checkArgValIsNotEmpty(component: string, funcName: string, argName: string, argValue: string | number) {
  if (!argValue) {
    throw new ReferenceError(
      `Internal error: argument '${argName}' is undefined in function '${funcName}' (component '${component}')`
    );
  }
}

/**
 * Check for number sequence in string argument
 * (arguments similar checkArgIsNotNull() function)
 */
export function checkArgIs10DigitNumber(component: string, funcName: string, argName: string, argValue: string) {
  checkArgValIsNotEmpty(component, funcName, argName, argValue);

  if (!/\d{10,}/.test(argValue)) {
    throw new RangeError(
      `Internal error: argument '${argName}' is not a 10-digit number in function '${funcName}' (component '${component}')`
    );
  }
}

/**
 * Delay timer
 *
 * @param ms - delay timeout in milliseconds
 */
export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
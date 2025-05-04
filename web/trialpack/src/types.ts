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

export enum EType {
  NUM = 'number', // represents an integer numbers in ±(2^53-1) range include floating point numbers
  BNT = 'bigint', // represents a variable length integer
  STR = 'string', // represents a string consists of zero or more symbols
  BOL = 'boolean', // represents a boolean value equals 'true' or 'false'
  NUL = 'null', // represents a 'null' value
  UDF = 'undefined', // represents an 'undefined' value
  SMB = 'symbol', // represents for unique identifiers
  OBJ = 'object' // represents complex data structure known as classic object in JS
}

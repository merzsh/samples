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

/**
 * Enum of class hierarchy entities, for which meaningful ids needed.
 * Key is entity type for associated class uses in constructor,
 * value is start number to generate new id
 */
export enum EAtmEntity {
  DF = '0', // Default entity
  BS = '100', // Information banking system
  CL = '1000', // Client
  AC = '2000', // Account
  BR = '3000', // Branch
  ST = '4000', // Treasure store
  NT = 'note' // Note
}

export enum EAtmEntityNames {
  DF = 'default',
  BS = 'information banking system',
  CL = 'client',
  AC = 'account',
  BR = 'branch',
  ST = 'treasure store',
  NT = 'note'
}

export enum EAtmUserRole {
  DEFAULT,
  ADMIN,
  USER
}

export enum EAtmNoteNominal {
  ONE = '1',
  TWO = '2',
  FIV = '5',
  TEN = '10',
  TTY = '20',
  FTY = '50',
  HDR = '100'
}

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

import {EAtmEntity, EAtmNoteNominal} from '../tellerTypes';
import AtmBranch from './AtmBranch';
import AtmCashHolder from './AtmCashHolder';

/**
 * Implements treasure store of bank branch
 */
export default class AtmTreasureStore extends AtmCashHolder {

  // branch owns this treasure store
  private branch: AtmBranch;

  /**
   * Object constructor
   *
   * @param branch - bank branch which owns this treasure store (places in bank building)
   * @param name - mnemonic name of storage
   * @param id - id of created object (optional; if unspecified, new id will be generated due EAtmEntity settings)
   */
  constructor(branch: AtmBranch, name?: string, id?: string) {
    super(EAtmEntity.ST, name, id);
    this.branch = branch;
  }

  /**
   * Gets bank branch owns this store
   *
   * @return - bank branch
   */
  public getBranch(): AtmBranch {
    return this.branch;
  }

  /**
   * Sets bank branch owns this store
   *
   * @param value - new branch address value (must be unspecified)
   */
  public setBranch(value: AtmBranch) {
    this.branch = value;
  }

}

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

import AtmAbstract from "./AtmAbstract";
import {EAtmEntity} from "../tellerTypes";
import {generateId} from "../../../utils/utils";
import {STR_ABC_DIGITS, STR_ABC_LETTERS_CAP} from "../../../utils/constants";
import {STR_ATM_CLS_DEFAULT_METH_ARG_NAME, STR_ATM_UNDEFINED} from "../tellerConstants";
import AtmTreasureStore from "./AtmTreasureStore";

/**
 * Implements bank separate branch has treasure store
 */
export default class AtmBranch extends AtmAbstract {

  // Current bank address
  private branchAddress: string = '';

  // Treasure storage (one per branch)
  private storage = new AtmTreasureStore(this);

  /**
   * Object constructor
   *
   * @param name - bank branch name for clients
   * @param id - id of created object (optional; if unspecified, new id will be generated due EAtmEntity settings)
   */
  constructor(name?: string, id?: string) {
    super(EAtmEntity.BR, name ?? '', id);
  }

  /**
   * Gets bank branch address
   *
   * @return - bankAddress class property current value
   */
  public getBranchAddress(): string {
    return this.branchAddress;
  }

  /**
   * Sets bank branch address
   *
   * @param value - new branch address value (must be unspecified)
   */
  public setBranchAddress(value: string) {
    this.checkMethArgIsNotEmpty('setBranchAddress', STR_ATM_CLS_DEFAULT_METH_ARG_NAME, value);
    this.branchAddress = value;
  }

  /**
   * Gets bank branch treasure storage
   *
   * @return - branch treasure storage
   */
  public getTreasureStore(): AtmTreasureStore {
    return this.storage;
  }

}

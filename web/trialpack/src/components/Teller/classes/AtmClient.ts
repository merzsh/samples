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
import AtmAbstract from './AtmAbstract';
import {
  STR_ATM_CLS_DEFAULT_METH_ARG_NAME,
  STR_ATM_UNDEFINED
} from '../tellerConstants';
import {EAtmEntity, EAtmNoteNominal, EAtmUserRole} from '../tellerTypes';
import AtmNote from "./AtmNote";
import AtmCashHolder from "./AtmCashHolder";

/**
 * Implements bank client
 */
export default class AtmClient extends AtmCashHolder {

  private access = EAtmUserRole.USER;
  private email = STR_ATM_UNDEFINED;

  /**
   * Object constructor
   *
   * @param name - Client full name
   * @param id - id of created object (optional; if unspecified, new id will be generated due EAtmEntity settings)
   */
  constructor(name?: string, id?: string) {
    super(EAtmEntity.CL, name, id);
  }

  /**
   * Getter for client access class property
   *
   * @return - client access class property current value
   */
  public getAccessRole(): EAtmUserRole {
    return this.access;
  }

  /**
   * Setter for client access class property
   *
   * @param value - new client access class property value (might not be unspecified)
   */
  public setAccessRole(value: EAtmUserRole) {
    this.checkMethArgIsNotEmpty('setAccess', STR_ATM_CLS_DEFAULT_METH_ARG_NAME, value);
    this.access = value;
  }

  /**
   * Getter for client email class property
   *
   * @return - client email class property current value
   */
  public getEmail(): EAtmUserRole {
    return this.access;
  }

  /**
   * Setter for client email class property
   *
   * @param value - new client email class property value (might not be unspecified)
   */
  public setEmail(value: string) {
    this.checkMethArgIsNotEmpty('setEmail', STR_ATM_CLS_DEFAULT_METH_ARG_NAME, value);
    this.email = value;
  }

}

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

import { Map } from 'immutable';
import {
  STR_ATM_CLS_DEFAULT_METH_ARG_NAME,
  STR_ATM_UNDEFINED
} from '../tellerConstants';
import { EAtmEntity } from '../tellerTypes';
import {checkArgHasType, checkArgValIsNotEmpty, getEnumKeyByValue, UP1} from '../../../utils/utils';
import {EType} from "../../../types";
import AtmClient from "./AtmClient";

/**
 * Base class for all Automated Teller Machine classes.
 */
export default abstract class AtmAbstract {

  // Current ids pool divided by entity type
  private static idsPool = Map<EAtmEntity, number>();

  // Entity type
  protected readonly entityType: EAtmEntity;

  // Entity current id
  protected readonly id: string;

  // Entity name
  protected name = STR_ATM_UNDEFINED;

  /**
   * Generates new id for provided entity type
   *
   * @protected
   * @throws SyntaxError - if id can't to be generated
   * @return - new entity id generated as number
   */
  protected static generateNewId(entityType: EAtmEntity): number {
    let id = this.idsPool.get(entityType);
    if (!id) {
      id = parseInt(entityType);
      if (isNaN(id)) throw new SyntaxError(`Value of type EAtmEntity has incorrect number: ${entityType}`);
      else if (id < 0) throw new SyntaxError(`Value of type EAtmEntity is <= 0: ${entityType}`);
    }
    id++;
    this.idsPool = this.idsPool.set(entityType, id);

    return id;
  }

  /**
   * Diagnoses for any argument of subclass method initial or undefined.
   *
   * @param methName - class method name for check
   * @param argName - class method argument name for check
   * @param argValue - class method argument value for check
   * @protected
   * @throws RangeError - if argValue is initial
   */
  protected checkMethArgIsNotEmpty(methName: string, argName: string, argValue: string | number) {
    checkArgValIsNotEmpty(this.constructor.name, methName, argName, argValue);
  }

  /**
   * Diagnoses for any argument of subclass method is object.
   *
   * @param methName - class method name for check
   * @param argName - class method argument name for check
   * @param argValue - class method argument value for check
   * @protected
   * @throws RangeError - if argValue is initial (non-catchable in obvious scenarios)
   */
  protected checkMethArgIsObject(methName: string, argName: string, argValue: any) {
    checkArgHasType(this.constructor.name, methName, argName, argValue, EType.OBJ);
  }

  /**
   * Returns all branches id
   * @return string[] - array branches id (or empty if no one id found)
   */
  protected getAllMapKeys<K>(map: Map<K, any>): K[] {
    let result: K[] = [];

    if (map.size) {
      result = [...map.keys()];
    }

    return result;
  }

  /**
   * Gets any map entity (value) by its key
   * @param map - map to get entity
   * @param key - entity id (key)
   * @param keyAsString - id string representation
   * @param entityOfValue - entity of requested value
   * @protected
   * @return - requested value by its id
   * @throws RangeError - if entity was not found by its id (key)
   */
  protected getMapValueByKey<K,V>(map: Map<K, V>, key: K, keyAsString?: string, entityOfValue?: string): V {
    const result = map.get(key);
    if (result) return result;
    else throw new RangeError(`${entityOfValue ? UP1(entityOfValue) : ''} entity with id ${keyAsString ?? ''} was not found`);
  }

  /**
   * Base constructor of all ATM objects
   * @param entityType - type of created entity (optional, used for id generation, etc.)
   * @param name - created object name (optional)
   * @param id - created object id (optional; generates if omitted)
   * @protected
   */
  protected constructor(entityType = EAtmEntity.DF, name?: string, id?: string) {
    this.entityType = entityType;
    this.name = name ?? '';
    this.id = id ? id : AtmAbstract.generateNewId(this.entityType).toString();
  }

  /**
   * Getter for entity type class property
   *
   * @return - entity type class property current value
   */
  public getEntityType(): EAtmEntity {
    return this.entityType;
  }

  /**
   * Getter for entity type class property as string
   *
   * @return - entity type class property current value as string
   */
  public getEntityTypeAsString(): string {
    return getEnumKeyByValue(EAtmEntity, this.entityType, `${this.constructor.name}.getEntityTypeAsString()`);
  }

  /**
   * Getter for entity id class property
   *
   * @return - entity id class property current value
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Getter for entity id as a number
   *
   * @throws RangeError - if id can't be interpreted as a number (signals dev logic error and uncaught so)
   */
  public getIdAsNumber(): number {
    const result = parseInt(this.id);
    if (isNaN(result)) throw new RangeError(`Current entity id '${this.id}' can't be interpreted as a number!`);
    else return result;
  }

  /**
   * Getter for entity name class property
   *
   * @return - entity name class property current value
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Setter for entity name class property
   *
   * @param value - new entity name class property value (might not be unspecified)
   */
  public setName(value: string) {
    this.checkMethArgIsNotEmpty('setName', STR_ATM_CLS_DEFAULT_METH_ARG_NAME, value);
    this.name = value;
  }
}

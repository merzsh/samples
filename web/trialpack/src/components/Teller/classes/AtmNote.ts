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
import {EAtmEntity, EAtmNoteNominal} from "../tellerTypes";
import {checkArgValIsNotEmpty, generateId, getEnumKeyByValue, UP1} from "../../../utils/utils";
import {
  STR_ABC_DIGITS,
  STR_ABC_LETTERS_CAP,
  STR_MSG_ARGUMENT,
  STR_MSG_CLASS, STR_MSG_COMPONENT,
  STR_MSG_METHOD
} from "../../../utils/constants";
import {NUM_ONE_DOLLAR, STR_ATM_CLS_DEFAULT_METH_ARG_NAME} from "../tellerConstants";
import AtmClient from "./AtmClient";
import AtmTreasureStore from "./AtmTreasureStore";

/**
 * Implement banknote
 */
export default class AtmNote extends AtmAbstract {

  // Unassigned to anybody initial cash
  private static freeCash = new Map<EAtmNoteNominal, AtmNote[]>();

  private owner?: AtmClient;
  private storage?: AtmTreasureStore;

  constructor(nominal: EAtmNoteNominal) {
    super(EAtmEntity.NT, nominal, AtmNote.generateNoteId());
    // this.name interprets as EAtmNoteNominal here
  }

  /**
   * Generates cash as much as u want :)
   *
   * @param cashAmount - amount which cash should be generated on
   * @param maxNominal - maximum banknote nominal in generated cash
   * @param cash - generated cash banknotes by nominal
   * @return - map with arrays of banknotes AtmNote[] (map value) for each nominal EAtmNoteNominal (map key)
   * @throws RangeError - incorrect amount provided
   */
  private static generateCashInternal(cashAmount: number, maxNominal: EAtmNoteNominal, cash: Map<EAtmNoteNominal, AtmNote[]>):
    Map<EAtmNoteNominal, AtmNote[]> {
    const STR_COMP_NAME = 'tellerFactory', STR_FUNC_NAME = 'generateCash' ,
      STR_ARG_NAME = 'cashAmount';
    checkArgValIsNotEmpty(STR_COMP_NAME, STR_FUNC_NAME, STR_ARG_NAME, cashAmount);
    cashAmount = Math.floor(cashAmount);
    // check again for cashAmount is fractal (0.1 for example, it's down to zero by Math.floor now)
    checkArgValIsNotEmpty(STR_COMP_NAME, STR_FUNC_NAME, STR_ARG_NAME, cashAmount);
    if (cashAmount < 0) throw new RangeError('Requested amount must be greater than zero!');
    const maxNominalInt = AtmNote.checkNoteNominal(STR_COMP_NAME, STR_FUNC_NAME, maxNominal);
    // here cashAmount and maxNominal are positive integers

    // get available nominals as integers array
    const nominals: number[] = [];
    Object.values(EAtmNoteNominal).forEach(item => {
      const currNom = AtmNote.checkNoteNominal(STR_COMP_NAME, STR_FUNC_NAME, item);
      if (currNom <= maxNominalInt) {
        nominals.push(currNom);
      }
    });
    nominals.sort((a,b) => a < b ? 1 : (a > b ? -1 : 0));

    // got start nominal to change in nominals[0]
    if (!cash.size) {
      cash = new Map<EAtmNoteNominal, AtmNote[]>();
    }
    while (cashAmount < nominals[0] || (cashAmount === nominals[0] && nominals[0] !== NUM_ONE_DOLLAR)) {
      nominals.shift();
    }
    if (cashAmount === NUM_ONE_DOLLAR && nominals[0] === NUM_ONE_DOLLAR) {
      cash = cash.set(EAtmNoteNominal.ONE, [new AtmNote(EAtmNoteNominal.ONE)]);
      return cash;
    }

    const nominalKey = getEnumKeyByValue(EAtmNoteNominal, nominals[0].toString(), STR_COMP_NAME) as keyof typeof EAtmNoteNominal,
      cashAmountHalfFloor = EAtmNoteNominal[nominalKey] === EAtmNoteNominal.ONE ? cashAmount : Math.floor(cashAmount / 2) /* lower integer part */;
    let generatedCashAmount: number, resultNotesArr: AtmNote[];
    if (cashAmountHalfFloor < nominals[0]) {
      generatedCashAmount = nominals[0];
      resultNotesArr = new Array(1);
      resultNotesArr[0] = new AtmNote(EAtmNoteNominal[nominalKey]);
    } else {
      const currNominalCount = Math.floor(cashAmountHalfFloor / nominals[0]);
      generatedCashAmount = currNominalCount * nominals[0];
      resultNotesArr = new Array(currNominalCount);
      for (let i=0; i<resultNotesArr.length; i++) {
        resultNotesArr[i] = new AtmNote(EAtmNoteNominal[nominalKey]);
      }
    }
    cash = cash.set(EAtmNoteNominal[nominalKey], resultNotesArr);

    if (nominals.length === 1) {
      return cash;
    } else if (nominals.length > 1) {
      const nominalKeyNext = getEnumKeyByValue(EAtmNoteNominal, nominals[1].toString(),
        STR_COMP_NAME) as keyof typeof EAtmNoteNominal;
      return AtmNote.generateCashInternal(cashAmount-generatedCashAmount, EAtmNoteNominal[nominalKeyNext], cash);
    } else throw new Error(`Unexpected error in ${STR_COMP_NAME}.${STR_FUNC_NAME}(): nominals.length is 0`);
  }

  public static generateCash(cashAmount: number, maxNominal: EAtmNoteNominal): void {
    AtmNote.freeCash = AtmNote.generateCashInternal(cashAmount, maxNominal, AtmNote.freeCash);
  }

  /**
   * Gets free available cash. If size is 0, generate it via generateCashInternal().
   * @throws EvalError - if size of free cash is zero (equal no cash)
   */
  public static getFreeCash(): Map<EAtmNoteNominal, AtmNote[]> {
    if (!AtmNote.freeCash.size) throw new EvalError('Free cash is empty, generate it with AtmNote.generateCash() method first');
    return AtmNote.freeCash;
  }

  public static generateNoteId(): string {
    const abcPart = generateId(3, STR_ABC_LETTERS_CAP, AtmNote.name);
    const numPart = generateId(8, STR_ABC_DIGITS, AtmNote.name);
    return abcPart.substring(0, 2) + numPart + abcPart.substring(2);
  }

  /**
   * Checks nominal string is valid number associated
   * @param compName - component name (who calls this function) for diagnostic purpose
   * @param methName - class method name for check
   * @param noteNominal - banknote nominal integer represented as string in EAtmNoteNominal enum
   * @return number - note nominal as integer
   */
  public static checkNoteNominal(compName: string, methName: string, noteNominal: string): number {
    const nom = parseInt(noteNominal), STR_ENUM_PHRASE = 'Value of type EAtmNoteNominal';
    const violation = `violation detected into ${STR_MSG_METHOD} '${methName}()' of '${compName}' ${STR_MSG_COMPONENT}/${STR_MSG_CLASS}`;
    if (isNaN(nom)) {
      throw new Error(`${STR_ENUM_PHRASE} has incorrect number '${noteNominal}', ` + violation);
    } else if (nom <= 0) {
      throw new Error(`${STR_ENUM_PHRASE} '${noteNominal}' is <= 0, ` + violation);
    }
    return nom;
  }

  /**
   * Gets owner of this banknote
   *
   * @return AtmClient - owner of this banknote
   * @throws ReferenceError - if no any owner yet assigned
   */
  public getOwner(): AtmClient {
    if (!this.owner) throw new ReferenceError('There is no any owner yet assigned');
    return this.owner;
  }

  /**
   * Sets owner of this banknote
   * @param value - owner of this banknote
   */
  public setOwner(value: AtmClient): void {
    this.owner = value;
  }

  /**
   * Gets storage of this banknote
   *
   * @return AtmTreasureStore - storage of this banknote
   * @throws ReferenceError - if no any storage yet assigned
   */
  public getStorage(): AtmTreasureStore {
    if (!this.storage) throw new ReferenceError('There is no any storage yet assigned');
    return this.storage;
  }

  /**
   * Sets Storage of this banknote
   * @param value - Storage of this banknote
   */
  public setStorage(value: AtmTreasureStore): void {
    this.storage = value;
  }

}

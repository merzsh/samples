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
import AtmNote from "./AtmNote";
import {checkArgHasType} from "../../../utils/utils";
import {EType} from "../../../types";

/**
 * Implements cash holder who owns cash storage
 */
export default class AtmCashHolder extends AtmAbstract {
  // arrays of stored banknotes, where key is banknote nominal and value is array of banknotes serial numbers presented
  protected notesStorage = new Map<EAtmNoteNominal, AtmNote[]>();

  /**
   * Object constructor (see AtmAbstract constructor description for details)
   */
  constructor(entityType = EAtmEntity.DF, name?: string, id?: string) {
    super(entityType, name, id);
  }

  /**
   * Gets total amount of nominal placed in treasure store
   *
   * @param noteNominal - nominal of notes amount calculates for
   */
  public getAmountOfStoredNominal(noteNominal: EAtmNoteNominal): number {
    // check incoming arg
    const STR_METH_NAME = 'getAmountOfStoredNominal';
    checkArgHasType(this.constructor.name, STR_METH_NAME, 'noteNominal', noteNominal, EType.STR);
    const nom = AtmNote.checkNoteNominal(this.constructor.name, STR_METH_NAME, noteNominal);

    const notes = this.notesStorage.get(noteNominal);
    if (!notes || !notes.length) return 0;

    return notes.length * nom;
  }

  /**
   * Removes from storage with requested total amount serial of notes and returns them.
   *
   * @param noteNominal - nominal of notes removed from storage
   * @param amount - removed amount; must be > 0 and be divisible with note nominal
   * @return AtmNote[] - removed from storage banknotes series
   * @throws EvalError - if requested amount not divisible with note nominal
   * @throws RangeError - if requested amount exceeds total amount of this nominal has stored
   */
  public removeNotesFromStorage(noteNominal: EAtmNoteNominal, amount: number): AtmNote[] {
    // check incoming args
    const STR_METH_NAME = 'removeNotesFromStorage';
    checkArgHasType(this.constructor.name, STR_METH_NAME, 'noteNominal', noteNominal, EType.STR);
    const nom = AtmNote.checkNoteNominal(this.constructor.name, STR_METH_NAME, noteNominal);

    this.checkMethArgIsNotEmpty(STR_METH_NAME, 'amount', amount);
    if (amount <= 0) throw new Error(`Value amount is not greater than zero`);
    if (amount % nom !== 0) throw new EvalError('Requested amount is not divisible with note nominal');

    const storeAmount = this.getAmountOfStoredNominal(noteNominal);
    if (amount > storeAmount) throw new RangeError('Requested amount exceeds total amount of this nominal has stored');

    // all checks passed - return requested sum of banknotes
    const result: AtmNote[] = [];
    const storedNotes = this.notesStorage.get(noteNominal);
    const errMsg = `Unexpected error in ${this.constructor.name}.removeNotesFromStorage(), stored notes array is empty`;
    if (!storedNotes) throw new Error(errMsg);
    const removedNotesAmount = amount / nom;
    for (let i=0; i<removedNotesAmount; i++) {
      const note = storedNotes.pop();
      if (!note) throw new Error(errMsg);
      result.push(note);
    }

    return result;
  }

  /**
   * Put notes array to notes storage.
   *
   * @param noteNominal - nominal of notes placed
   * @param notes - array of specified nominal note series
   */
  public putNotes2Storage(noteNominal: EAtmNoteNominal, notes: AtmNote[]) {
    if (!notes.length) return;
    let currNotesArr= this.notesStorage.get(noteNominal);
    currNotesArr = currNotesArr ? [...currNotesArr, ...notes] : [...notes];
    this.notesStorage = this.notesStorage.set(noteNominal, currNotesArr);
  }
}

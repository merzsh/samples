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

import {Map} from 'immutable';
import AtmAbstract from './AtmAbstract';
import {
  STR_ATM_CLS_DEFAULT_METH_ARG_NAME,
  STR_ATM_CLS_ID_METH_ARG_NAME,
  STR_ATM_UNDEFINED
} from '../tellerConstants';
import {EAtmEntity, EAtmEntityNames, EAtmNoteNominal} from '../tellerTypes';
import AtmClient from './AtmClient';
import AtmBranch from "./AtmBranch";
import AtmNote from "./AtmNote";

/**
 * Class of Information Banking System represents co-working of all banking entities
 */
export default class AtmInfoBankSystem extends AtmAbstract {

  // Info Banking System version
  private systemVersion = '';

  // Bank branches
  private branches = Map<string, AtmBranch>();

  // Clients
  private clients = Map<string, AtmClient>();

  /**
   * Object constructor
   *
   * @param name - title for Informational Banking System instance
   * @param id - id of created object (optional; if unspecified, new id will be generated due EAtmEntity settings)
   */
  constructor(name?: string, id?: string) {
    super(EAtmEntity.BS, name ?? '', id);
  }

  /**
   * Getter for bankAddress class property
   *
   * @return - bankAddress class property current value
   */
  public getSystemVersion(): string {
    return this.systemVersion;
  }

  /**
   * Setter for bankAddress class property
   *
   * @param value - new bankAddress class property value (might not be unspecified)
   */
  public setSystemVersion(value: string) {
    this.checkMethArgIsNotEmpty('setSystemVersion', STR_ATM_CLS_DEFAULT_METH_ARG_NAME, value);
    this.systemVersion = value;
  }

  /**
   * Returns all branches id
   * @return string[] - array branches id (or empty if no one id found)
   */
  public getAllBranchesId(): string[] {
    return this.getAllMapKeys<string>(this.branches);
  }

  /**
   * Getter for current branch of available branches list
   *
   * @param id - client id requested
   * @return - current client of clients class property
   * @throws RangeError - if client with provided id was not found
   */
  public getBranchById(id: string): AtmBranch {
    this.checkMethArgIsNotEmpty('getBranchById', STR_ATM_CLS_ID_METH_ARG_NAME, id);
    return this.getMapValueByKey<string,AtmBranch>(this.branches, id, id, EAtmEntityNames.BR);
  }

  /**
   * Setter for adding new client (if existing one with the same id it will be replaced)
   *
   * @param value - new client with specified id
   */
  public setBranch(value: AtmBranch) {
    this.branches = this.branches.set(value.getId(), value);
  }

  /**
   * Returns all clients id or empty array if no one id found
   * @return string[] - array clients id (or empty if no one id found)
   */
  public getAllClientsId(): string[] {
    return this.getAllMapKeys<string>(this.clients);
  }

  /**
   * Getter for current client of clients class property
   *
   * @param id - client id requested
   * @return - current client of clients class property
   * @throws RangeError - if client with provided id was not found
   */
  public getClientById(id: string): AtmClient {
    this.checkMethArgIsNotEmpty('getClientById', STR_ATM_CLS_ID_METH_ARG_NAME, id);
    return this.getMapValueByKey<string,AtmClient>(this.clients, id, id, EAtmEntityNames.CL);
  }

  /**
   * Setter for adding new client (if existing one with the same id it will be replaced)
   *
   * @param value - new client with specified id
   */
  public setClient(value: AtmClient) {
    this.clients = this.clients.set(value.getId(), value);
  }

  /**
   * Associates free unassigned cash (w/o any owner) banknotes with bank client
   *
   * @param client - client cash assigned to
   * @param notes - line array of notes with different nominal
   * @return AtmNote[] - line array of unassigned notes
   */
  public assignFreeCash2Client(client: AtmClient, notes: AtmNote[]): AtmNote[] {
    let storage = Map<EAtmNoteNominal, AtmNote[]>();
    const result: AtmNote[] = [];

    for (const note of notes) {
      try {
        note.getOwner();
        result.push(note);
        continue;
      } catch {
        note.setOwner(client);
      }

      const name = note.getName();
      let nom: EAtmNoteNominal;
      switch (name) {
        case EAtmNoteNominal.ONE:
          nom = EAtmNoteNominal.ONE;
          break;
        case EAtmNoteNominal.TWO:
          nom = EAtmNoteNominal.TWO;
          break;
        case EAtmNoteNominal.FIV:
          nom = EAtmNoteNominal.FIV;
          break;
        case EAtmNoteNominal.TEN:
          nom = EAtmNoteNominal.TEN;
          break;
        case EAtmNoteNominal.TTY:
          nom = EAtmNoteNominal.TTY;
          break;
        case EAtmNoteNominal.FTY:
          nom = EAtmNoteNominal.FTY;
          break;
        case EAtmNoteNominal.HDR:
          nom = EAtmNoteNominal.HDR;
          break;
        default:
          throw new Error(`Unknown EAtmNoteNominal enum key: ${name}`);
      }
      const notesOfNom: AtmNote[] = storage.get(nom) ?? [];
      if (!notesOfNom.length) {
        storage = storage.set(nom, notesOfNom);
      }
      notesOfNom.push(note);
    }

    for (const nom of storage.keys()) {
      const val = storage.get(nom);
      if (val) {
        client.putNotes2Storage(nom, val);
      }
    }

    return result;
  }

}

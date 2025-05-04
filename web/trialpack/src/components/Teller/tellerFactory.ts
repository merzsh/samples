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

import AtmInfoBankSystem from "./classes/AtmInfoBankSystem";
import AtmClient from './classes/AtmClient';
import {EAtmNoteNominal, EAtmUserRole} from './tellerTypes';
import AtmBranch from "./classes/AtmBranch";
import AtmNote from "./classes/AtmNote";

/**
 * Factory function for new instance fast creation of AtmInfoBankSystem class and setting all subsequent entities of it.
 *
 * @return - AtmInfoBankSystem class instance
 */
export default function createIbsObject(): AtmInfoBankSystem {
  const ibs = new AtmInfoBankSystem();

  // create one clear instance of Informational Banking System
  ibs.setName('JP Morgan Informational Banking System 2025');
  ibs.setSystemVersion('ver. 1.0.1');

  // create two branches in system
  let branch = new AtmBranch('JP Morgan - NY');
  branch.setBranchAddress('11, Wall st., NY, USA');
  ibs.setBranch(branch);

  branch = new AtmBranch('JP Morgan - LA');
  branch.setBranchAddress('123, North Vermont st., LA, USA');
  ibs.setBranch(branch);

  // create bank clients with main host
  let client = new AtmClient();
  client.setName('Bill Smith');
  client.setAccessRole(EAtmUserRole.ADMIN);
  client.setEmail('bill.smith@jpmorgan.com');
  ibs.setClient(client);

  // generate free money goes on financial markets
  AtmNote.generateCash(100000, EAtmNoteNominal.HDR);
  // and assign it to host client
  const freeCash = AtmNote.getFreeCash();
  let freeNotes: AtmNote[] = [];
  for (const notes of freeCash.values()) {
    if (!notes) continue;
    freeNotes = freeNotes.concat(notes);
  }
  // ... and imagine these money was earned by any bank co-owner - let's assign it to them
  const unassignedNotes = ibs.assignFreeCash2Client(client, freeNotes);
  if (unassignedNotes.length) throw new Error(`All notes here must be assigned!`);

  return ibs;
}

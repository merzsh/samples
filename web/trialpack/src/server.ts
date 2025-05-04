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

import { createServer, Server } from 'miragejs';
// import AtmInfoBankSystem from "./components/Teller/classes/AtmInfoBankSystem";

export function makeServer(): Server {

  // const atm = new AtmInfoBankSystem();
  // atm.setName('Some bank name');
  // window.variables = atm;

  return createServer({
    models: {},
    seeds(server) {},
    routes() {
      // this.urlPrefix = '/api-module/';
      this.logging = true;

      const interceptUrlsArray: string[] = [];
      function addMockUrl(url: string) : string {
        interceptUrlsArray.push(url);
        return url;
      }

      this.get(addMockUrl('/api/trialpack/teller/some_endpoint'),
        (schema, request) => {
          console.log(12345, `Mirage.server`);
          const param = request?.queryParams['arg']?.toString() ?? '';
          const result = { arg: param, vars: window.variables };
          //const data = getParamValue(param, STR_PARAM_DATA);

          console.log(12345, `Mirage.server /api/trialpack/teller/some_endpoint answer is`, result);

          return result;
        });

      /*
      // Sample
      this.get(addMockUrl('/api/suffix/endpoint'),
        (schema, request) => {
          const param = request?.queryParams['$filter']?.toString() ?? '';
          const data = getParamValue(param, STR_PARAM_DATA);

          return getDataMock(data);
        });
      */

      this.passthrough((request) => {
        let result = false;
        for (const url of interceptUrlsArray) {
          result = request.url.startsWith(url);
          if (result) {
            break;
          }
        }
        return !result;
      });
    },
  });
}

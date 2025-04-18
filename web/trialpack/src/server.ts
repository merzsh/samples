import { createServer, Server } from 'miragejs';

export function makeServer(): Server {

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
          const result = { arg: param };
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

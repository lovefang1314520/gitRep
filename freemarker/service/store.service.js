let baseService = require("./base.service.js");
function api({ url, method, params, data }) {
  return baseService.service({
    apiPrefix: 'MHYQMINIAPP',
    url,
    method,
    params,
    data
  })
}
module.exports = {
  api
}
let baseService = require("./base.service.js");
function api({ apiPrefix, url, method, params, data, fromH5, header}) {
  return baseService.service({ apiPrefix, url, method, params, data, fromH5, header})
}
module.exports = {
  api
}
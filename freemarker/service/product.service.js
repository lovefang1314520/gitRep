let baseService = require("./base.service.js");
const utils = require("../utils/util.js");
function api({ url, method = 'get', params = {}, data = {} }) {
  return baseService.service({ url: "/product" + url, method, params, data })
}
module.exports = {
  api
}
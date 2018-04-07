let baseService = require("./base.service.js");
function api({ url, method, params, data }) {
  return baseService.service({url: "order" + url, method, params, data })
}
function apiSWKPAY({ url, method, params, data }) {
  return baseService.service({ apiPrefix: 'SWKPAY', url: "/order" + url, method, params, data })
}
module.exports = {
  api,
  apiSWKPAY
}
let baseService = require("./base.service.js");
function api({ url, method, params, data, formType, header}) {
  return baseService.service({ apiPrefix: 'SWKPAY', url: "/order/api/order" + url, method, params, data, formType,header})
}
module.exports = {
  api
}
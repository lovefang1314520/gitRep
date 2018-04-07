let baseService = require("./base.service.js");
function api({ url, method, params, data }) {
  return baseService.service({ 
    apiPrefix: 'SWKPAY', 
    url,
    method, 
    params, 
    data,
    fromH5: false
  })
}
module.exports = {
  api
}
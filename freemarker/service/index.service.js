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
function getBannersApi({ url, method, params, data }){
  return baseService.service({
    apiPrefix: 'SWKPAY',
    url,
    method,
    params,
    data,
    fromH5: false
  })
}
function getProductByShopId({ url, method, params, data }) {
  return baseService.service({
    apiPrefix: 'MHYQMINIAPP',
    url,
    method,
    params,
    data
  })
}
module.exports = {
  api,
  getBannersApi,
  getProductByShopId
}
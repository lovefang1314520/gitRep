let baseService =  require("./base.service.js");
 function getConfig(){
  return  baseService.service({ url: "/customer-config", method:"get",params:{
    user: wx.getStorageSync('userId')
  }})
}

module.exports ={
  getConfig
}
var url       = 'https://www.woaifruit.com';
var apiPrefix = url + '/api/galacake';

var config = {
    name: "胖鱼商城",
    wemallSession: "wemallSession",
    serviceDistance:8,
    openTime:"11:00-21:00",
    position:{
      "lng": 121.12337, "lat": 31.44343
    },
    static: {
      imageDomain: url 
    },
    api: {
       
    }
};
for (var key in config.api) {
    config.api[key] = apiPrefix + config.api[key];
}
config.dict = {
  orderStatus:{
    "0":"等待受理",
    "1": "等待受理",
    "2": "已受理",
    "6": "等待运输",
    "7": "运输中",
    "10" : "等待签收",
    "8": "已签收",
    "9": "已签收",
    "12": "已完成",
    "13": "等待提货",
    "14": "等待配送",
    "3": "已取消",
    "4": "已取消",
    "5": "已取消"
  },
  COUPON_TYPE:{
    1:'满减券'
  },
  SETTLE_TYPE:{
    '1':'现付',
    '3': '收货人付款'
  },
  COUPON_STATUS:{
    '1':'已生成',
    '2':'已发放',
    '3': '已冻结',
    '4': '已使用',
    '5': '已核销',
    '6': '已作废',
    '7': '已过期',
    '8': '未生效'
  },
  GOODS_NAME: ["设备", "建材", "图书", "药品", "食品", "家具",
    "家电", "服饰", "日用品", "异型物", "其他"],
  GOODS_TYPE: ["普货", "三超货物", "无规则货物", "易碎易损品", "家具"
],
  WRAP_TYPE: ["纸箱", "木箱", "桶", "混包", "裸装", "编袋", "托盘",
    "木框架", "泡沫箱", "缠绕膜", "盘", "铁框", "布袋"
],
  RECEIPT_TYPES: ["无回单要求", "原件普运","电子回单"],
  REMARKS: ["轻拿轻放", "提货要快", "预约提货", "需要仓储", "此贷不急", "此货加急",  "预约送货", "箱车送货", "必须签收", "回单重要", "需要包装"
]
}
module.exports = config;
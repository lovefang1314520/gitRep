// pages/orderlist/orderlist.js
var utils = require('../../utils/util.js');
var orderService = require('../../service/order.service.js');
var tips = require('../../components/tips.js'); 
let config = require("../../config/config.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatusDict: config.dict.orderStatus,
    orders:[],
    winHeight:0,
    formId:"",
    islogin:false,
    selectStatus: "",
    orderstatus:[
      {
        id:'',
        status:'全部'
      },
      {
        id: '0,1',
        status: '等待受理'
      },
      {
        id: '7',
        status: '运输中'
      },
      {
        id: '10',
        status: '等待签收'
      }
    ],
    currentPage: 1,
    totalPage: 2,
    moreFlg: true,
    loadMoreFlg: true
  },
  anthoerOrder(e){//再来一单
    let {item} = e.currentTarget.dataset;
    app.orderObj = item;
    wx.navigateTo({
      url: '/pages/writeorder/writeorder',
    })
  },
  toPay(e){//付款
    let order = e.target.dataset.item;
    wx.navigateTo({
      url: '/pages/pay/pay?order='+JSON.stringify(order),
    })
  },
  gotoLogin(){
    getApp().loginFrom = 'orderlist';
    wx.navigateTo({
      url: '/pages/login/login',
    })

  },
  goDetail: function (e){
    let { no} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/orderdetail/orderdetail?orderNo=' + no,
    })
  },
  setTabActive(event){//tab切换
    let {id} = event.target.dataset;
    this.setData({
      selectStatus: id,
      currentPage: 1,
      moreFlg: true,
      loadMoreFlg: true,
      orderNo:''
    });
    app.keywords = '';
    this.getOrderList();
  },
  gotoOrderSearch(){
    wx.navigateTo({
      url: '/pages/ordersearch/ordersearch',
    })
  },
  cancelOrder(e){//取消订单
    let { item } = e.currentTarget.dataset;
    let that = this;
    wx.showModal({
      content: '确定取消订单',
      success: function (res) {
        if (res.confirm) {
          orderService.api({
            url: '/cancelOrder',
            method: 'post',
            data: {
              userId: wx.getStorageSync('userId'),
              orderNo: item.orderNo,
              reason:'无'
            }
          }).then((res) => {
            if (res.data && res.data.success){
              tips.show(that,'删除成功',3000);
            }else{
              tips.show(that, '删除失败', 3000);
            }
          })
        }
      }
    })

  },
  logisticsTrack: function(e){//物流跟踪
    let { item } = e.currentTarget.dataset;
    let { waybillId, orderNo, sendNetworkName, orderStatus} = item;
    wx.navigateTo({
      url: '/pages/logisticstrack/logisticstrack?waybillId=' + waybillId + '&orderNo=' + orderNo + '&sendNetworkName=' + sendNetworkName + '&orderStatus=' + orderStatus
    })

  },
  getOrderList(){
    let { currentPage, selectStatus, orderNo} = this.data;
    if (orderNo){
      currentPage = 1;
      selectStatus = ''
      this.setData({
        currentPage:1,
        selectStatus:''
      });
    }
    orderService.api({
      url: '/searchOrderList',
      method: 'post',  
      data: {
        userId: wx.getStorageSync('userId'),
        startTime: "",
        endTime: "",
        currentPage,
        pageSize: 10,
        orderStatus: selectStatus,
        orderNo
      }
    }).then((res) => {
      wx.hideLoading();
      console.log(res);
      this.setData({
        loadMoreFlg: true
      })
      if(res && res.data && res.data.records){
        let { orders} = this.data;
        debugger;
        this.setData({
          currentPage: currentPage+1,
          totalPage: res.data.totalPage,
          moreFlg: true,
          orders: orders.unshift(res.data.records)
        });
      }else{
        this.setData({
          orders: []
        });
      }
    })
  },
  showLoading(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  },
  loadMore: function(){//加载更多
    let { currentPage, totalPage, loadMoreFlg} = this.data;
    if (currentPage > totalPage) {//最后一页
      this.setData({
        moreFlg: false
      })
        
    }else{
      if (loadMoreFlg){
        this.setData({
          loadMoreFlg: false
        })
        this.showLoading();
        this.getOrderList();
      }
    }
  },
  refresh: function () {//上拉刷新

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      islogin: app.isLogin,
      orderNo: app.keywords,
      selectStatus: '',
      currentPage: 1,
      moreFlg: true,
      loadMoreFlg: true
    })
    this.showLoading();
    this.getOrderList();

    wx.setNavigationBarTitle({
      title: "我的订单"
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f5f5f5',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });
    utils.getDeviceInfo().then((res)=>{
      this.setData({
        windowHeight: getApp().globalData.deviceInfo.windowHeight
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
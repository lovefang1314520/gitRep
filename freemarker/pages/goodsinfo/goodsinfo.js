// pages/goodsinfo/goodsinfo.js
let config = require("../../config/config.js");
var tips = require('../../components/tips.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModalTwo:false,
    ...config.dict,
    isShowModal:false,
    select_GOODS_TYPE:"普货",
    select_WRAP_TYPE: "纸箱",
    goodsInfo:{
      
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "货物信息"
    });
  },
  bindinput(event){
    let {fieldname} = event.target.dataset;
    this.setData({
      [fieldname]:Number(event.detail.value)
    })

  },
  saveOrder(){
    let { select_GOODS_NAME="",
      select_GOODS_TYPE,
      declaredValue,
      select_WRAP_TYPE, cargoName, totalNum, totalWeight, totalVolume} = this.data;
    cargoName = cargoName || select_GOODS_NAME;
    if (!select_GOODS_NAME && !cargoName){
       tips.show(this,"请输入货物名称",1000);
       return;
    }
    if (!totalNum) {
      tips.show(this, "请输入货物件数", 1000);
      return;
    }
    if (!totalWeight) {
      tips.show(this, "请输入货物重量", 1000);
      return;
    }
    if (!totalVolume) {
      tips.show(this, "请输入货物体积", 1000);
      return;
    }
    if (!declaredValue) {
      tips.show(this, "请输入声明价值", 1000);
      return;
    }
    app.goodsInfo = {
      declaredValue,
      select_GOODS_NAME,
      specialCargoType:select_GOODS_TYPE,
      packing:select_WRAP_TYPE,
      cargoName: cargoName|| select_GOODS_NAME, 
      totalNum: Number(totalNum), 
      totalWeight: Number(totalWeight),
      totalVolume: Number(totalVolume)
    };
   
    wx.navigateTo({
      url: '/pages/writeorder/writeorder?',
    })

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
        ...getApp().goodsInfo
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
    wx.stopPullDownRefresh();
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
  
  },
  setActiveItem(event){
    let { isShowModal } = this.data;
    let { item } = event.currentTarget.dataset;
    this.setData({
      ['select_' + isShowModal]: item,
      activeitem:item
    },()=>{
      this.closeModal();
    })

  },
  showModalTwo(){
    this.setData({
      isShowModalTwo: true
     
    })
  },
  closeModal(){
    this.setData({
      isShowModalTwo:false,
      isShowModal: false
    })
  },
  showModal(event){
    let { modaltype, title } = event.currentTarget.dataset;
    let activeitem = this.data['select_' + modaltype];
    this.setData({
      title,
      activeitem,
      modalList:this.data[modaltype],
      isShowModal: modaltype
    })
  }
})
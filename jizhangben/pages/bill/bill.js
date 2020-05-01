var util = require('../utils/utils.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayExpend: "0",
    monthExpend: "0",
    yearExpend: "0",
    todayRecord: []
  
    
  },

  recordExpend: function () {
    wx.navigateTo({
      url: '../add/add',
    })
  },
  historyExpend: function () {
    wx.navigateTo({
      url: '../history/history',
    })
  },
  //今日账单item点击
  onTodayBillItemClick: function (e) {
    let index = e.currentTarget.dataset.index;

  },

  onLoad: function () {

  },
  onShow: function () {
    let bill;
    const todayDate = util.formatTime(new Date(), "yyyy-MM-dd");
    try {
      bill = wx.getStorageSync('Bill');
    } catch (e) {
    }
    if (bill != "") {
      let todayMoney = 0;
      let monthMoney = 0;
      let yearMoney = 0;
      let todayRecord = [];
      for (let key of bill) {
        //同一天
        if (util.dateIsDifference(key.date, todayDate, "d")) {
          todayMoney += key.spendMoney;
          todayRecord.push(key);
        };
        //同一月
        if (util.dateIsDifference(key.date, todayDate, "n")) {
          monthMoney += key.spendMoney;
        };
        //同一月
        if (util.dateIsDifference(key.date, todayDate, "y")) {
          yearMoney += key.spendMoney;
        };
      }
      this.setData({
        todayExpend: todayMoney,
        monthExpend: monthMoney,
        yearExpend: yearMoney,
        todayRecord: todayRecord,
      });
    };

  },
  deleteBill: function (index) {
    let trueIndex = index.currentTarget.dataset.index
    var arr = this.data.allRecords
    arr.splice(trueIndex, 1)
    wx.setStorageSync('Bill', arr)
    this.getBill()
  },
  //获取信息
  getBill: function () {
    let bill;
    try {
      bill = wx.getStorageSync('Bill');
    } catch (e) {
    }
    if (bill != "") {
      this.setData({
        allRecords: bill
      })
    };
  },
  

  onShareAppMessage: function () {
    return {
      title: '账单',
      path: 'pages/bill/bill',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})
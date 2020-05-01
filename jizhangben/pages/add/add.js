var util = require('../utils/utils.js')

Page({

  data: {
    consumpPatternsList: [
      {
        icon: "../../images/food.png",
        name: "餐饮",
        isSelect: false,
        iconSel: "../../images/food_s.png"
      },
      {
        icon: "../../images/traffic.png",
        name: "交通",
        isSelect: false,
        iconSel: "../../images/traffic_s.png"
      },
      {
        icon: "../../images/shopping.png",
        name: "购物",
        isSelect: false,
        iconSel: "../../images/shopping_s.png",
      },
      {
        icon: "../../images/entertainment.png",
        name: "娱乐",
        isSelect: false,
        iconSel: "../../images/entertainment_s.png",
      },
      {
        icon: "../../images/education.png",
        name: "学习",
        isSelect: false,
        iconSel: "../../images/education_s.png",
      },
      {
        icon: "../../images/travel.png",
        name: "旅行",
        isSelect: false,
        iconSel: "../../images/travel_s.png",
      },
      {
        icon: "../../images/medication.png",
        name: "医疗",
        isSelect: false,
        iconSel: "../../images/medication_s.png",
      },
      {
        icon: "../../images/housing.png",
        name: "住房",
        isSelect: false,
        iconSel: "../../images/housing_s.png",
      },
    ],
    date: "",
    isShowCaculator: true,
    spendMoney: "0.00",
    remarksText: "",
    caculatorEnd: true,//计算完毕，重新开始
    todayDate: "",


  },

  showCaculator: function () {
    this.setData({
      isShowCaculator: true,
    });
  },

  onConsumptionItemClick: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.consumpPatternsList;

    for (var key of list) {
      key.isSelect = false;
    }
    list[index].isSelect = true;
    this.setData({
      consumpPatternsList: list,
      selectName: list[index].name,
      selectImg: list[index].iconSel,
    });
  },
  //选择时间
  onDateChange: function (e) {
    this.setData({
      date: e.detail.value,
    });
  },
  //显示计算器
  showCaculator: function () {
    this.setData({
      isShowCaculator: true,
    });
  },

  //备注输入框
  onInputRemarks: function (e) {
    var text = e.detail.value;
    this.setData({
      remarksText: text,
    });
    if (this.data.isShowCaculator) {
      hiddenCaculator();
    }
  },

  //完成记录
  confirmData: function () {


    //未计算结果
    if (!this.data.caculatorEnd) {
      this.caculatorResult();
    }
    if (parseFloat(this.data.spendMoney) == 0) {
      wx.showToast({
        title: '请输入花费金额',
        duration: 2000
      });
      return;
    }

    let value = [];

    try {
      value = wx.getStorageSync('Bill')
    } catch (e) {

    }

    if (value == "") {
      value = [];
    }

    let json =
    {
      date: this.data.date,
      spendMoney: this.data.spendMoney,
      remarks: this.data.remarksText,
      spendWay: this.data.selectName,
      spendWayImg: this.data.selectImg,
    }
      ;

    value.push(json);

    //根据date排序
    value.sort(function (a, b) {
      var nameA = a.date.toUpperCase(); // ignore upper and lowercase
      var nameB = b.date.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return 1;
      }
      if (nameA > nameB) {
        return -1;
      }
      // names must be equal
      return 0;
    });

    try {
      wx.setStorageSync('Bill', value)
    } catch (e) {
    }
    wx.showToast({
      title: '记账成功',
      icon: 'success',
      duration: 500,
      success: function () {
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 500)

      }
    });


  },


  ////////计算器相关
  touchNum: function (e) {

    var text = e.currentTarget.dataset.num;
    var num = "";
    if (text == "+") {
      this.setData({
        caculatorEnd: false,
      });
    }
    if (parseFloat(this.data.spendMoney) != 0) {
      num = this.data.spendMoney;
      if (this.data.caculatorEnd) {
        num = "";
      }
    }
    num = num + text;
    this.setData({
      spendMoney: num == 0 ? "0.00" : num,
      caculatorEnd: false,
    });
  },
  //删除一个字符
  touchClear: function () {

    if (parseFloat(this.data.spendMoney) != 0) {
      var text = this.data.spendMoney;
      text = text.substring(0, text.length - 1);

      this.setData({
        spendMoney: text == 0 ? "0.00" : text,
      });
    }
  },

  //计算结果
  touchResult: function () {
    this.caculatorResult();

  },


  caculatorResult: function () {
    if (parseFloat(this.data.spendMoney) != 0) {
      var result = this.data.spendMoney;
      var strResult = result.split("+");
      var sum = 0;
      strResult.forEach(function (num) {
        sum += parseFloat(num == "" ? 0 : num)
      });
      this.setData({
        spendMoney: sum == 0 ? "0.00" : sum,
        caculatorEnd: true,
      });
    }
  },


  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
    this.setData({
      date: util.formatTime(new Date(), "yyyy-MM-dd"),
      todayDate: util.formatTime(new Date(), "yyyy-MM-dd"),
    });
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})
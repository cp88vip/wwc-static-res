var groupName = function(name, methodName, before) {
  // console.log('----'+name+'----'+methodName+'----'+before);
  if (before == "定位胆") {
    if (methodName == "locationCourage") {
      return {name: name, methodName: methodName};
    } else {
      return {name: name, methodName: methodName};
    }
  } else if (before == "不定位") {
    //ArrangeThree
    if (methodName.indexOf("notLocationSelected") > -1) {
      var str = methodName.split("notLocationSelected")[1];
      // if (str.slice(0, 1) == 1) {  }
      return {name: name, methodName: methodName};
    } else if (methodName.indexOf("locationCourage") > -1) {
      return {name: name, methodName: methodName};
    } else {
      return {name: "不定位", methodName: "notLocation"};
    }
  } else if (before == "不定胆") {
    if (methodName.indexOf("after") > -1) {
      var str = methodName.split("after")[1];
      if (str.slice(0, 1) == 1) {
        return {name: "一星", methodName: "oneStar"};
      } else if (str.slice(0, 1) == 2) {
        return {name: "二星", methodName: "twoStar"};
      } else if (str.slice(0, 1) == 3) {
        return {name: "三星", methodName: "threeStar"};
      } else if (str.slice(0, 1) == 4) {
        return {name: "四星", methodName: "fourStar"};
      } else if (str.slice(0, 1) == 5) {
        return {name: "五星", methodName: "fiveStar"};
      }
    } else if (methodName.indexOf("before") > -1) {
      var str = methodName.split("before")[1];
      if (str.slice(0, 1) == 1) {
        return {name: "一星", methodName: "oneStar"};
      } else if (str.slice(0, 1) == 2) {
        return {name: "二星", methodName: "twoStar"};
      } else if (str.slice(0, 1) == 3) {
        return {name: "三星", methodName: "threeStar"};
      } else if (str.slice(0, 1) == 4) {
        return {name: "四星", methodName: "fourStar"};
      } else if (str.slice(0, 1) == 5) {
        return {name: "五星", methodName: "fiveStar"};
      }
    } else if (methodName.indexOf("notLocationSelected") > -1) {
      var str = methodName.split("notLocationSelected")[1];
      if (name.indexOf("码不定位") > -1) {
        return {name: "不定胆", methodName: "notLocation"};
      } else {
        return {name: "五星", methodName: "fiveStar"};
      }
    } else if (methodName.indexOf("fiveStarDirectly") > -1) {
      var str = methodName.split('fiveStarDirectly')[0];
      return {name: "五星", methodName: "fiveStar"};
    } else if (methodName.indexOf("fourStarDirectly") > -1) {
      var str = methodName.split('fourStarDirectly')[0];
      return {name: "四星", methodName: "fourStar"};
    }
  } else if (before.indexOf("单双") > -1) {
    return {name: "大小单双", methodName: "attribute"};
    //
  } else if (before.indexOf('三码') > -1) {
    // console.log(methodName+" method name");
    if (methodName.indexOf('before') > -1) {
      return {name: "前三", methodName: "beforeThree"};
    } else if (methodName.indexOf('middle') > -1) {
      return {name: "中三", methodName: "middleThree"};
    } else if (methodName.indexOf('after') > -1) {
      return {name: "后三", methodName: "afterThree"};
    } else {
      return {name: "三码", methodName: "maThree"};
    }
  } else if (before.indexOf('二码') > -1) {
    if (methodName.indexOf('before') > -1) {
      return {name: "前二", methodName: "beforeTwo"};
    } else if (methodName.indexOf('middle') > -1) {
      return {name: "中二", methodName: "middleTwo"};
    } else if (methodName.indexOf('after') > -1) {
      return {name: "后二", methodName: "afterTwo"};
    } else {
      return {name: "二码", methodName: "maTwo"};
    }
  } else if (before.indexOf("五星") > -1) {
    //
    if (methodName.indexOf("after") > -1) {
      var str = methodName.split("after")[1];
      if (str.slice(0, 1) == 1) {
        return {name: "一星", methodName: "oneStar"};
      } else if (str.slice(0, 1) == 2) {
        return {name: "二星", methodName: "twoStar"};
      } else if (str.slice(0, 1) == 3) {
        return {name: "三星", methodName: "threeStar"};
      } else if (str.slice(0, 1) == 4) {
        return {name: "四星", methodName: "fourStar"};
      } else if (str.slice(0, 1) == 5) {
        return {name: "五星", methodName: "fiveStar"};
      }
    } else if (methodName.indexOf("before") > -1) {
      var str = methodName.split("before")[1];
      if (str.slice(0, 1) == 1) {
        return {name: "一星", methodName: "oneStar"};
      } else if (str.slice(0, 1) == 2) {
        return {name: "二星", methodName: "twoStar"};
      } else if (str.slice(0, 1) == 3) {
        return {name: "三星", methodName: "threeStar"};
      } else if (str.slice(0, 1) == 4) {
        return {name: "四星", methodName: "fourStar"};
      } else if (str.slice(0, 1) == 5) {
        return {name: "五星", methodName: "fiveStar"};
      }
    } else if (methodName.indexOf("notLocationSelected") > -1) {
      var str = methodName.split("notLocationSelected")[1];
      return {name: "五星", methodName: "fiveStar"};
    } else if (methodName.indexOf("fiveStarDirectly") > -1) {
      var str = methodName.split('fiveStarDirectly')[0];
      return {name: "五星", methodName: "fiveStar"};
    } else if (methodName.indexOf("fourStarDirectly") > -1) {
      var str = methodName.split('fourStarDirectly')[0];
      return {name: "四星", methodName: "fourStar"};
    } else {
      return {name: "五星", methodName: "threeStar"};
    }
  } else if (before.indexOf("四星") > -1) {
    //
    if (methodName.indexOf("after") > -1) {
      var str = methodName.split("after")[1];
      if (str.slice(0, 1) == 1) {
        return {name: "一星", methodName: "oneStar"};
      } else if (str.slice(0, 1) == 2) {
        return {name: "二星", methodName: "twoStar"};
      } else if (str.slice(0, 1) == 3) {
        return {name: "三星", methodName: "threeStar"};
      } else if (str.slice(0, 1) == 4) {
        return {name: "四星", methodName: "fourStar"};
      } else if (str.slice(0, 1) == 5) {
        return {name: "五星", methodName: "fiveStar"};
      }
    } else if (methodName.indexOf("before") > -1) {
      var str = methodName.split("before")[1];
      if (str.slice(0, 1) == 1) {
        return {name: "一星", methodName: "oneStar"};
      } else if (str.slice(0, 1) == 2) {
        return {name: "二星", methodName: "twoStar"};
      } else if (str.slice(0, 1) == 3) {
        return {name: "三星", methodName: "threeStar"};
      } else if (str.slice(0, 1) == 4) {
        return {name: "四星", methodName: "fourStar"};
      } else if (str.slice(0, 1) == 5) {
        return {name: "五星", methodName: "fiveStar"};
      }
    } else if (methodName.indexOf("notLocationSelected") > -1) {
      var str = methodName.split("notLocationSelected")[1];
      return {name: "五星", methodName: "fiveStar"};
    } else if (methodName.indexOf("fiveStarDirectly") > -1) {
      var str = methodName.split('fiveStarDirectly')[0];
      return {name: "五星", methodName: "fiveStar"};
    } else if (methodName.indexOf("fourStarDirectly") > -1) {
      var str = methodName.split('fourStarDirectly')[0];
      return {name: "四星", methodName: "fourStar"};
    } else {
      return {name: "四星", methodName: "threeStar"};
    }
  } else if (before.indexOf("三星") > -1) {//三星玩法
    //
    if (name.indexOf('前三') > -1) {
      return {name: "前三", methodName: "beforeThree"};
    } else if (name.indexOf('中三') > -1) {
      return {name: "中三", methodName: "middleThree"};
    } else if (name.indexOf('后三') > -1) {
      return {name: "后三", methodName: "afterThree"};
    } else {

      if (methodName.indexOf("after") > -1) {
        var str = methodName.split("after")[1];
        var hasDirectly = (methodName.indexOf("directly") > -1);
        if (str.slice(0, 1) == 1) {
          return {name: "一星", methodName: "oneStar"};
        } else if (str.slice(0, 1) == 2) {
          return {name: "二星", methodName: "twoStar"};
        } else if (str.slice(0, 1) == 3) {
          return {name: "三星", methodName: "threeStar"};
        } else if (str.slice(0, 1) == 4) {
          return {name: "四星", methodName: "fourStar"};
        } else if (str.slice(0, 1) == 5) {
          return {name: "五星", methodName: "fiveStar"};
        }
      } else if (methodName.indexOf("before") > -1) {
        var str = methodName.split("before")[1];
        var hasDirectly = (methodName.indexOf("directly") > -1);
        if (str.slice(0, 1) == 1) {
          return {name: "一星", methodName: "oneStar"};
        } else if (str.slice(0, 1) == 2) {
          return {name: "二星", methodName: "twoStar"};
        } else if (str.slice(0, 1) == 3) {
          return {name: "三星", methodName: "threeStar"};
        } else if (str.slice(0, 1) == 4) {
          return {name: "四星", methodName: "fourStar"};
        } else if (str.slice(0, 1) == 5) {
          return {name: "五星", methodName: "fiveStar"};
        }
      } else if (methodName.indexOf("notLocationSelected") > -1) {
        var str = methodName.split("notLocationSelected")[1];
        return {name: "五星", methodName: "fiveStar"};
      } else if (methodName.indexOf("fiveStarDirectly") > -1) {
        var str = methodName.split('fiveStarDirectly')[0];
        return {name: "五星", methodName: "fiveStar"};
      } else if (methodName.indexOf("fourStarDirectly") > -1) {
        var str = methodName.split('fourStarDirectly')[0];
        return {name: "四星", methodName: "fourStar"};
      } else {
        return {name: "三星", methodName: "threeStar"};
      }

    }

  } else if (before.indexOf("二星") > -1) {
    //
    if (name.indexOf('前二') > -1) {
      return {name: "前二", methodName: "beforeTwo"};
    } else if (name.indexOf('后二') > -1) {
      return {name: "后二", methodName: "afterTwo"};
    } else if (methodName.indexOf("after") > -1) {
      var str = methodName.split("after")[1];
      var hasDirectly = (methodName.indexOf("directly") > -1);
      if (str.slice(0, 1) == 1) {
        return {name: "一星", methodName: "oneStar"};
      } else if (str.slice(0, 1) == 2) {
        return {name: "二星", methodName: "twoStar"};
      } else if (str.slice(0, 1) == 3) {
        return {name: "三星", methodName: "threeStar"};
      } else if (str.slice(0, 1) == 4) {
        return {name: "四星", methodName: "fourStar"};
      } else if (str.slice(0, 1) == 5) {
        return {name: "五星", methodName: "fiveStar"};
      }
    } else if (methodName.indexOf("before") > -1) {
      var str = methodName.split("before")[1];
      var hasDirectly = (methodName.indexOf("directly") > -1);
      if (str.slice(0, 1) == 1) {
        return {name: "一星", methodName: "oneStar"};
      } else if (str.slice(0, 1) == 2) {
        return {name: "二星", methodName: "twoStar"};
      } else if (str.slice(0, 1) == 3) {
        return {name: "三星", methodName: "threeStar"};
      } else if (str.slice(0, 1) == 4) {
        return {name: "四星", methodName: "fourStar"};
      } else if (str.slice(0, 1) == 5) {
        return {name: "五星", methodName: "fiveStar"};
      }
    } else if (methodName.indexOf("notLocationSelected") > -1) {
      var str = methodName.split("notLocationSelected")[1];
      return {name: "五星", methodName: "fiveStar"};
    } else if (methodName.indexOf("fiveStarDirectly") > -1) {
      var str = methodName.split('fiveStarDirectly')[0];
      return {name: "五星", methodName: "fiveStar"};
    } else if (methodName.indexOf("fourStarDirectly") > -1) {
      var str = methodName.split('fourStarDirectly')[0];
      return {name: "四星", methodName: "fourStar"};
    } else {
      return {name: "二星", methodName: "twoStar"};
    }
  } else if (before.indexOf("一星") > -1) {
    //
    if (methodName.indexOf("after") > -1) {
      var str = methodName.split("after")[1];
      if (str.slice(0, 1) == 1) {
        return {name: "一星", methodName: "oneStar"};
      } else if (str.slice(0, 1) == 2) {
        return {name: "二星", methodName: "twoStar"};
      } else if (str.slice(0, 1) == 3) {
        return {name: "三星", methodName: "threeStar"};
      } else if (str.slice(0, 1) == 4) {
        return {name: "四星", methodName: "fourStar"};
      } else if (str.slice(0, 1) == 5) {
        return {name: "五星", methodName: "fiveStar"};
      }
    } else if (methodName.indexOf("before") > -1) {
      var str = methodName.split("before")[1];
      if (str.slice(0, 1) == 1) {
        return {name: "一星", methodName: "oneStar"};
      } else if (str.slice(0, 1) == 2) {
        return {name: "二星", methodName: "twoStar"};
      } else if (str.slice(0, 1) == 3) {
        return {name: "三星", methodName: "threeStar"};
      } else if (str.slice(0, 1) == 4) {
        return {name: "四星", methodName: "fourStar"};
      } else if (str.slice(0, 1) == 5) {
        return {name: "五星", methodName: "fiveStar"};
      }
    } else if (methodName.indexOf("notLocationSelected") > -1) {
      var str = methodName.split("notLocationSelected")[1];
      return {name: "五星", methodName: "fiveStar"};
    } else if (methodName.indexOf("fiveStarDirectly") > -1) {
      var str = methodName.split('fiveStarDirectly')[0];
      return {name: "五星", methodName: "fiveStar"};
    } else if (methodName.indexOf("fourStarDirectly") > -1) {
      var str = methodName.split('fourStarDirectly')[0];
      return {name: "四星", methodName: "fourStar"};
    }
  } else if (before.indexOf("前三") > -1) {
    return {name: "前三", methodName: "beforeThree"};
  } else if (before.indexOf("前二") > -1) {
    return {name: "前二", methodName: "beforeTwo"};
  } else if (before.indexOf("后二") > -1) {
    return {name: "后二", methodName: "afterTwo"};
  } else if (before.indexOf("后三") > -1) {
    return {name: "后三", methodName: "afterThree"};
  } else if (before.indexOf("前一") > -1) {
    return {name: "前一", methodName: "beforeOne"};
  } else if (before.indexOf("后一") > -1) {
    return {name: "后一", methodName: "afterOne"};
  } else if (before.indexOf("任选") > -1) {
    if (before.indexOf("胆拖") > -1) {
      return {name: "任选胆拖", methodName: "renxuanDuplex"};
    } else {
      return {name: "任选", methodName: "renxuan"};
    }
  } else {
    return {name: before, methodName: before};
  }

}

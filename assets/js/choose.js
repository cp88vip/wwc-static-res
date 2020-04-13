function combination(arr, size) {
	var allResult = [];
	(function(arr, size, result) {
		var arrLen = arr.length;
		if (size > arrLen) {
			return;
		}
		if (size == arrLen) {
			allResult.push([].concat(result, arr))
		} else {
			for (var i = 0; i < arrLen; i++) {
				var newResult = [].concat(result);
				newResult.push(arr[i]);

				if (size == 1) {
					allResult.push(newResult);
				} else {
					var newArr = [].concat(arr);
					newArr.splice(0, i + 1);
					arguments.callee(newArr, size - 1, newResult);
				}
			}
		}
	})(arr, size, []);
	return allResult;
}
function permutate(doubleArrays) {
	var len = doubleArrays.length;
	if (len >= 2) {
		var len1 = doubleArrays[0].length;
		var len2 = doubleArrays[1].length;
		var newlen = len1 * len2;
		var temp = new Array(newlen);
		var index = 0;
		for (var i = 0; i < len1; i++) {
			for (var j = 0; j < len2; j++) {
				temp[index] = doubleArrays[0][i] + doubleArrays[1][j];
				index++;
			}
		}
		var newArray = new Array(len - 1);
		for (var i = 2; i < len; i++) {
			newArray[i - 1] = doubleArrays[i];
		}
		newArray[0] = temp;
		return permutate(newArray);
	} else {
		return doubleArrays[0];
	}
}

function CalculatorFactory() {
}
CalculatorFactory.getCalculator = function(className) {
	if (className.indexOf("FrequentLottery") > -1) { // 时时彩
		return new FrequentLotteryCalculator();
	} else if (className.indexOf("ElevenPickFive") > -1) {// 11选5
		return new ElevenPickFiveCalculator();
	} else if (className.indexOf("PK10") > -1) {// PK10
		return new PK10Calculator();
	} else if (className == 'ThreeD' || className == 'ArrangeThree'
			|| className == 'ShanghaiFrequentHappy') {// 3d 排列三 上海时时乐
		return new ThreeNumbersCalculator(methodName, arr);
	} else if (className == 'PCEggs' || className == 'Luck28') {// PC蛋蛋系列
		return new PCEggsCalculator(methodName, arr);
	} else if (className.indexOf('SixMark') > -1) {// 6合系列
		return new SixMarkCalculator(methodName, arr);
	} else if (className.indexOf('QuickThree') > -1) {// 快3系列
		return new QuickThreeCalculator(methodName, arr);
	} else {
		throw new Error("ClassName Error");
	}
}

/*
 * interface Calculator{ function calculate(methodName, selectedArray); }
 */
function FrequentLotteryCalculator() {
	// 接口方法
	this.calculate = function(methodName, selectedArray) {
		return eval("this." + methodName + '(selectedArray)');
	}
	// 定位胆
	this.locationCourage = function(sa) {
		var count = 0;
		for(var i=0; i<sa.length; i++) {
			for(var y=0; y<sa[i].length; y++) {
				count++;
			}
		}
		return count;
	}
	// 2星直选
	this.before2directly = this.after2directly = function(sa) {
		return permutate(sa).length;
	}
	// 2星直选和值
	this.before2directlySum = this.after2directlySum = function(sa) {
		var counts = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 ];
		var count = 0;
		for(var i=0; i<sa.length; i++) {
			count += counts[sa[i]];
		}
		return count;
	}
	// 2星组选和值
	this.before2combinationSum = this.after2combinationSum = function(sa) {
		counts = [ 1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1 ];
		var count = 0;
		for(var i=0; i<sa.length; i++) {
			count += counts[sa[i]-1];
		}
		return count;
	}
	// 2星跨度
	this.before2span = this.after2span = function(sa) {
		var counts = [10, 18, 16, 14, 12, 10, 8, 6, 4, 2];
		var count = 0;
		for(var i=0; i<sa.length; i++) {
			count += counts[sa[i]];
		}
		return count;
	}
	// 2星组选包胆
	this.before2combinationCourage = this.after2combinationCourage = function(
			sa) {
		return sa.length * 9;
	}
	// 2星属性
	this.before2attribute = this.after2attribute = function(sa) {
		return permutate(sa).length;
	}
	// 不定位 3中1
	this.before3selected1 = this.after3selected1 = function(sa) {
		return sa.length;
	}
	// 3 in 2
	this.before3selected2 = this.after3selected2 = function(sa) {
		return combination(sa, 2).length;
	}
	// 3星直选
	this.before3directly = this.after3directly = function(sa) {
		return permutate(sa).length;
	}
	// 3星直选和值
	this.before3directlySum = this.after3directlySum = function(sa) {
		var counts = [ 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1 ];
		var count = 0;
		for(var i=0; i<sa.length; i++) {
			count += counts[sa[i]];
		}
		return count;
	}
	// 3星组选和值
	this.before3combinationSum = this.after3combinationSum = function(sa) {
		var counts = [ 1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15, 15, 14, 14, 13, 11, 10, 8, 6, 5, 4, 2, 2, 1 ];
		var count = 0;
		for(var i=0; i<sa.length; i++) {
			count += counts[sa[i]-1];
		}
		return count;
	}
	// 3星和值尾数
	this.before3sumMantissa = this.after3sumMantissa = function(sa) {
		return sa.length;
	}
	// 3星跨度
	this.before3span = this.after3span = function(sa) {
		var counts = [ 10, 54, 96, 126, 144, 150, 144, 126, 96, 54 ];
		var count = 0;
		for(var i=0; i<sa.length; i++) {
			count += counts[sa[i]];
		}
		return count;
	}
	// 3星组3
	this.before3combination3 = this.after3combination3 = function(sa) {
		return combination(sa, 2).length * 2;
	}
	// 3星组6
	this.before3combination6 = this.after3combination6 = function(sa) {
		return combination(sa, 3).length;
	}
	// 3星特殊
	this.before3special = this.after3special = function(sa) {
		return sa.length;
	}
	// 3星属性
	this.before3attribute = this.after3attribute = function(sa) {
		return permutate(sa).length;
	}
	// 4星不定位 1码
	this.before4selected1 = this.after4selected1 = function(sa) {
		return sa.length;
	}
	// 4星不定位 2码
	this.before4selected2 = this.after4selected2 = function(sa) {
		return combination(sa, 2).length;
	}
	// 5星不定位 1码
	this.notLocationSelected1 = function(sa) {
		return sa.length;
	}
	// 5星不定位 2码
	this.notLocationSelected2 = function(sa) {
		return combination(sa, 2).length;
	}
	// 5星不定位 3码
	this.notLocationSelected3 = function(sa) {
		return combination(sa, 3).length;
	}
	// 5星直选
	this.fiveStarDirectly = function(sa) {
		return permutate(sa).length;
	}
	// 4星直选
	this.fourStarDirectly = function(sa) {
		return permutate(sa).length;
	}
}

/*
 * interface Calculator{ function calculate(methodName, selectedArray); }
 */
function ElevenPickFiveCalculator() {
	// 接口方法
	this.calculate = function(methodName, selectedArray) {
		return eval("this." + methodName + '(selectedArray)');
	}
	
	/**
	 * 任选胆拖 - 任选二中二
	 * @param selectedNumbers
	 * @return
	 */
	this.duplex_in_ = function(sa, count) {
		var courageNumber = sa[0];
		var pullNumbers = sa[1];
		if(courageNumber.length == (count-1)) return pullNumbers.length;
		return combination(pullNumbers, count-courageNumber.length).length;
	}
	this.duplex2in2 = function(sa) {
		return sa[1].length;
	}
	this.duplex3in3 = function(sa) {
		var courageNumber = sa[0];
		var pullNumbers = sa[1];
		if(courageNumber.length == 2) return pullNumbers.length;
		return combination(pullNumbers, 2).length;
	}
	this.duplex4in4 = function(sa) {
		return this.duplex_in_(sa, 4);
	}
	this.duplex5in5 = function(sa) {
		return this.duplex_in_(sa, 5);
	}
	this.duplex6in5 = function(sa) {
		return this.duplex_in_(sa, 6);
	}
	this.duplex7in5 = function(sa) {
		return this.duplex_in_(sa, 7);
	}
	this.duplex8in5 = function(sa) {
		return this.duplex_in_(sa, 8);
	}
	/**
	 * 任选二中二
	 * @param selectedNumbers
	 * @return
	 */
	this.optional2in2 = function(sa) {
		return combination(sa, 2).length;
	}
	this.optional3in3 = function(sa) {
		return combination(sa, 3).length;
	}
	this.optional4in4 = function(sa) {
		return combination(sa, 4).length;
	}
	this.optional5in5 = function(sa) {
		return combination(sa, 5).length;
	}
	this.optional6in5 = function(sa) {
		return combination(sa, 6).length;
	}
	this.optional7in5 = function(sa) {
		return combination(sa, 7).length;
	}
	this.optional8in5 = function(sa) {
		return combination(sa, 8).length;
	}
	this.locationCourage = function(sa) {
		var count = 0;
		for(var i=0; i<sa.length; i++) {
			for(var y=0; y<sa[i].length; y++) {
				count++;
			}
		}
		return count;
	}
	/*二星直选*/
	this.before2directly = this.after2directly = function(sa) {
		return permutate(sa).length;
	}
	/*二星组选*/
	this.before2combination = this.after2combination = function(sa) {
		return combination(sa, 2).length;
	}
	/*二星胆拖*/
	this.before2duplex = this.after2duplex = function(sa) {
		return sa[1].length;
	}
	/*三星直选*/
	this.before3directly = this.after3directly = function(sa) {
		return permutate(sa).length;
	}
	/*三星组选*/
	this.before3combination = this.after3combination = function(sa) {
		return combination(sa, 3).length;
	}
}





// demo
//var calculator = CalculatorFactory.getCalculator("xxxxxxxFrequentLottery");
//console.log(calculator.calculate('after3span', [ 1, 2, 3, 4, 5, 6, 7]))
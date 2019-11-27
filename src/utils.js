
var utils = {
    isNumber(num){
        var regPos = /^\d+$/; // 非负整数
        var regNeg = /^\-[1-9][0-9]*$/; // 负整数
        if(regPos.test(num) || regNeg.test(num)){
            return true;
        }else{
            return false;
        }
    },

    // [min, max]
    getRandomNum(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min)
    }
}

module.exports = utils
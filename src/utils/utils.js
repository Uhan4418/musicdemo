
/**
 * [setCookie 设置 cookie]
 * @DateTime 2019-02-28T10:58:07+0800
 * @author Uhan
 * @param    {[type]}                 c_name   [变量名，必选]
 * @param    {[type]}                 value  [变量值，必选]
 * @param    {[type]}                 expiredays [过期日期，可选]
 */
export function setCookie (c_name, value, expiredays) {
  if(c_name && value) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
  }
};

/**
 * [getCookie 获取 cookie]
 * @author Uhan
 * @DateTime 2019-02-28T10:58:12+0800
 * @param    {[type]}                 cname [变量名，必选]
 * @return   {[type]}                 [返回值：变量值（字符串）]
 */
export function getCookie(cname) {
  var arr, reg = new RegExp("(^| )" + cname + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
   return (arr[2]);
  else
   return cname;
}
  
/**
 * [checkCookie 查询 cookie]
 * @author Uhan
 * @DateTime 2019-02-28T10:58:16+0800
 * @return   {[type]}       [如果有cookie就显示欢迎界面，没有cookie就设置当前用户的信息]
 */
 export function checkCookie() {
  let username = getCookie("username");
  if (username != "") {
    alert("Welcome again " + username);
  }
  else {
    username = prompt("Please enter your name:","");
    if (username != "" && username != null) {
      setCookie("username", username, 365);
    }
  }
}
  
 //删除cookie
 export function delCookie (name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
   document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
 };


/**
 * Cookie 工具类
 * 用于提取和管理 Cookie 中的信息，特别是工号
 */

// 获取指定名称的 cookie 值
const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // 检查这个 cookie 是否以 name= 开头
    if (cookie.indexOf(name + '=') === 0) {
      // 返回 cookie 的值部分
      return cookie.substring(name.length + 1);
    }
  }

  return null;
};

// 设置 cookie
const setCookie = (name, value, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

// 删除 cookie
const removeCookie = (name) => {
  setCookie(name, '', -1);
};

// 获取工号
const getUserName = () => {
  // 从 cookie 中获取 user_name
  return getCookie('user_name');
};

export {
  getCookie,
  setCookie,
  removeCookie,
  getUserName
};
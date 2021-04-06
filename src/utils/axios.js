// axios拦截器  使用可参阅npm官方文档
import axios from 'axios'

// 请求拦截器 发起请求前对请求参数做拦截处理
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers = {
    // 'Content-Type':'application/x-www-form-urlencoded', //设置跨域头部
    'X-XSRF-TOKEN': 'BavEFqmI-0nenzIMY2aClsbR8sVwQgqBY1Ho'
  };
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// 响应拦截器 接收到数据的时候对数据进行处理
axios.interceptors.response.use(function (response) {
  console.log('响应拦截器时处理后的数据：')
  return response.data;
}, function (error) {

  return Promise.reject(error);
});

export default axios
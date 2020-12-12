import axios from 'axios'
import vuex from './vuexx.js'


const instance = axios.create({
    // baseURL: uri,
    timeout: 10000
});



instance.interceptors.request.use(function (config) {
    let token = vuex.state.token;
    config.headers.authorization = token;
    return config;
  }, function (error) {
    return Promise.reject(error);
  });


instance.interceptors.response.use(function (response) {
  console.log(response);
    return response.data;
  }, function (error) {
    // 对响应错误做点什么
    console.log(error)
    return Promise.reject(error);
  });

export default instance;

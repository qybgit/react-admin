import axios from 'axios'
import { Navigate } from 'react-router-dom'

const http = axios.create(
  {
    baseURL: 'http://localhost:8082',
    timeout: 5000
  }
)
//请求
http.interceptors.request.use(
  (config) => {
    // const tokenE = localStorage.getItem("blog-admin-key")
    // if (tokenE) {
    //   const { token } = JSON.parse(tokenE)
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    config.headers.Authorization = `Bearer eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjE0MDQ0NDg1ODgxNDYxOTI0MTIsImV4cCI6MTY4MjIyNjIzMX0.2VL2vaohwdlSuyh3A39nBrt0KzswV1NXle8R68arHoM`
    return config
  }, (error) => {
    return Promise.reject(error)
  }
)
// 添加响应拦截器
http.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

export { http }
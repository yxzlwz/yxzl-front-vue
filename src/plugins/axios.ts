import axios from 'axios';
import naiveui from './naiveui';
import router from '../router';

export const Axios = axios.create({
  baseURL: import.meta.env.PROD ? 'https://api.yixiangzhilv.com' : '/api',
  withCredentials: true,
});

Axios.defaults.transformResponse = [
  (data, headers) => {
    if (
      typeof data === 'string' &&
      headers['content-type'] === 'application/json'
    ) {
      try {
        data = JSON.parse(data);
      } catch (e) {}
    }
    return data;
  },
];

export const errorHandler = (err: any) => {
  let message = '未知错误';
  console.log(err);
  if (err.response?.data?.detail) message = err.response.data.detail;
  else if (!err.response?.status) message = '网络异常，请检查网络连接';
  naiveui.message.error(message);

  if (err.response?.data?.action)
    router.push({ name: err.response.data.action });
};

export default Axios;

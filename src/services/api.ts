import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bvspapp-ab6d1.uc.r.appspot.com/',
});

export default api;

import Axios from 'axios';
import { config } from '../../config';

const axios = Axios.create({
  baseURL: config.endpoints,
});

export default axios;

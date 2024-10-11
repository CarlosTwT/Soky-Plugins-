import axios from 'axios';

export const getBuffer = async (url, ...options) => {
  const { data } = await axios.get(url, {
    headers: {
      "DNT": 1, 
      "Upgrade-Insecure-Request": 1 
    },
    ...options,
    responseType: "arraybuffer"
  });
  return data;
};
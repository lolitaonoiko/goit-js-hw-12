import axios from 'axios';

export const requestFetch = async (inputValueRequest, page, perPage) => {
  const params = new URLSearchParams({
    per_page: perPage,
    page,
    safesearch: 'true',
    image_type: 'photo',
    orientation: 'horizontal',
    key: '45720835-cd950b20c56733b9244c71a24',
    q: inputValueRequest,
  });
  const response = await axios.get(`https://pixabay.com/api/?${params}`);

  return response.data;
};

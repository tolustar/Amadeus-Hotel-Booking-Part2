import axios from 'axios';
import QueryString from 'qs';

const BASE_URL = 'https://test.api.amadeus.com';
const getAccessToken = async () => {
  const {data} = await axios({
    method: 'post',
    url: `${BASE_URL}/v1/security/oauth2/token`,
    data: QueryString.stringify({
      grant_type: 'client_credentials',
      client_id: 'ydeZNS0vRSf1td0e5dMPhCZPgDmkJxKI',
      client_secret: 'cooGt5qvmNbldCiU',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return data.access_token;
};

export const fetchDestination = async searchItem => {
  const ACCESS_TOKEN = await getAccessToken();
  const {data} = await axios({
    method: 'get',
    url: `${BASE_URL}/v1/reference-data/locations`,
    params: {
      subType: 'AIRPORT,CITY',
      keyword: searchItem,
      'page[limit]': 20,
      'page[offset]': 0,
    },
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  return data.data;
};

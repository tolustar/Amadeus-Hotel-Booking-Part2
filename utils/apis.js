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

export const fetchHotel = async hotelCode => {
  const ACCESS_TOKEN = await getAccessToken();
  const {data} = await axios({
    method: 'get',
    url: `${BASE_URL}/v2/shopping/hotel-offers`,
    params: {
      cityCode: hotelCode,
    },
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  return data.data;
};

export const postBookingDetails = async bookingDetails => {
  const {
    firstNameVal,
    lastNameVal,
    phoneNumberVal,
    emailVal,
    cardNumberVal,
    expiryDateVal,
    offerId,
  } = bookingDetails;
  const ACCESS_TOKEN = await getAccessToken();
  const {data} = await axios({
    method: 'post',
    url: `${BASE_URL}/v1/booking/hotel-bookings`,
    data: {
      data: {
        offerId,
        guests: [
          {
            name: {
              firstName: firstNameVal,
              lastName: lastNameVal,
            },
            contact: {
              phone: phoneNumberVal,
              email: emailVal,
            },
          },
        ],
        payments: [
          {
            method: 'creditCard',
            card: {
              vendorCode: 'VI',
              cardNumber: cardNumberVal,
              expiryDate: expiryDateVal,
            },
          },
        ],
      },
    },
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/vnd.amadeus+json',
    },
  });
  return data.data;
};

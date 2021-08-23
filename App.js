import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  ScrollView,
  Alert,
} from 'react-native';

import {styles} from './utils/styles';
import {fetchDestination, fetchHotel, postBookingDetails} from './utils/apis';
import {DestinationField, HotelView, BookHotel} from './utils/components';

const App = () => {
  const [destinationSearchItem, setDestinationSearchItem] = useState('');
  const [destinationList, setDestinationList] = useState([]);
  const [destinationLoading, setDestinationLoading] = useState(false);

  const [hotelList, setHotelList] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(false);

  const [typingId, setTypingId] = useState(null);

  const [bookingDetails, setBookingDetails] = useState({
    firstNameVal: '',
    lastNameVal: '',
    phoneNumberVal: '',
    emailVal: '',
    cardNumberVal: '',
    expiryDateVal: '',
    offerId: '',
  });

  const [submittingBooking, setSubmittingBooking] = useState(false);

  const [bookingModalVisible, setBookingModalVisible] = useState(false);

  const updatebookingFields = (key, val) => {
    switch (key) {
      case 'firstName':
        setBookingDetails({
          ...bookingDetails,
          firstNameVal: val,
        });
        break;

      case 'lastName':
        setBookingDetails({
          ...bookingDetails,
          lastNameVal: val,
        });
        break;

      case 'phoneNumber':
        setBookingDetails({
          ...bookingDetails,
          phoneNumberVal: val,
        });
        break;

      case 'email':
        setBookingDetails({
          ...bookingDetails,
          emailVal: val,
        });
        break;

      case 'cardNumber':
        setBookingDetails({
          ...bookingDetails,
          cardNumberVal: val,
        });
        break;

      case 'expiryDate':
        setBookingDetails({
          ...bookingDetails,
          expiryDateVal: val,
        });
        break;

      default:
        break;
    }
  };

  const showBookingModal = offerId => {
    setBookingModalVisible(true);
    setBookingDetails({
      ...bookingDetails,
      offerId,
    });
  };

  const submitBookingDetails = async () => {
    try {
      setSubmittingBooking(true);
      await postBookingDetails(bookingDetails);
      Alert.alert('Room booked successfully');
      setSubmittingBooking(false);
      setBookingModalVisible(false);
    } catch (error) {
      Alert.alert('An error occured');
      setSubmittingBooking(false);
      console.log('error', error.response.data);
    }
  };

  const autoCompleteDestinationField = (destination, code) => {
    setDestinationSearchItem(destination);
    setDestinationList([]);
    searchHotel(code);
  };

  const searchDestination = text => {
    setDestinationSearchItem(text);

    const destinationData = async () => {
      try {
        setDestinationLoading(true);
        const result = await fetchDestination(text);
        setDestinationLoading(false);
        setDestinationList(result);
      } catch (error) {
        setDestinationList([]);

        console.log('error', error.response.data);
        setDestinationLoading(false);
      }
    };

    clearTimeout(typingId);
    const timeoutId = setTimeout(destinationData, 800);
    setTypingId(timeoutId);
  };

  const searchHotel = text => {
    const hotelData = async () => {
      try {
        setHotelLoading(true);
        const result = await fetchHotel(text);
        setHotelLoading(false);
        setHotelList(result);
      } catch (error) {
        setHotelList([]);

        console.log('error', error.response.data);
        setHotelLoading(false);
      }
    };

    clearTimeout(typingId);
    const timeoutId = setTimeout(hotelData, 800);
    setTypingId(timeoutId);
  };

  return (
    <SafeAreaView>
      <View style={[styles.screenContainer]}>
        <StatusBar barStyle={'dark-content'} />

        {bookingModalVisible && (
          <BookHotel
            bookingDetails={bookingDetails}
            onChange={updatebookingFields}
            visibility={bookingModalVisible}
            changeVisibility={setBookingModalVisible}
            submitBookingDetails={submitBookingDetails}
            submitting={submittingBooking}
          />
        )}

        <ScrollView>
          <View style={styles.backgroundContainer}>
            <Text style={[styles.header]}>Amadeus Hotel Booking</Text>
            <DestinationField
              onChange={searchDestination}
              value={destinationSearchItem}
              autoComplete={autoCompleteDestinationField}
              destinationList={destinationList}
              loading={destinationLoading}
            />

            <HotelView
              hotelList={hotelList}
              loading={hotelLoading}
              location={destinationSearchItem}
              showBookingModal={showBookingModal}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default App;

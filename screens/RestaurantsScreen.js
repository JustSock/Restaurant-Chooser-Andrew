import React from 'react';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import {
  Alert,
  BackHandler,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { createStackNavigator } from '@react-navigation/stack';
import { GluestackUIProvider } from '@gluestack-ui/themed';

const Stack = createStackNavigator();

/**
 *
 #############################################################################
 * Styles.
 *
 #############################################################################
 */
const styles = StyleSheet.create({
  listScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
      android: {},
    }),
  },
  restaurantList: {
    width: '94%',
  },
  restaurantContainer: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
    borderColor: '#e0e0e0',
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  restaurantName: {
    flex: 1,
  },
  addScreenContainer: {
    marginTop: 20,
  },
  addScreenInnerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    width: '100%',
  },
  addScreenFormContainer: {
    width: '96%',
  },
  fieldLabel: {
    marginLeft: 10,
  },
  pickerContainer: {
    ...Platform.select({
      ios: {},
      android: {
        width: '96%',
        borderRadius: 8,
        borderColor: '#c0c0c0',
        borderWidth: 2,
        marginLeft: 10,
        marginBottom: 20,
        marginTop: 4,
      },
    }),
  },
  picker: {
    ...Platform.select({
      ios: {
        width: '96%',
        borderRadius: 8,
        borderColor: '#c0c0c0',
        borderWidth: 2,
        marginLeft: 10,
        marginBottom: 20,
        marginTop: 4,
      },
      android: {},
    }),
  },
  addScreenButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
/**
 *
 #############################################################################
 * List screen.
 *
 #############################################################################
 */
class ListScreen extends React.Component {
  /**
   * Constructor.
   */
  constructor(inProps) {
    super(inProps);
    this.state = {
      listData: [],
    };
  } /* End constructor. */

  /**
   * Render this component.
   */


  /**
   * Execute after the component mounts.
   */
  componentDidMount() {
    //Block hardware back button on Android.
    BackHandler.addEventListener('hardwareBackPress', () => true);

    //Get list of restaurants
    this.loadRestaurants();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  loadRestaurants = async () => {
    try {
      const restaurants = await AsyncStorage.getItem('restaurants');
      const listData = restaurants ? JSON.parse(restaurants) : [];
      this.setState({ listData });
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    }
  };

  deleteRestaurant = async (item) => {
    try {
      const restaurants = await AsyncStorage.getItem('restaurants');
      let listData = restaurants ? JSON.parse(restaurants) : [];
      listData = listData.filter((restaurant) => restaurant.key !== item.key);
      await AsyncStorage.setItem('restaurants', JSON.stringify(listData));
      this.setState({ listData });

      Toast.show({
        type: 'error', // or 'success', 'info', etc.
        position: 'bottom',
        text1: 'Restaurant deleted',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Failed to delete restaurant:', error);
    }
  };

  render() {
    return (
      <GluestackUIProvider>
        <View style={styles.listScreenContainer}>
          <CustomButton
            text="Add Restaurant"
            width="94%"
            onPress={() => this.props.navigation.navigate('AddScreen')}
          />
          <FlatList
            style={styles.restaurantList}
            data={this.state.listData}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <View style={styles.restaurantContainer}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <CustomButton
                  text="Delete"
                  disabled={false}
                  onPress={() =>{
                    console.log("bruh")
                    Alert.alert(
                      'Please confirm',
                      'Are you sure you want to delete this restaurant?',
                      [
                        {
                          text: 'Yes',
                          onPress: () => this.deleteRestaurant(item),
                        },
                        { text: 'No' },
                        { text: 'Cancel', style: 'cancel' },
                      ],
                      { cancelable: true }
                    )
                  }
                  }
                />
              </View>
            )}
          />
        </View>
      </GluestackUIProvider>
    );
  }
} /* End ListScreen. */

/**
 *
 #############################################################################
 * Add screen.
 *
 #############################################################################
 */
class AddScreen extends React.Component {
  /**
   * Constructor.
   */
  constructor(inProps) {
    super(inProps);
    this.state = {
      name: '',
      cuisine: '',
      price: '',
      rating: '',
      phone: '',
      address: '',
      webSite: '',
      delivery: '',
      key: `r_${new Date().getTime()}`,
    };
  } /* End constructor. */

  /**
   * Render this component.
   */
  render() {
    return (
      <ScrollView style={styles.addScreenContainer}>
        <View style={styles.addScreenInnerContainer}>
          <View style={styles.addScreenFormContainer}>
            {/* ########## Name ########## */}
            <CustomTextInput
              label="Name"
              maxLength={20}
              stateHolder={this}
              stateFieldName="name"
            />
            {/* ########## Cuisine ########## */}
            <Text style={styles.fieldLabel}>Cuisine</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                prompt="Cuisine"
                selectedValue={this.state.cuisine}
                onValueChange={(inItemValue) =>
                  this.setState({ cuisine: inItemValue })
                }>
                <Picker.Item label="" value="" />
                <Picker.Item label="Algerian" value="Algerian" />
                <Picker.Item label="American" value="American" />
                <Picker.Item label="BBQ" value="BBQ" />
                <Picker.Item label="Belgian" value="Belgian" />
                <Picker.Item label="Brazilian" value="Brazilian" />
                <Picker.Item label="British" value="British" />
                <Picker.Item label="Cajun" value="Cajun" />
                <Picker.Item label="Canadian" value="Canadian" />
                <Picker.Item label="Chinese" value="Chinese" />
                <Picker.Item label="Cuban" value="Cuban" />
                <Picker.Item label="Egyptian" value="Egyptian" />
                <Picker.Item label="Filipino" value="Filipino" />
                <Picker.Item label="French" value="French" />
                <Picker.Item label="German" value="German" />
                <Picker.Item label="Greek" value="Greek" />
                <Picker.Item label="Haitian" value="Haitian" />
                <Picker.Item label="Hawaiian" value="Hawaiian" />
                <Picker.Item label="Indian" value="Indian" />
                <Picker.Item label="Irish" value="Irish" />
                <Picker.Item label="Italian" value="Italian" />
                <Picker.Item label="Japanese" value="Japanese" />
                <Picker.Item label="Jewish" value="Jewish" />
                <Picker.Item label="Kenyan" value="Kenyan" />
                <Picker.Item label="Korean" value="Korean" />
                <Picker.Item label="Latvian" value="Latvian" />
                <Picker.Item label="Libyan" value="Libyan" />
                <Picker.Item label="Mediterranean" value="Mediterranean" />
                <Picker.Item label="Mexican" value="Mexican" />
                <Picker.Item label="Mormon" value="Mormon" />
                <Picker.Item label="Nigerian" value="Nigerian" />
                <Picker.Item label="Other" value="Other" />
                <Picker.Item label="Peruvian" value="Peruvian" />
                <Picker.Item label="Polish" value="Polish" />
                <Picker.Item label="Portuguese" value="Portuguese" />
                <Picker.Item label="Russian" value="Russian" />
                <Picker.Item label="Salvadorian" value="Salvadorian" />
                <Picker.Item label="Sandwiche Shop" value="Sandwiche Shop" />
                <Picker.Item label="Scottish" value="Scottish" />
                <Picker.Item label="Seafood" value="Seafood" />
                <Picker.Item label="Spanish" value="Spanish" />
                <Picker.Item label="Steak House" value="Steak House" />
                <Picker.Item label="Sushi" value="Sushi" />
                <Picker.Item label="Swedish" value="Swedish" />
                <Picker.Item label="Tahitian" value="Tahitian" />
                <Picker.Item label="Thai" value="Thai" />
                <Picker.Item label="Tibetan" value="Tibetan" />
                <Picker.Item label="Turkish" value="Turkish" />
                <Picker.Item label="Welsh" value="Welsh" />
              </Picker>
            </View>
            {/* ########## Price ########## */}
            <Text style={styles.fieldLabel}>Price</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={this.state.price}
                prompt="Price"
                onValueChange={(inItemValue) =>
                  this.setState({ price: inItemValue })
                }>
                <Picker.Item label="" value="" />
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5" value="5" />
              </Picker>
            </View>
            {/* ########## Rating ########## */}
            <Text style={styles.fieldLabel}>Rating</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={this.state.rating}
                prompt="Rating"
                onValueChange={(inItemValue) =>
                  this.setState({ rating: inItemValue })
                }>
                <Picker.Item label="" value="" />
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5" value="5" />
              </Picker>
            </View>
            {/* ########## Phone ########## */}
            <CustomTextInput
              label="Phone Number"
              maxLength={20}
              stateHolder={this}
              stateFieldName="phone"
            />
            {/* ########## Address ########## */}
            <CustomTextInput
              label="Address"
              maxLength={20}
              stateHolder={this}
              stateFieldName="address"
            />
            {/* ########## Web Site ########## */}
            <CustomTextInput
              label="Web Site"
              maxLength={20}
              stateHolder={this}
              stateFieldName="webSite"
            />
            {/* ########## Delivery ########## */}
            <Text style={styles.fieldLabel}>Delivery?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                prompt="Delivery?"
                selectedValue={this.state.delivery}
                onValueChange={(inItemValue) =>
                  this.setState({ delivery: inItemValue })
                }>
                <Picker.Item label="" value="" />
                <Picker.Item label="Yes" value="Yes" />
                <Picker.Item label="No" value="No" />
              </Picker>
            </View>
          </View>
          {/* ########## Buttons ########## */}
          <View style={styles.addScreenButtonsContainer}>
            <CustomButton
              text="Cancel"
              width="44%"
              onPress={() => {
                this.props.navigation.navigate('ListScreen');
              }}
            />
            <CustomButton
              text="Save"
              width="44%"
              onPress={() => {
                AsyncStorage.getItem(
                  'restaurants',
                  (inError, inRestaurants) => {
                    console.log(inRestaurants);
                    if (inRestaurants === null) {
                      inRestaurants = [];
                    } else {
                      inRestaurants = JSON.parse(inRestaurants);
                    }
                    inRestaurants.push(this.state);
                    AsyncStorage.setItem(
                      'restaurants',
                      JSON.stringify(inRestaurants),
                      () => {
                        this.props.navigation.navigate('ListScreen');
                      }
                    );
                  }
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  } /* End render(). */
} /* End AddScreen. */

/**
 *
 #############################################################################
 * Define the screen itself.
 *
 #############################################################################
 */
const RestaurantsScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="ListScreen">
      <Stack.Screen name="ListScreen" component={ListScreen} />
      <Stack.Screen name="AddScreen" component={AddScreen} />
    </Stack.Navigator>
  );
};

export default RestaurantsScreen;

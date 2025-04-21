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
import { Picker } from "@react-native-picker/picker"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { GluestackUIProvider } from '@gluestack-ui/themed-native-base';
import Toast from 'react-native-toast-message';

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
  personList: {
    width: '94%',
  },
  personContainer: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
    borderColor: '#e0e0e0',
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  personName: {
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
  constructor(inProps) {
    super(inProps);
    this.state = {
      listData: [],
    };
  }

  componentDidMount() {
    //Block hardware back button on Android.
    BackHandler.addEventListener('hardwareBackPress', ()=> true);

    //Get list of people
    this.loadPeople();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  loadPeople = async () => {
    try {
      const people = await AsyncStorage.getItem("people");
      const parsedPeople = people ? JSON.parse(people) : [];
      this.setState({ listData: parsedPeople });
    } catch (error) {
      console.error("Failed to load people:", error);
    }
  };

  deletePerson = async (item) => {
    try {
      const people = await AsyncStorage.getItem("people");
      let listData = people ? JSON.parse(people) : [];
      listData = listData.filter((person) => person.key !== item.key);
      await AsyncStorage.setItem("people", JSON.stringify(listData));
      this.setState({ listData });
  
      Toast.show({
        type: 'error', // or 'success', 'info', etc.
        position: 'bottom',
        text1: 'Person deleted',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error("Failed to delete person:", error);
    }
  };
  render() {
    return (
      <GluestackUIProvider>
        <View style={styles.listScreenContainer}>
          <CustomButton
            text="Add Person"
            width="94%"
            onPress={() => this.props.navigation.navigate("AddScreen")}
          />
          <FlatList
            style={styles.personList}
            data={this.state.listData}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <View style={styles.personContainer}>
                <Text style={styles.personName}>
                  {item.firstName} {item.lastName} ({item.relationship})
                </Text>
                <CustomButton
                  text="Delete"
                  onPress={() =>
                    Alert.alert(
                      "Please confirm",
                      "Are you sure you want to delete this person?",
                      [
                        { text: "Yes", onPress: () => this.deletePerson(item) },
                        { text: "No" },
                        { text: "Cancel", style: "cancel" },
                      ],
                      { cancelable: true }
                    )
                  }
                />
              </View>
            )}
          />
        </View>
      </GluestackUIProvider>
    );
  }
}

class AddScreen extends React.Component {
  constructor(inProps) {
    super(inProps);
    this.state = {
      firstName: "",
      lastName: "",
      relationship: "",
      key: `p_${new Date().getTime()}`,
    };
  }

  savePerson = async () => {
    const { firstName, lastName, relationship, key } = this.state;

    if (!firstName || !lastName || !relationship) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const people = await AsyncStorage.getItem("people");
      const listData = people ? JSON.parse(people) : [];
      listData.push(this.state);
      await AsyncStorage.setItem("people", JSON.stringify(listData));
      this.props.navigation.navigate("ListScreen");
    } catch (error) {
      console.error("Failed to save person:", error);
    }
  };

  render() {
    return (
      <GluestackUIProvider>
        <ScrollView style={styles.addScreenContainer}>
          <View style={styles.addScreenInnerContainer}>
            <View style={styles.addScreenFormContainer}>
              <CustomTextInput
                label="First Name"
                maxLength={20}
                stateHolder={this}
                stateFieldName="firstName"
              />
              <CustomTextInput
                label="Last Name"
                maxLength={20}
                stateHolder={this}
                stateFieldName="lastName"
              />
              <Text style={styles.fieldLabel}>Relationship</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  selectedValue={this.state.relationship}
                  onValueChange={(itemValue) =>
                    this.setState({ relationship: itemValue })
                  }
                >
                  <Picker.Item label="" value="" />
                  <Picker.Item label="Me" value="Me" />
                  <Picker.Item label="Family" value="Family" />
                  <Picker.Item label="Friend" value="Friend" />
                  <Picker.Item label="Coworker" value="Coworker" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </View>
            <View style={styles.addScreenButtonsContainer}>
              <CustomButton
                text="Cancel"
                width="44%"
                onPress={() => this.props.navigation.navigate("ListScreen")}
              />
              <CustomButton text="Save" width="44%" onPress={this.savePerson} />
            </View>
          </View>
        </ScrollView>
      </GluestackUIProvider>
    );
  }
}

const Stack = createStackNavigator();

const PeopleScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false}}
      initialRouteName="ListScreen"
    >
      <Stack.Screen name="ListScreen" component={ListScreen} />
      <Stack.Screen name="AddScreen" component={AddScreen} />
    </Stack.Navigator>
  );
};

export default PeopleScreen;
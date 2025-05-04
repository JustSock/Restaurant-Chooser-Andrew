import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';

const styles = StyleSheet.create({
  fieldLabel: {
    marginLeft: 10,
  },
  textInput: {
    height: 40,
    marginLeft: 10,
    width: '96%',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        marginTop: 4,
        paddingLeft: 10,
        borderRadius: 8,
        borderColor: '#c0c0c0',
        borderWidth: 2,
      },
      android: {},
    }),
  },
});

class CustomTextInput extends Component {
  render() {
    const { label, labelStyle, maxLength, textInputStyle, stateHolder, stateFieldName, onChangeText, error, ...props } = this.props;
    return (
      <View>
        <Text style={[styles.fieldLabel, labelStyle]}>{label}</Text>
        <TextInput
          maxLength={maxLength}
          onChangeText={(inText) => stateHolder.setState(() => {
            const obj = {};
            obj[stateFieldName] = inText;
            return obj;
          })}
          style={[styles.textInput, textInputStyle, error ? { borderColor: 'red', borderWidth: 1 } : {}]}
          {...props}
        />
        {error && (
          <Text style={{ color: 'red', marginLeft: 10, fontSize: 12 }}>
            {error}
          </Text>
        )}
      </View>
    );
  }
}

CustomTextInput.propTypes = {
  label: PropTypes.string.isRequired,
  labelStyle: PropTypes.object,
  maxLength: PropTypes.number,
  textInputStyle: PropTypes.object,
  stateHolder: PropTypes.object.isRequired,
  stateFieldName: PropTypes.string.isRequired,
  onChangeText: PropTypes.func,
  onChangeText: PropTypes.func
};

export default CustomTextInput;
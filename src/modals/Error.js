import * as React from 'react';
import {Text, View} from 'react-native';

export default class Error extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <View />
        <Text style={{fontSize: 25, color: 'red', textAlign: 'center'}}>
          There has been an error.
        </Text>
        <Text style={{fontSize: 20, color: 'green', textAlign: 'center'}}>
          {this.props.errorMessage}
        </Text>
        <View />
      </View>
    );
  }
}

import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ImageBackground
} from 'react-native';
import axios from 'axios';
import Config from '../../Config';

import { Footer, Button, Wrapper, Header, Left, Right, H4, Container, Space, Row, Col, H3, LabelIconInput, P, SelectPhoneCode } from './../componentIndex';
import APIKit from '../../APIKit';
import { AppImages } from "../../res";
const API_KEY = 'AIzaSyAXI3puhgpn9khopF9zPl7Q_5O1YP-E_8s';
class GoogleAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: '',
      searchResults: [],
      isShowingResults: false,
      value: 'sdsdsdsds'
    };
  }

  searchLocation = async (text) => {
    this.setState({ searchKeyword: text });
    axios
      .request({
        method: 'post',
        url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${this.state.searchKeyword}`,
      })
      .then((response) => {
        // console.log("main_text", response.data.predictions[0]);
        // console.log("main_text", response.data.predictions[0].structured_formatting.main_text);
        this.setState({
          searchResults: response.data.predictions,
          isShowingResults: true,
        });
      })
      .catch((e) => {
        console.log(e.response);
      });
  };
  onListPress(item) {

    // console.log("item.description", item.place_id)
    axios
      .request({
        method: 'post',
        url: `https://maps.googleapis.com/maps/api/place/details/json?placeid=` + item.place_id + `&key=${API_KEY}`,
      })
      .then((response) => {
        // console.log("response.data.result", response.data.result.geometry.location)
        APIKit.location = response.data.result.geometry.location;
      })
      .catch((e) => {
        console.log(e.response);
      });
    this.setState({
      searchKeyword: item.description,
      isShowingResults: false,
    })
  }

  render() {
    const CS = Config.style
    return (
      <Row>
        <Col sm={12}>
          <View style={styles.autocompleteContainer}>
            <TextInput
              placeholder="Search for an address"
              returnKeyType="search"
              style={[CS.MT5, CS.formInput]}
              placeholderTextColor={'#A2A2A2'}
              onChangeText={(text) => this.searchLocation(text)}
              value={this.state.searchKeyword}
            />
            <Row Hidden={!this.state.isShowingResults} >
              <Row Hidden={this.state.searchResults.length == 0} >
                {this.state.searchResults.map((item) =>
                (
                  <Pressable style={styles.resultItem} onPress={() => this.onListPress(item)} >
                    <Text>{item.description}</Text>
                  </Pressable>
                ))
                }
              </Row>
            </Row>
          </View>
        </Col>
      </Row>

    );
  }
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    // zIndex: 1,
  },
  searchResultsContainer: {
    // width: 340,
    height: 400,
    backgroundColor: '#fff',
    top: 50,
  },
  resultItem: {
    width: '100%',
    justifyContent: 'center',
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 15,
    backgroundColor: '#ffffff',
    zIndex: 100
  },
  searchBox: {
    // width: 340,
    height: 50,
    fontSize: 18,
    borderRadius: 8,
    borderColor: '#aaa',
    color: '#000',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    paddingLeft: 15,
  },
  container: {
    // flex: 1,
    // alignItems: 'center',
    // height: 80,
    // backgroundColor: '#ffffff'
  },
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: 200,
    justifyContent: "center"
  },
});

export default GoogleAutocomplete;
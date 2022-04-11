import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Image,
  Pressable,
  View,
  TextInput,
  Button,
  Dimensions,
} from "react-native";
import { AppImages } from "../../res";
import Config from "../../Config";
import Icon from "react-native-vector-icons/Ionicons";
import { Row, Col, Left, CheckBox } from "../componentIndex";
import APIKit from "../../APIKit";

class Sorting extends Component {
  state = {
    modalVisible: false,
    selectedTab: "Sorting",
    sortValue,
  };
  sortingList = [];
  filterList = [];

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
    if (visible == false) {
      // if (this.state['6135ac440c571f0018a28489'] && this.state['6135ac6d0c571f0018a2848a'] && this.state['6135abfb0c571f0018a28486']) {
      // this.props.closeModal(this.state['6135ac440c571f0018a28489'], this.state['6135ac6d0c571f0018a2848a'], false, this.state['6135abfb0c571f0018a28486'])
      // }

      this.props.sortModel(this.state.sortValue);

      // if (this.state['6135ab240c571f0018a28483'] && this.state['6135a9f60c571f0018a28482'] && this.state['6135ab350c571f0018a28485'] && this.state['6135ab2d0c571f0018a28484']) {
      //     this.props.closeModal(this.state['6135ac440c571f0018a28489'], this.state['6135ac6d0c571f0018a2848a'], false, this.state['6135abfb0c571f0018a28486'], this.state['6135ab240c571f0018a28483'], this.state['6135a9f60c571f0018a28482'], this.state['6135ab350c571f0018a28485'], this.state['6135ab2d0c571f0018a28484'])
      // } else {
      //     this.props.closeModal(this.state['6135ac440c571f0018a28489'], this.state['6135ac6d0c571f0018a2848a'], false, this.state['6135abfb0c571f0018a28486'], false, false, false, false)
      // }
    }
  };
  OnTabChange(currentTab) {
    this.setState({ selectedTab: currentTab });
  }

  componentDidMount() {
    this.getSortingList();
    this.getFilterList();
  }

  getSortingList() {
    fetch(Config.baseUrl + "search/sorting", {
      method: "GET",
      headers: APIKit.CommonHeaders,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("response", responseJson.success.data.sorting);
        this.sortingList = responseJson.success.data.sorting;
        this.sortingList.forEach((item) => {
          this.setState({ [item._id]: false });
        });
      })
      .catch((error) => {
        this.setState({ showLoader: 1 });
      });
  }

  getFilterList() {
    fetch(Config.baseUrl + "search/filter", {
      method: "GET",
      headers: APIKit.CommonHeaders,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log('response', responseJson.success.data.sorting)
        this.filterList = responseJson.success.data.sorting;
        this.filterList.forEach((item) => {
          this.setState({ [item._id]: false });
        });
      })
      .catch((error) => {
        this.setState({ showLoader: 1 });
      });
  }

  onCheckboxChange(item) {
    if (this.state[item._id] == true) {
      this.setState({ [item._id]: false });
    } else {
      this.setState({ [item._id]: true });
    }
  }

  onSortChange(item) {
    this.sortingList.forEach((list) => {
      this.setState({ [list._id]: false });
    });
    this.setState({ [item._id]: true });
    if (item.value == "A to Z") {
      this.setState({ sortValue: "A-to-Z" });
    }
    if (item.value == "Z to A") {
      this.setState({ sortValue: "Z-to-A" });
    }
    if (item.value == "Top Rated") {
      this.setState({ sortValue: "top-rated" });
    }
    if (item.value == "Recommended") {
      this.setState({ sortValue: "Recommended" });
    }

    // if (this.state[item._id] == true) {
    //     this.setState({ [item._id]: false })
    // } else {
    //     this.setState({ [item._id]: true })
    // }
  }

  clearAll() {
    this.filterList.forEach((item) => {
      this.setState({ [item._id]: false });
    });
    this.sortingList.forEach((item) => {
      this.setState({ [item._id]: false });
    });
  }
  render() {
    const { modalVisible } = this.state;
    const CS = Config.style;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!modalVisible);
          }}
        >
          <View style={CS.centeredView}>
            <View style={CS.modalView}>
              <Row style={[Config.style.MT18]}>
                <Col sm={9}>
                  <Pressable
                    onPress={() => this.setModalVisible(!modalVisible)}
                  >
                    <Icon
                      name="close-sharp"
                      size={25}
                      style={[Config.style.MT5]}
                    ></Icon>
                  </Pressable>
                </Col>
                <Col sm={3} style={[{ justifyContent: "center" }]}>
                  <Pressable onPress={() => this.clearAll()}>
                    <Text
                      style={[
                        Config.style.font16,
                        Config.style.FontMedium,
                        Config.style.FW500,
                        { color: "#C6345C", textAlign: "right" },
                      ]}
                    >
                      Clear all
                    </Text>
                  </Pressable>
                </Col>
              </Row>
              <Row size={12} style={[Config.style.MT12, styles.tabBox]}>
                <Pressable onPress={() => this.OnTabChange("Sorting")}>
                  <Col
                    sm={3}
                    style={
                      this.state.selectedTab == "Sorting"
                        ? styles.tabSelected
                        : styles.tabUnSelected
                    }
                  >
                    <Text
                      style={[
                        this.state.selectedTab == "Sorting"
                          ? Config.style.greenText
                          : Config.style.greyText,
                        Config.style.Font12,
                      ]}
                    >
                      Sorting
                    </Text>
                  </Col>
                </Pressable>
                <Pressable onPress={() => this.OnTabChange("Filters")}>
                  <Col
                    sm={3}
                    style={
                      this.state.selectedTab == "Filters"
                        ? styles.tabSelected
                        : styles.tabUnSelected
                    }
                  >
                    <Text
                      style={[
                        this.state.selectedTab == "Filters"
                          ? Config.style.greenText
                          : Config.style.greyText,
                        Config.style.Font12,
                      ]}
                    >
                      Filters
                    </Text>
                  </Col>
                </Pressable>
              </Row>
              <Row style={[Config.style.MT12]} size={12}>
                <Row Hidden={this.state.selectedTab == "Filters"}>
                  {this.sortingList.map((item) => (
                    <Pressable onPress={() => this.onSortChange(item)}>
                      <Row
                        size={12}
                        key={item._id}
                        style={{
                          paddingVertical: 10,
                          borderBottomColor: "#ECECEC",
                          borderBottomWidth: 0.8,
                        }}
                      >
                        <Col
                          sm={11}
                          style={{ justifyContent: "center", paddingLeft: 5 }}
                        >
                          <Text style={[CS.font14, CS.FontMedium, CS.FW500]}>
                            {item.value}
                          </Text>
                        </Col>
                        <Col sm={1} style={[{ textAlign: "right" }]}>
                          <CheckBox
                            onClick={() => {
                              this.onSortChange(item);
                            }}
                            isChecked={this.state[item._id]}
                            disabled={true}
                          />
                        </Col>
                      </Row>
                    </Pressable>
                  ))}
                </Row>
                <Row Hidden={this.state.selectedTab == "Sorting"}>
                  {this.filterList.map((item) => (
                    <Pressable onPress={() => this.onCheckboxChange(item)}>
                      <Row
                        size={12}
                        key={item._id}
                        style={{
                          paddingVertical: 10,
                          borderBottomColor: "#ECECEC",
                          borderBottomWidth: 0.8,
                        }}
                      >
                        <Col
                          sm={11}
                          style={{ justifyContent: "center", paddingLeft: 5 }}
                        >
                          <Text style={[CS.font14, CS.FontMedium, CS.FW500]}>
                            {item.value}
                          </Text>
                        </Col>
                        <Col sm={1} style={[{ textAlign: "right" }]}>
                          <CheckBox
                            onClick={() => {
                              this.onCheckboxChange(item);
                            }}
                            isChecked={this.state[item._id]}
                            disabled={true}
                          />
                        </Col>
                      </Row>
                    </Pressable>
                  ))}
                </Row>
                <Pressable
                  onPress={() => this.setModalVisible(!modalVisible)}
                  style={[Config.style.greenBtn, { marginTop: 20 }]}
                >
                  <Text style={[Config.style.whiteText, Config.style.font14]}>
                    Apply
                  </Text>
                </Pressable>
              </Row>
            </View>
          </View>
        </Modal>
        <Pressable onPress={() => this.setModalVisible(true)}>
          <Row>
            <Col>
              <Image
                source={AppImages.filter}
                style={{ width: 16, height: 16, marginRight: 5 }}
              />
            </Col>
            <Col>
              <Text
                style={[
                  Config.style.Font12,
                  Config.style.FW500,
                  { color: "#7C7C7C" },
                ]}
              >
                Filters
              </Text>
            </Col>
          </Row>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabBox: {
    height: 46,
    width: Dimensions.get("window").width - 35,
    backgroundColor: "#F1F4F3",
    borderRadius: 10,
    paddingLeft: 3,
  },
  tabSelected: {
    backgroundColor: "#ffffff",
    color: "#5CAC7D",
    height: 41,
    borderRadius: 3,
    minWidth: Dimensions.get("window").width / 2 - 21,
    marginVertical: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  tabUnSelected: {
    backgroundColor: "#F1F4F3",
    color: "#707070",
    height: 41,
    borderRadius: 3,
    marginVertical: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    minWidth: Dimensions.get("window").width / 2 - 21,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalView: {
    height: 640,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    paddingBottom: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    fontWeight: "bold",
  },
  menuList: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: Config.listBackgroundColor,
    borderBottomColor: Config.listSeparatorColor,
    borderBottomWidth: 2,
    width: "100%",
  },

  listText: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 0.8,
    justifyContent: "center",
    paddingTop: 10,
  },
  listIcon: {
    flex: 0.2,
    marginTop: 5,
    justifyContent: "flex-end",
    marginRight: -40,
  },
  checkbox: {
    alignSelf: "center",
    width: 30,
    height: 30,
    color: Config.primaryColor,
  },
  searchBox: {
    backgroundColor: "#F4F4F4",
    height: 53,
    width: 340,
    borderRadius: 13,
    padding: 15,
    marginLeft: 18,
  },
  searchBoxInput: {
    height: 50,
    padding: 0,
    marginLeft: -20,
    marginTop: -10,
    fontSize: 17,
    borderColor: "#bcbcbc",
  },
});

export default Sorting;

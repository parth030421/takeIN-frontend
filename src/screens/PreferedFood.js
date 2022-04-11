import React from 'react';
import {
    View, StatusBar, Platform,
    StyleSheet, Pressable,
    TouchableOpacity,
    Text, Image
} from 'react-native';
import { Footer, Button, Wrapper, Header, Center, Left, Right, H4, Container, Space, H3, LabelIconInput, P } from '../components/componentIndex';
import Config from '../Config';
import { AppImages } from '../res';
const marginTop = Platform.OS === 'ios' ? 20 : 0;


export default class FoodPrefered extends React.Component {
    inputs = {};
    state = {
        email: '',
        password: '',
        timePassed: 0
    }

    constructor(props) {
        super(props);
        this.getMealType();
    }

    validateLogin() { }

    login() {
        this.props.navigation.navigate('Register')
    }
    componentDidMount() {
        // setTimeout(() => this.setState({ timePassed: true }), 5000)
    }
    getMealType = () => {
        fetch(Config.baseUrl + 'meal-type', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == true) {
                    this.mealTypeList = responseJson.success.data.data;
                    this.mealTypeList.map((item) => {
                        console.log("item", item)
                        this.setState({ [item._id]: false })
                    })
                    this.setState({ timePassed: 1 })
                }
            })
            .catch((error) => {
                console.error("errorerror", error);
            });
    };

    getByValue3(item) {
        console.log(item)

    }
    handleDisableEnable() {
        var result = [];
        console.log(this.state)
        Object.values(this.state).forEach((val) => {
            if (val == true) {
                result.push(true)
            }
        })

        console.log(result.length) // All duplicates
        if (result.length >= 2 && result.length <= 4) {

            return false
        } else {
            return true
        }


    }
    mealTypeList;
    render() {
        return this.state.timePassed == 1 ? (

            <Wrapper style={{ marginTop }}>
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <Header style={{ paddingTop: 15 }}>
                    <Center><Text style={styles.headerText}>Preferred type of food</Text></Center>
                </Header>

                <Container>
                    <View style={styles.row}>
                        {
                            this.mealTypeList.map((item) => (
                                <Pressable onPress={() => this.state[item._id] == false ? this.setState({ [item._id]: true }) : this.setState({ [item._id]: false })}>
                                    <View style={styles.imageBox}>
                                        <Image source={AppImages.P1} style={styles.listImage} />
                                        <View style={this.state[item._id] == true ? styles.titleBoxChecked : styles.titleBoxUnChecked}>
                                            <Text style={styles.titleText}>{item.mealType}</Text></View>
                                    </View>
                                </Pressable>
                            ))
                        }
                    </View>
                    <Button label={'Start now'}
                        disabled={this.handleDisableEnable()}
                        activeOpacity={0.5}
                        activeOpacity={this.handleDisableEnable() ? 0.7 : 1}
                        style={this.handleDisableEnable() ? { opacity: 0.5 } : { opacity: 1 }}
                        onPress={() => this.props.navigation.navigate('Home')} />

                </Container>

            </Wrapper>

        ) : <View><Text>no data</Text></View>

    }
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: "row",
        position: 'relative',
        flexWrap: "wrap",
        paddingLeft: 10,
        paddingRight: 10
    },
    titleBoxChecked: {
        position: 'absolute',
        width: 150,
        height: 160,
        justifyContent: 'center',
        // backgroundColor: '#858dab9e',
        borderRadius: 10,
        paddingLeft: 25,
        paddingRight: 25,
        borderWidth: 8, borderColor: '#442B7E', borderRadius: 10,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    titleBoxUnChecked: {
        position: 'absolute',
        width: 150,
        height: 160,
        justifyContent: 'center',
        // backgroundColor: '#858dab9e',
        borderRadius: 10,
        paddingLeft: 25,
        paddingRight: 25,
    },
    titleText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    imageBox: {
        height: 160,
        width: 150,
        marginBottom: 20
    },
    listImage: {
        width: 150,
        borderRadius: 10,
        height: 160,
        resizeMode: 'cover'
    },

    labelIcon: {

    }
});





{/* <View style={styles.tabBox}>
        <View>
          <View style={styles.tabBoxIcon}>
            <Pressable onPress={() => navigation.navigate('Home')} >
              <Image source={require('./assets/Icons/Home.png')} />
            </Pressable>
          </View>
        </View>
        <View>
          <View style={styles.tabBoxIcon}>
            <Pressable onPress={() => navigation.navigate('Home')} >
              <Image source={require('./assets/Icons/Vector.png')} />
            </Pressable>
          </View>
        </View>
        <View>
          <View style={styles.tabBoxIconQR}>
            <Pressable onPress={() => navigation.navigate('Home')} >
              <Image source={require('./assets/Icons/qr-code.png')} />
            </Pressable>
          </View>
        </View>
        <View>
          <View style={styles.tabBoxIcon}>
            <Pressable onPress={() => navigation.navigate('Home')} >
              <Image source={require('./assets/Icons/dinner.png')} />
            </Pressable>
          </View>
        </View>
        <View>
          <View style={styles.tabBoxIcon}>
            <Pressable onPress={() => navigation.navigate('Setting')} >
              <Image source={require('./assets/Icons/menu_user.png')} />
            </Pressable>
          </View>
        </View>
      </View> */}



    //   tabBox: {
    //     flex: 1,
    //     justifyContent: 'space-evenly',
    //     flexDirection: "row",
    //     position: 'absolute',
    //     bottom: 0,
    //     width: '102%',
    //     height: 73,
    //     shadowColor: "#000",
    //     shadowOffset: {
    //       width: 0,
    //       height: 1,
    //     },
    //     shadowOpacity: 0.22,
    //     shadowRadius: 2.22,
    //     elevation: 3,
    //     borderTopRightRadius: 20,
    //     borderTopLeftRadius: 20,
    //     paddingTop: 5,
    //     marginLeft: '-1%'
    //   },
    //   tabBoxIcon: {
    //     height: 76,
    //     width: 76,
    //     borderRadius: 16,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   },
    //   tabBoxIconQR: {
    //     height: 76,
    //     width: 76,
    //     borderRadius: 40,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: '#452B7D',
    //     marginTop: -23
    //   }
import React from 'react';
import {
    StyleSheet,
    View, Pressable, Image, TextInput, KeyboardAvoidingView, TouchableOpacity,
    StatusBar, Text, BackHandler, ImageBackground, Modal, TouchableHighlightBase, PermissionsAndroid, Platform
} from 'react-native';
import { Footer, Button, FooterTabs, Wrapper, Header, Left, Right, Row, Col, SelectPhoneCode, H4, Container, Space, H3, LabelIconInput, P } from '../components/componentIndex';

import Icon from "react-native-vector-icons/Ionicons";
import Config from '../Config';
import { AppImages } from '../res';
import APIKit from '../APIKit';
import AsyncStorage from '@react-native-async-storage/async-storage';
const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0
import { DatePickerDialog } from 'react-native-datepicker-dialog';
// import * as ImagePicker from "react-native-image-picker";
// import ImgToBase64 from 'react-native-image-base64';
import SyncStorage from 'sync-storage';
import RNFetchBlob from 'rn-fetch-blob'
// import { CropView } from 'react-native-image-crop-tools';
import ImagePicker from 'react-native-image-crop-picker';
const uri = '';
export default class Profile extends React.Component {

    state = {
        myNumber: '',
        selectedGender: 'Male',
        dobText: '',
        dobDate: null,
        journeyText: '',
        journeyDate: null,
        resourcePath: {},
        selectPopup: false,
        fileUri: '',
        filePath2: '',
        Email: '',
        userId: '',
        profilepic: '',
        dateObject: '',
        dataLoaded: false

    };

    onAndroidBackPress = () => {
        this.props.navigation.navigate('Home')
        return true;
    }

    componentDidMount() {
        this.getToken();
        // this.getProfile();
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
    }

    setModalVisible = (visible) => {
        this.setState({ selectPopup: visible });
        setTimeout(() => {
            // this.setModalVisible(false)
        }, 5000)
    }

    componentWillUnmount() {
        this.updateProfileData(
            {
                "email": this.state.Email,
                "firstName": this.state.FirstName,
                "lastName": this.state.LastName,
                "userId": this.state.userId,
                "profilepic": this.state.profilepic,
                "countryCode": "+91",
                "gender": this.state.selectedGender,
                "dob": this.state.dateObject
            }
        );
        BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    }

    constructor(props) {
        super(props);

    }



    handleCallback = (childData) => { this.countryCode = childData.code }

    validate(text) {
        this.setState({ email: text });
        if (text != '') {
            if (this.validateEmail(text)) {
                this.setState({ emailValid: false });
            }
            else {
                this.setState({ emailValid: true });
            }
        } else {
            this.setState({ emailValid: true });
        }
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }



    createImageURL(image, file) {
        let randomName = + new Date();
        let data = {
                uri: file,
                type: image.mime,
                name: image.filename ? image.filename : randomName.toString(), // timestamp
            }
        /**
         * Prepare payload
         */
        let options = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            method: 'POST'
        };
        options.body = new FormData();
        options.body.append('file', data);
        options.body.append('uploadType', 'ICON');
        options.body.append('extension', file.split('.').pop());
        options.body.append('contentType', image.mime);
        
        fetch(Config.baseUrl + 'upload/file', options).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == true) {
                    const signedURL = responseJson?.success?.data?.fileUrl
                    //const pathToImage = file // without file:// scheme at the beginning
                    // const headers = {}
                    // RNFetchBlob.fetch('PUT', preSignedURL, headers, RNFetchBlob.wrap(pathToImage)).then((response) => {
                    //     console.log("PUT", response);
                    //     // console.log("PUT", response.status)
                    // })
                    setTimeout(() => {
                        this.updateProfileData(
                            {
                                "email": this.state.Email,
                                "firstName": this.state.FirstName,
                                "lastName": this.state.LastName,
                                "userId": this.state.userId,
                                "countryCode": "+91",
                                "profilepic": signedURL,
                                "gender": this.state.selectedGender,
                                "dob": this.state.dateObject
                            }
                        );
                    }, 100)
                }
            })
            .catch((error) => {
                console.error("errorerror", error);
            });
    }

    updateProfileData(profileData) {
        console.log("profileData", profileData)
        fetch(Config.baseUrl + 'user/profile-update', {
            method: 'POST',
            headers: APIKit.CommonHeaders2,
            body: JSON.stringify({
                "payload": profileData
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("updateProfileData", responseJson)
                this.getProfile();
            })
            .catch((error) => {
                console.error("errorerror", error);
            });
    }

    handledisableenable(value) {
        let inputValue = value.mobile.match(/^(\+|\d)[0-9]{7,16}$/)
        // let inputValue2 = 2
        if (inputValue === null) {
            this.setState({ Isbuttondisable: true })
        }
        else {
            this.setState({ Isbuttondisable: false })
            this.setState({ mobileNumber: value.mobile })
            // SyncStorage.set('mobileNumber', value.mobile);


        }
    }

    CommonHeaders2;
    getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('accessToken')
            if (value !== null) {
                console.log("accessToken", value)
                Config.userAuthToken = value;
                APIKit.getHeader();
                this.getProfile();
            }
        } catch (e) {
            // error reading valu
        }

    }

    getProfile() {
        console.log("APIKit.CommonHeaders2", SyncStorage.get('userId'))
        fetch(Config.baseUrl + 'user/get-profile', {
            method: 'GET',
            headers: APIKit.CommonHeaders2
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == true) {
                    console.log("ssss", responseJson.success.data.profileData)
                    let data = responseJson.success.data.profileData;
                    this.setState({dataLoaded:true});
                    this.setState({ FirstName: data.firstName })
                    this.setState({ LastName: data.lastName })
                    this.setState({ Email: data.email })
                    this.setState({ myNumber: data.phoneNumber })


                    this.setState({ userId: data._id })
                    if (data.gender) {
                        this.setState({ selectedGender: data.gender })
                    }
                    if (data.profilepic) {
                        this.setState({ profilepic: data.profilepic })
                    }
                    if (data.dob) {
                        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        const monthNumber = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
                        //  let DOB = New Date()
                        var dateObject = new Date(data.dob);
                        console.log("ll", dateObject)

                        this.setState({
                            dobDate: dateObject.dob,
                            dateObject: data.dob,
                            dobText: dateObject.getDate() + " " + month[dateObject.getMonth()] + " " + dateObject.getFullYear('YYYY')
                        });
                    } else {
                        this.setState({
                            dobDate: '',
                            dateObject: ''
                        })
                    }

                    // if (data.profilepic) {
                    //     this.setState({ profilepic: SyncStorage.get('ImageData') })
                    // }

                }
                this.setState({ showBannerLoader: 1 })
            })
            .catch((error) => {
                console.error("getOrderList error", error);
            });
    }

    onChanged(text) {
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                // alert("please enter numbers only");
            }
        }
        this.setState({ myNumber: newText });
        let inputValue = text.match(/^(\+|\d)[0-9]{7,16}$/)
        // let inputValue2 = 2
        if (inputValue === null) {
            this.setState({ Isbuttondisable: true })
        }
        else {
            this.setState({ Isbuttondisable: false })
            this.setState({ mobileNumber: text })
            // SyncStorage.set('mobileNumber', text);


        }
    }

    handleCallback = (childData) => { this.countryCode = childData.code }

    updateProfile() {

    }

    onDOBPress = () => {
        let dobDate = this.state.dobDate;

        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({
                dobDate: dobDate
            });
        }

        //To open the dialog
        this.refs.dobDialog.open({
            date: dobDate,
            maxDate: new Date() //To restirct future date
        });

    }

    onDOBDatePicked = (date) => {
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthNumber = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        const dateNumber = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
        // let dateNumber;
        // if (date.getDate().length <= 1) {
        //     dateNumber = '0' + date.getDate()
        // } else {
        //     dateNumber = date.getDate()
        // }
        let displayDate = dateNumber[date.getDate()] == undefined ? date.getDate() : dateNumber[date.getDate()]
        this.setState({
            dobDate: date,
            dateObject: date.getFullYear('YYYY') + '-' + monthNumber[date.getMonth()] + '-' + dateNumber[date.getDate()],
            dobText: date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear('YYYY')
        });
        console.log("sssss", date.getFullYear('YYYY') + '-' + monthNumber[date.getMonth()] + '-' + dateNumber[date.getDate()])
        // this.updateProfileData(
        //     {
        //         "email": this.state.Email,
        //         "firstName": this.state.FirstName,
        //         "lastName": this.state.LastName,
        //         "userId": this.state.userId,
        //         "dob": date.getFullYear('YYYY') + '-' + monthNumber[date.getMonth()] + '-' + date.getDate(),
        //         "profilepic": this.state.profilepic,
        //         "countryCode": "+91",
        //     }
        // );
    }

    onJourneyDatePress = () => {
        let journeyDate = this.state.journeyDate;

        if (!journeyDate || journeyDate == null) {
            journeyDate = new Date();
            this.setState({
                journeyDate: journeyDate
            });
        }

        //To open the dialog
        this.refs.journeyDialog.open({
            date: journeyDate,
            minDate: new Date() //To restirct past date
        });

    }

    pickImage() { }

    onJourneyDatePicked = (date) => {
        this.setState({
            journeyDate: date,
            journeyText: moment(date).format('DD MMM, YYYY')
        });
    }

    selectFile = () => {
        var options = {
            title: 'Select Image',
            customButtons: [
                {
                    name: 'customOptionKey',
                    title: 'Choose file from Custom Option'
                },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, res => {
            console.log('Response = ', res);

            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
                alert(res.customButton);
            } else {
                let source = res;
                this.setState({
                    resourcePath: source,
                });
            }
        });
    };

  

    async cameraLaunch() {
        var isImageUpdate = false;
        var ImageUpdateData = '';
        var ImageUpdateInterval;

        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        try {
            if (Platform.OS === "android") {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "App Camera Permission",
                        message: "App needs access to your camera ",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    ImagePicker.openCamera({
                        width: 200,
                        height: 200,
                        cropping: true,
                        compressImageQuality: 0.8
                    }).then((image) => {
                        this.setModalVisible(false)
                        this.createImageURL(image, image.path.replace('file://', ''))
                    }).catch((err) => {
                        this.setModalVisible(false)
                        console.log('err.err', err);
                    })
                } else {
                    console.log("Camera permission denied");
                }
            } else {
                ImagePicker.openCamera({
                    width: 150,
                    height: 150,
                    cropping: true,
                    compressImageQuality: 0.8
                }).then(image => {
                    this.setModalVisible(false)
                    this.createImageURL(image, image.path.replace('file://', ''))
                }).catch((err)=>{
                    this.setModalVisible(false)
                });
                
            }
        } catch (err) {
            console.warn(err);
        }

       
    }

    imageGalleryLaunch = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            width: 400,
            height: 400,
            cropperCircleOverlay: true,
            freeStyleCropEnabled: true,
            avoidEmptySpaceAroundImage: true,
        };
        
        ImagePicker.openPicker({
            width: 150,
            height: 150,
            cropping: true,
            compressImageQuality: 0.8
        }).then(image => {
            this.setModalVisible(false)
            this.createImageURL(image, image.path.replace('file://', ''))
        }).catch((err)=>{
            this.setModalVisible(false)
            console.log('err.err',err);
        });
        // ImagePicker.launchImageLibrary(options, (res) => {
        //     console.log('Response galary= ', res);
        //     this.setModalVisible(false)
        //     if (res.didCancel) {
        //         console.log('User cancelled image picker');
        //     } else if (res.error) {
        //         console.log('ImagePicker Error: ', res.error);
        //     } else if (res.customButton) {
        //         console.log('User tapped custom button: ', res.customButton);
        //         alert(res.customButton);
        //     } else {
        //         const source = { uri: res.uri };
        //         console.log('response', res.assets[0].uri, JSON.stringify(res));
        //         // this.setState({
        //         //     profilepic: res.assets[0].uri
        //         // });
        //         <CropView
        //             sourceUrl={uri}
        //             style={styles.cropView}
        //             ref={cropViewRef}
        //             onImageCrop={(res) => console.warn("res", res)}
        //             keepAspectRatio
        //             aspectRatio={{ width: 16, height: 9 }}
        //         />
        //         ImgToBase64.getBase64String(res.assets[0].uri)
        //             .then(base64String => {
        //                 console.log("bassss", res.assets[0].uri.replace('file://', ''))

        //                 this.createImageURL(res.assets[0].type, res.assets[0].uri.replace('file://', ''))
        //                 // this.saveImage(base64String)
        //                 // this.setState({
        //                 //     filePath22: base64String
        //                 // });
        //             }).catch(err => console.log(err));
        //         // this.setState({
        //         //     filePath: res,
        //         //     fileData: res.data,
        //         //     fileUri: res.uri
        //         // });
        //     }
        // });
    }


    saveImage = async (data) => {
        SyncStorage.set('ImageData', data)
    }

    render() {
        const { order } = this.state;
        const CS = Config.style
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.9 }}>
                    <Wrapper>
                        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                        <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
                            <Header style={{ paddingTop: 10 }}>
                                <Left style={CS.imageIcon}>
                                    <Pressable onPress={() => this.props.navigation.navigate('Home')}>
                                        <Image source={AppImages.backBlack} style={{ width: 33, height: 33, marginLeft: 0 }} />
                                    </Pressable>
                                </Left>
                                <Text style={[CS.font16, CS.FW500, CS.MT10]}>Profile</Text>
                                <Right>
                                    {/* <Pressable onPress={() => this.props.navigation.navigate('Notifications')} style={styles.headerIcon}>
                            <Image source={AppImages.Notification} style={{ resizeMode: 'contain', flex: 1, width: 22, height: 20 }} />
                        </Pressable> */}
                                    <Pressable style={styles.headerIcon}>
                                        <Image source={AppImages.Notification2} style={{ resizeMode: 'contain', flex: 1, width: 22, height: 20 }} />
                                    </Pressable>
                                </Right>
                            </Header>

                            <Container>
                                <Row size={12}>
                                    <Col sm={12} style={[CS.Col, { position: 'relative', width: 96 }]}>
                                        <Pressable onPress={() => this.setModalVisible(true)}>
                                            {
                                                this.state.profilepic == '' && this.state.dataLoaded ?
                                                    (<Image source={AppImages.menu_user} style={{ width: 96, height: 96, resizeMode: 'contain', borderRadius: 100 }} />) :
                                                    (<Image defaultSource ={AppImages.load_image} source={{ uri: this.state.profilepic }} style={{ width: 96, height: 96, resizeMode: 'contain', borderRadius: 100 }} />)
                                            }
                                            <View style={{ position: 'absolute', Right: 0, paddingLeft: 50, paddingTop: 50 }}>
                                                <Image source={AppImages.pickImage} style={{ width: 31, height: 31 }}></Image>
                                            </View>
                                        </Pressable>
                                    </Col>
                                    <Col sm={6} style={{ paddingRight: 5 }}><Text style={[CS.font14, CS.MT18, CS.FW500]}>First Name</Text></Col>
                                    <Col sm={6}><Text style={[CS.font14, CS.MT18, CS.FW500]}>Last Name</Text></Col>
                                    <Col sm={6} style={{ paddingRight: 5 }}>
                                        <TextInput value={this.state.FirstName} placeholder={'First Name'} returnKeyType='done' onChangeText={(text) => this.setState({ FirstName: text.replace(/[^a-zA-Z]+/g, '') })} style={[CS.MT5, CS.formInput]} placeholderStyle={CS.font16} placeholderTextColor={'#999999'} textBreakStrategy={'simple'} />
                                    </Col>
                                    <Col sm={6}>
                                        <TextInput value={this.state.LastName} placeholder={'Last Name'} returnKeyType='done' onChangeText={(text) => this.setState({ LastName: text.replace(/[^a-zA-Z]+/g, '') })} style={[CS.MT5, CS.formInput]} placeholderStyle={CS.font16} placeholderTextColor={'#999999'} textBreakStrategy={'simple'} />
                                    </Col>
                                    {/* <Col sm={12}><Text style={[CS.font14, CS.MT18, CS.FW500]}>Mobile number</Text></Col>
                                    <Col sm={12}>
                                        <Row style={styles.inputContainer}>
                                            <Col sm={2.8} style={[CS.Col, { alignItems: 'flex-end' }]}>
                                                <SelectPhoneCode parentCallback={this.handleCallback}></SelectPhoneCode></Col>
                                            <Col>
                                                <TextInput placeholderTextColor={'#999999'}
                                                    onChangeText={(text) => this.handledisableenable({ mobile: text })}
                                                    placeholder={'Mobile number'}
                                                    keyboardType='numeric'
                                                    returnKeyType='done'
                                                    onChangeText={(text) => this.onChanged(text)}
                                                    value={this.state.myNumber}
                                                    maxLength={10}  //setting limit of input
                                                    style={styles.NumberInput}
                                                    // ref={input => {
                                                    //     this.inputs['mobile'] = input;
                                                    // }}
                                                    onSubmitEditing={() => {
                                                        // this.login();
                                                    }}
                                                    underlineColorAndroid={'transparent'}></TextInput>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col sm={12}><Text style={[CS.font14, CS.MT18, CS.FW500]}>Email</Text></Col>
                                    <Col sm={12}>
                                        <TextInput value={this.state.Email} placeholder={'Enter your email'} returnKeyType='done' onChangeText={text => this.setState({ Email: text })} style={[CS.MT5, CS.formInput]} placeholderStyle={CS.font16} placeholderTextColor={'#999999'} textBreakStrategy={'simple'} />
                                    </Col> */}
                                    <Col sm={12}><Text style={[CS.font14, CS.MT18, CS.FW500]}>Date Of Birth</Text></Col>
                                    <Col sm={12}>
                                        <TouchableOpacity onPress={this.onDOBPress.bind(this)} >
                                            <Row style={styles.datePickerBox}>
                                                <Col sm={10} style={[{ justifyContent: 'center' }]}><Text style={styles.datePickerText}>{this.state.dobText}</Text></Col>
                                                <Col sm={2} style={[CS.Col]}><Icon name="calendar" size={25} color={'#442B7E'}></Icon></Col>
                                            </Row>

                                        </TouchableOpacity>
                                        {/* <TextInput value={this.state.DOB} placeholder={'22 jun 1993'} returnKeyType='done' onChangeText={text => this.setState({ DOB: text })} style={[CS.MT5, CS.formInput]} placeholderStyle={CS.font16} placeholderTextColor={'#999999'} textBreakStrategy={'simple'} /> */}
                                    </Col>
                                    <Col sm={12}>
                                        <Text style={[CS.font14, CS.FW500, CS.MT18, { textAlign: 'left' }]}>Gender</Text>
                                    </Col>
                                    <Col sm={12} >
                                        <Row style={[CS.Col, CS.MT5]}>
                                            <Col sm={6} style={[CS.Col, { paddingRight: 5 }]}>
                                                <Pressable onPress={() => this.setState({ selectedGender: 'Male' })} style={[styles.selectBtn, CS.Col, this.state.selectedGender == 'Male' ? { backgroundColor: '#442B7E' } : { backgroundColor: '#F9F9F9' }, { display: 'flex', flexDirection: 'row', paddingHorizontal: '32%' }]}>
                                                    <Image source={this.state.selectedGender == 'Male' ? AppImages.maleWhite : AppImages.maleGray} style={{ resizeMode: 'contain', flex: 1, width: 16, height: 16 }} />
                                                    <Text style={[CS.font14, CS.FW500, CS.FontMedium, this.state.selectedGender == 'Male' ? { color: '#ffffff' } : { color: '#707070' }, { textAlign: 'left' }]}>Male</Text>
                                                </Pressable>
                                            </Col>
                                            <Col sm={6} style={[CS.Col, { paddingLeft: 5 }]}>
                                                <Pressable onPress={() => this.setState({ selectedGender: 'Female' })} style={[styles.selectBtn, CS.Col, this.state.selectedGender == 'Female' ? { backgroundColor: '#442B7E' } : { backgroundColor: '#F9F9F9' }, { display: 'flex', flexDirection: 'row', paddingHorizontal: '32%' }]}>

                                                    <Image source={this.state.selectedGender == 'Male' ? AppImages.femaleGray : AppImages.femaleWhite} style={{ resizeMode: 'contain', width: 10, height: 16, marginRight: 5 }} />
                                                    <Text style={[CS.font14, CS.FW500, CS.FontMedium, this.state.selectedGender == 'Female' ? { color: '#ffffff' } : { color: '#707070' }, { textAlign: 'left' }]}>Female</Text>
                                                </Pressable>
                                            </Col>
                                        </Row>
                                    </Col>
                                    {/* <Col sm={12}>
                                        <Pressable onPress={() => this.updateProfile()} style={[CS.greenBtn, CS.Col, CS.MT18, { marginBottom: 80, backgroundColor: '#442B7E' }]}>
                                            <Text style={[CS.font14, CS.FW500, CS.FontMedium, { color: '#ffffff', textAlign: 'left' }]}>Update</Text>
                                        </Pressable>
                                    </Col> */}
                                </Row>
                            </Container>
                        </KeyboardAvoidingView>
                        <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
                        <DatePickerDialog ref="journeyDialog" onDatePicked={this.onJourneyDatePicked.bind(this)} />

                        <View>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.selectPopup}
                                onRequestClose={() => {
                                    this.setModalVisible(!this.state.selectPopup);
                                }}>
                                <TouchableOpacity style={styles.centeredView} onPress={()=>{this.setModalVisible(false);}}>
                                    <View style={styles.modalView}>

                                        <TouchableOpacity onPress={() => {
                                            this.cameraLaunch();
                                        }} style={styles.button}  >
                                            <Text style={styles.buttonText}>Launch Camera Directly</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={this.imageGalleryLaunch} style={styles.button}  >
                                            <Text style={styles.buttonText}>Launch Image Gallery Directly</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </Modal>
                        </View >

                    </Wrapper>
                </View>
                <View style={{ flex: 0.1 }}>
                    <FooterTabs navigation={this.props.navigation}></FooterTabs>
                </View>
            </View >
        );
    }

}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        // paddingBottom: 40,
        paddingBottom: 8,
        width: '100%',
        height: 170,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    container: {
        flex: 1,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    button: {
        width: '100%',
        height: 60,

        backgroundColor: '#442B7E',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 12
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#fff'
    },
    datePickerBox: {
        marginTop: 9,
        borderColor: '#ABABAB',
        borderWidth: 0.5,
        padding: 0,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        height: 38,
        justifyContent: 'center'
    },
    datePickerText: {

        // fontWeight: "bold",
        // color: '#111111',
        // fontSize: 14,
        // height: 44,
        // paddingLeft: 15,
        // paddingRight: 3,
        // borderWidth: 1,
        // borderRadius: 5,
        fontWeight: '400',
        fontSize: 14,
        marginLeft: 5,
        borderWidth: 0,
        paddingLeft: 15,
    },
    selectBtn: {
        height: 41,
        width: '100%',
        borderRadius: 8
    },
    inputContainer: {
        borderWidth: 2,
        borderColor: '#CCCCCC',
        height: 48,
        borderRadius: 5,
        marginTop: 5,
    },
    NumberInput: {
        marginTop: 0,
        height: 48,
        fontSize: 15,
        fontWeight: '700',
        width: '100%',
        zIndex: 10,
        marginLeft: 5,
        paddingLeft: 3,
        width: 220
        // borderWidth:0
    },
    header: Config.headerStyle,
    headerHeading: Config.headerFontStyle,
    headerLeft: {
        flex: 0.6,
        height: 60,
        justifyContent: 'center'
    },
    headerRight: {
        flex: 0.4,
        alignItems: 'flex-end',
        height: 60,
        justifyContent: 'center'
    },
    headerIcon: {
        marginRight: 10
    },
    orderItemCard: {
        backgroundColor: '#ffffff',
        shadowColor: "#222222",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
        marginBottom: 7
    },
    separator: {
        paddingHorizontal: 15,
        paddingVertical: 7,
        backgroundColor: '#eeeeee'
    },
    tr: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 15
    },
    tdLeft: {
        flex: 0.5
    },
    tdRight: {
        flex: 0.5,
        alignItems: 'flex-end'
    },
    summaryText: {
        fontSize: 14,
        color: '#444444'
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000'
    },
    btnTransparent: {
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    btnTextDark: {
        fontWeight: 'bold',
        color: '#cccccc',
        fontSize: 16
    }
});
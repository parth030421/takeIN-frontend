import { Platform, StatusBar } from 'react-native';
const $primaryColor = '#442B7E';
const $secondaryColor = '#c2185b';
const $lightColor = '#607d8b';
const $warningColor = '#d32f2f';
const $successColor = '#00c853';
const $layout = 'light';
const $borderRadius = 10;

export default {
  isAndroid: Platform.OS === 'android',
  appVersion: "1.1",
  headingFont: Platform.OS == 'android' ? 'OpenSansBold' : 'helvetica-bold',
  defaultFont: Platform.OS == 'android' ? 'OpenSansRegular' : 'helvetica',
  defaultFontSize: Platform.OS == 'ios' ? 16 : 14,
  layoutMode: $layout,
  backgroundColor: $layout == 'dark' ? '#222222' : '#ffffff',
  listBackgroundColor: $layout == 'dark' ? '#111111' : '#ffffff',
  listSeparatorColor: $layout == 'dark' ? '#222222' : '#eeeeee',
  tabBarColor: $layout == 'dark' ? '#111111' : '#fffffff',
  cardColor: $layout == 'dark' ? '#131313' : '#ffffff',
  defaultFontColor: $layout == 'dark' ? '#f2f2f2' : '#4f555f',
  blurBackground: 'rgba(0, 0, 0, 0.75)',
  primaryColor: $primaryColor,
  secondaryColor: $secondaryColor,
  lightColor: $lightColor,
  warningColor: $warningColor,
  successColor: $successColor,
  defaultBorderRadius: $borderRadius,
  badgeColor: "red",
  badgeTextColor: "#ffffff",
  productDetailLayout: "layout1", // layout1 or layout2
  marginTop: Platform.OS === "ios" ? 20 : StatusBar.currentHeight,
  baseUrl2: "https://dev.takein.sa/api/v1/",
  baseUrl: "https://dev.takein.sa/api/v1/", // "https://dj0ta0m59u64w.cloudfront.net/api/v1/",
  authToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTBmNjE2M2IyMTljNjZmZGE0NzJiNDEiLCJpYXQiOjE2MzA1NTkwNDl9.9Gi-NHR8hWLCZKrvPTJaE1s1w5GpTrIUA34pt3cyCnc",
  userAuthToken: "",

  style: {
    iconBtn: {
      padding: 5
    },
    iconBtnColor: '#ffffff',
    roundBtn: {
      padding: 10,
      backgroundColor: $primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.00,
      elevation: 1,
      borderRadius: 25
    },
    gridCartBtn: {
      padding: 10,
      backgroundColor: $primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: $borderRadius
    },
    form: {
      paddingBottom: 15,
      paddingTop: 35
    },
    otpFormInput: {
      display: "inline"

    },
    formField: {
      marginBottom: 25
    },
    formInput: {
      fontWeight: "bold",
      color: $layout == 'dark' ? '#ffffff' : '#111111',
      fontSize: 14,
      height: 44,
      paddingLeft: 15,
      paddingRight: 3,
      paddingTop: 6,
      paddingBottom: 6,
      borderWidth: 1,
      borderRadius: 5,
      fontWeight: '400',
      // border: 1,
      borderColor: '#bcbcbc',
      alignSelf: 'stretch',
    },
    formInput2: {
      fontWeight: "bold",
      color: '#111111',
      fontSize: 15,
      borderBottomWidth: 0,
      backgroundColor: '#e2e2e2',
      borderRadius: $borderRadius,
      paddingHorizontal: 12,
      marginTop: 5,
      height: 45
    },
    btn: {
      height: 45,
      borderRadius: $borderRadius,
      backgroundColor: $primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.00,
      elevation: 1,
      flexDirection: 'row',
      paddingHorizontal: 10,
      minWidth: 60,
      alignSelf: 'flex-start'
    },
    btnTxt: {
      fontWeight: 'bold',
      color: $layout == 'dark' ? '#222222' : '#ffffff',
      marginBottom: 0
    },
    btnLg: {
      height: 45,
      borderRadius: $borderRadius,
      backgroundColor: $primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.00,
      elevation: 1,
      flexDirection: 'row',
      marginTop: 8
    },
    btnLgTxt: {
      fontWeight: 'bold',
      color: $layout == 'dark' ? '#222222' : '#ffffff',
      fontSize: 16,
      marginBottom: 0
    },
    itemContainer: {
      borderWidth: 1,
      borderColor: '#E5E5E5',
      borderRadius: 10,
      height: 88,
      marginTop: 15,
      padding: 10
    },
    card: {
      shadowColor: $layout == 'dark' ? '#333333' : "#999",
      shadowOffset: {
        width: 0,
        height: 2.5,
      },
      shadowOpacity: 0.1,
      shadowRadius: 5.27,
      elevation: 2,
      borderRadius: $borderRadius,
      backgroundColor: $layout == 'dark' ? '#131313' : '#ffffff',
      marginBottom: 5,
      padding: 8
    },
    shadowLessCard: {
      borderRadius: $borderRadius,
      backgroundColor: $layout == 'dark' ? '#131313' : '#ffffff',
      marginBottom: 5,
      padding: 8,
      borderWidth: 1,
      borderColor: '#E5E5E5'
    },
    cardShadow: {
      shadowColor: $layout == 'dark' ? '#333333' : "#999",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 6.27,
      elevation: 10
    },
    cardHeader: {
      paddingHorizontal: 15
    },
    cardFooter: {
      paddingHorizontal: 15
    },
    cardContent: {
      paddingHorizontal: 15
    },
    labelWrapper: {
      flexDirection: 'row'
    },
    labelIconWrapper: {
      width: 23
    },

    labelText: {
      color: '#a7a6b4',
      fontSize: 13.5
    },
    labelIconWrapper: {
      width: 23
    },
    labelText: {
      color: '#a7a6b4',
      fontSize: 13.5
      , fontFamily: 'Ubuntu-Light'
    },
    whiteText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    col: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    boldText: {
      fontWeight: 'bold',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Ubuntu-Light'
    },
    IconStyle: {
      resizeMode: 'contain', width: 23, height: 17
    },
    imageIcon: {
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    StatusBar: {
      backgroundColor: '#442B7E',
      height: 50
    },
    shadowBox: {
      shadowColor: "#000",
      marginBottom: -15,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    topShadow: {
      borderTopColor: '#ebebeb',
      borderTopWidth: 2,
      borderBottomWidth: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,
      borderColor: '#bcbaba',
    },
    radioPrimary: {
      width: 25,
      height: 25,
      borderColor: $primaryColor,
      borderWidth: 2,
    },
    checkboxPrimary: {
      alignSelf: "center",
      width: 30,
      height: 30,
      color: $primaryColor,
      borderRadius: 1
    },
    searchBox: {
      backgroundColor: '#F4F4F4',
      height: 53,
      width: '100%',
      borderRadius: 13,
      padding: 15,
      marginTop: 12,
      marginBottom: 10
    },
    itemContainer: {
      borderWidth: 1,
      borderColor: '#E5E5E5',
      borderRadius: 10,
      height: 88,
      marginTop: 15,
      padding: 10
    },
    margin20: {
      margin: 20
    },
    searchBoxInput: {
      height: 50,
      padding: 0,
      marginLeft: 10,
      marginTop: -13,
      fontSize: 17,
      borderColor: '#bcbcbc',
    },
    blurBGView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    LoginModalView: {

    },
    centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: 'white'
    },
    modalView: {
      width: '100%',
      height: '100%',
      backgroundColor: "white",
      padding: 15,
      paddingBottom: 0,
      paddingTop: 30,
      width: '100%',
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
    container2: {
      margin: 20
    },
    nullMessage: {
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      textAlign: 'center'
      // marginTop: 2
    },
    margin15: {
      margin: 15
    },
    Col: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    listDivider: { borderBottomWidth: 1, borderColor: 'rgba(196, 196, 196, 0.8)', marginBottom: 10, marginTop: 10 },
    textCenter: { textAlign: 'center' },
    ML5: { marginLeft: 5 },
    ML10: { marginLeft: 10 },
    MR5: { marginRight: 5 },
    ML12: { marginLeft: 12 },
    ML14: { marginLeft: 14 },
    ML16: { marginLeft: 16 },
    ML18: { marginLeft: 18 },
    MR10: { marginRight: 10 },
    MR12: { marginRight: 12 },
    MR14: { marginRight: 14 },
    MR16: { marginRight: 16 },
    MR18: { marginRight: 18 },
    MT5: { marginTop: 5 },
    MT10: { marginTop: 10 },
    MT12: { marginTop: 12 },
    MT14: { marginTop: 14 },
    MT16: { marginTop: 16 },
    MT18: { marginTop: 18 },
    PD15: { padding: 15 },
    PD8: { padding: 8 },
    font10: { fontSize: 10, fontFamily: 'Ubuntu-Medium' },
    font12: { fontSize: 12, fontFamily: 'Ubuntu-Medium' },
    font14: { fontSize: 14, fontFamily: 'Ubuntu-Medium' },
    font15: { fontSize: 15, fontFamily: 'Ubuntu-Medium' },
    font16: { fontSize: 16, fontFamily: 'Ubuntu-Medium', color: '#333333' },
    font17: { fontSize: 17, fontFamily: 'Ubuntu-Medium' },
    font18: { fontSize: 18, fontFamily: 'Ubuntu-Medium' },
    font20: { fontSize: 20, fontFamily: 'Ubuntu-Medium' },
    font22: { fontSize: 22, fontFamily: 'Ubuntu-Medium' },
    font24: { fontSize: 24, fontFamily: 'Ubuntu-Medium' },
    font26: { fontSize: 26, fontFamily: 'Ubuntu-Medium' },
    font28: { fontSize: 28, fontFamily: 'Ubuntu-Medium' },
    font30: { fontSize: 30, fontFamily: 'Ubuntu-Medium' },
    FW700: { fontWeight: '700' },
    FW500: { fontWeight: '500' },
    FW400: { fontWeight: '400' },
    FontLight: { fontFamily: 'Ubuntu-Light' },
    greyText: { color: '#AFAFAF', fontFamily: 'Ubuntu-Medium' },
    darkGreyText: { color: '#999999' },
    greenText: { color: '#5CAC7D', fontFamily: 'Ubuntu-Medium' },
    TextCenter: { textAlign: 'center' },
    LBText: { color: '#333333' },
    greenBtn: {
      backgroundColor: '#5CAC7D',
      width: '100%',
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
      marginLeft: 0,
      marginRight: 0
      // marginLeft: '5%'
    },
    FontLight: { fontFamily: 'Ubuntu-Light' },
    FontBold: { fontFamily: 'Ubuntu-Bold' },
    FontMedium: { fontFamily: 'Ubuntu-Medium' },
    FontRegular: { fontFamily: 'Ubuntu-Regular' },
  },
};
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTUtils.h>
#import <React/RCTLog.h>
#include <CommonCrypto/CommonDigest.h>

//#import <PayFortSDK.h>
///Users/admin/TakeIN-Android/node_modules/react-native-payfort-sdk/ios/PayFortSDK.framework/Versions/A/Headers/PayFortSDK.h
#import </Users/admin/TakeIN-Android/node_modules/react-native-payfort-sdk/ios/PayFortSDK.framework/Versions/A/Headers/PayFortSDK.h>
@interface PayFort : NSObject <RCTBridgeModule, PKPaymentAuthorizationViewControllerDelegate>

@end

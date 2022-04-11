import { StyleSheet, Dimensions, Platform } from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		marginTop: 5,
		marginLeft: 0,
		marginRight: 0,
		alignItems: 'flex-start',
	},
	row: {
		flexDirection: 'row',
		marginTop: 15,
	},
	number: {
		fontSize: 30,
		textAlign: 'center',
		color: '#ffffff'
	},
	backspace: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	cell: {
		flex: 1,
		opacity: 1,
		color: '#333333',
		justifyContent: 'center',
	},
});

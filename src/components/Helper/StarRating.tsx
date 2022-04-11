import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
interface Props { }

const StarRating: React.FC<Props> = (props: any) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(<Icon key={i} name="star" color={props.rating >= i ? '#f9b000' : '#b2b2b2'} size={20} />)
    }

    return (
        <View style={{ flexDirection: 'row', marginBottom: -5 }}>
            {stars}
        </View>
    )
}
export default StarRating;
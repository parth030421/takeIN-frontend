import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { Surface } from '@react-native-community/art';
import AnimatedCircle from './AnimatedCircle';

export default class PulseLoader extends React.PureComponent {
    static propTypes = {
        size: PropTypes.number,
        frequency: PropTypes.number,
    };

    static defaultProps = {
        size: 30,
        frequency: 1000,
    };

    state = {
        effect: new Animated.ValueXY({ x: 0, y: 1 }),
    };

    componentDidMount() {
        this._animation();
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    _animation = () => {
        Animated.parallel([
            Animated.timing(this.state.effect.x, {
                toValue: 1,
                duration: this.props.frequency,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.effect.y, {
                toValue: 0.05,
                duration: this.props.frequency,
                useNativeDriver: false,
            }),
        ]).start(() => {
            if (!this.unmounted) {
                this.state.effect.setValue({ x: 0, y: 1 });
                this._animation();
            }
        });
    };

    render() {
        const { size } = this.props;
        return (
            <Surface width={size} height={size}>
                <AnimatedCircle
                    radius={size}
                    fill={'#000000'}
                    scale={this.state.effect.x}
                    opacity={this.state.effect.y}
                    x={size / 2}
                    y={size / 2}
                />
            </Surface>
        );
    }
}
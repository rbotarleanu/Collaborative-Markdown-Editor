import React from 'react';
import '../styles/UserBubble.css';
import Color from '../utils/Color';

interface Props {
    userName: string,
    userNick: string,
    userColor: Color,
    setHoverIdx: (idx: number) => void,
    idx: number
};

interface State {
    userName: string,
    userNick: string,
    userColor: Color,
    hover: boolean,
    idx: number,
    setHoverIdx: (idx: number) => void
}

export default class UserBubble extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            userName: props.userName,
            userNick: props.userNick,
            userColor: props.userColor,
            setHoverIdx: props.setHoverIdx,
            idx: props.idx,
            hover: false
        };
    }

    render() {
        return (
            <svg
                onMouseEnter={() => {this.state.setHoverIdx(this.state.idx)}}
            >
                <circle r="16"
                    cx="17"
                    cy="17"
                    stroke="white"
                    strokeWidth="2"
                    fill={this.state.userColor.getRGB()}/>
                <text
                    textAnchor="middle"
                    fill="white"
                    x="17"
                    y="22"
                >
                    {this.state.userNick}
                </text>
            </svg>
        )
    }
}
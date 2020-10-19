import React from 'react';
import '../styles/UserBar.css';
import UserBubble from './UserBubble';
import Color from '../utils/Color';


interface Props {
    users: Array<string>,
    colors: Array<Color>
};

interface State {
    users: Array<string>,
    nicknames: Array<string>,
    colors: Array<Color>,
    hoverIdx: number
};


export default class UserBar extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        let nicknames = this.generateNicknames(props.users);

        this.state = {
            users: props.users,
            nicknames: nicknames,
            colors: props.colors,
            hoverIdx: -1    
        };
    }

    generateNicknames(users: Array<string>): Array<string> {
        return users.map((userName) => {
            let names = userName.split(' ');
            return names.map((name: string) => name[0]).join("");
        });
    }

    setHoverIdx(idx: number) {
        this.setState({hoverIdx: idx})
    }

    render() {
        return (
            <div className="UserBar"
                onMouseLeave={() => {this.setHoverIdx(-1);}}>
                {this.state.users.map((userName: string, idx: number) => {
                    return (
                            <div className="UserIcon" key={idx}>
                                <UserBubble
                                userName={userName}
                                userNick={this.state.nicknames[idx]}
                                userColor={this.state.colors[idx]}
                                idx={idx}
                                setHoverIdx={(idx: number) => {this.setHoverIdx(idx)}}
                                key={idx}
                                />
                                {this.state.hoverIdx === idx && (
                                    <div className="HoverName">
                                        <span>
                                            {userName}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                    );
                })}
            </div>
        )
    }
}
import React from 'react';
import '../styles/UserBar.css';
import Color from '../utils/Color';
import UserBubble from './UserBubble';


interface Props {
    users: Array<string>
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
        let colors = this.generateColors(nicknames);

        this.state = {
            users: props.users,
            nicknames: nicknames,
            colors: colors,
            hoverIdx: -1    
        };
    }

    generateNicknames(users: Array<string>): Array<string> {
        return users.map((userName) => {
            let names = userName.split(' ');
            return names.map((name: string) => name[0]).join("");
        });
    }

    generateColors(nicknames: Array<string>): Array<Color> {
        return [];
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
                                userName={idx === 0 ? userName: ""}
                                userNick={this.state.nicknames[idx]}
                                userColor={this.state.colors[idx]}
                                idx={idx}
                                setHoverIdx={(idx: number) => {this.setHoverIdx(idx)}}
                                key={idx}
                                />
                                {this.state.hoverIdx === idx && (
                                    <div className="HoverName"
                                        style={{marginLeft: idx > 4 ? "-130px" : "-15px"}}
                                        >
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
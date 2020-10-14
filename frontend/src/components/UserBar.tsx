import React from 'react';
import '../styles/UserBar.css';
import Color, {ColorPresets} from '../utils/Color';
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
        let colors = this.generateColors(nicknames, props.users);

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

    generateColors(nicknames: Array<string>, names: Array<string>): Array<Color> {
        let colorAssignments: {[name: string]: Color} = {};
        let nickToColor: {[nickname: string]: Array<Color>} = {};

        nicknames.forEach((nickName: string, idx: number) => {
            let name = names[idx];
            if (colorAssignments[name] !== undefined) {
                return;
            }

            if (nickToColor[nickName] === undefined ||
                    nickToColor[nickName].length === ColorPresets.length) {
                let randIdx = Math.round(Math.random() * (ColorPresets.length - 1));
                let choice = ColorPresets[randIdx];
                if (idx > 0 && colorAssignments[names[idx - 1]] === choice) {
                    // Try once to not use the same colors for successive users
                    randIdx = Math.round(Math.random() * (ColorPresets.length - 1));
                    choice = ColorPresets[randIdx];
                }
                nickToColor[nickName] = [choice];
                colorAssignments[name] = ColorPresets[randIdx];
                return;
            }

            while (true) {
                let randIdx = Math.round(Math.random() * (ColorPresets.length - 1));
                let choice = ColorPresets[randIdx];
                if (nickToColor[nickName].indexOf(choice) === -1) {
                    nickToColor[nickName].push(choice);
                    colorAssignments[name] = choice;
                    return;
                }
            }
        });

        return names.map((name) => colorAssignments[name]);
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
import React from 'react';

interface Props {
    text: string
};

interface State {
    text: Array<string>
}


export default class UnorderedListBlock extends React.Component<Props, State> {

    LEVELS = {
        1: '-',
        2: '+',
        3: '*'
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            text: this.splitIntoLevels(props.text)
        }
    }

    splitIntoLevels(text: string): Array<string> {
        var splitText: Array<string> = [];
        text.split(this.LEVELS[1]).forEach((level1) => {
            level1 = level1.trim();
            if (level1.length === 0) {
                return;
            }

            splitText.push(level1);
            // var level1Components = [];

            // level1.split(this.LEVELS[2]).forEach((level2) => {
            //     level2 = level2.trim();
            //     if (level2.length === 0) {
            //         return;
            //     }
            //     var level2Components = [];

            //     level2.split(this.LEVELS[3]).forEach((level3) => {
            //         level2Components.push(level3);      
            //     });

            //     level1Components.push(level2Components);
            // });
            
            // splitText.push(level1Components);
        });

        return splitText;
    }

    renderHeading(text: Array<string>): JSX.Element {
        return (
            <ul>
            {
                text.map((level1ListElement, idx) => {
                    return (<li key={idx.toString()}>{level1ListElement}</li>)
                })
            }
            </ul>
        )
    }

    render() {
        return (
            <div className="UnorderedListBlock">
                {this.renderHeading(this.state.text)}
            </div>
        )
    }
}
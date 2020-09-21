import React from 'react';
import '../styles/OrderedListBlock.css';


interface Props {
    text: string
};

interface State {
    text: Array<string>
};


export default class OrderedListBlock extends React.Component<Props, State> {

    LEVELS = {
        1: /\d\.\s*(.*)/,
        2: /[a-z]\)\s*(.*)/,
        3: /[i|v|x|l|c|d|m]+\.\s*(.*)/
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            text: this.splitIntoLevels(props.text)
        };
    }

    splitIntoLevels(text: string): Array<string> {
        var splitText: Array<string> = [];
        text.split(this.LEVELS[1]).forEach((level1) => {
            level1 = level1.trim();
            if (level1.length === 0) {
                return;
            }

            splitText.push(level1);
        });

        return splitText;
    }

    renderHeading(text: Array<string>): JSX.Element {
        return (
            <ol>
            {
                text.map((level1ListElement, idx) => {
                    return (<li key={idx.toString()}>{level1ListElement}</li>)
                })
            }
            </ol>
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
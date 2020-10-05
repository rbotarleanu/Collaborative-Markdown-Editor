import React from 'react';
import '../styles/OrderedListBlock.css';
import PlainTextBlock from './PlainTextBlock';


class ListElement {
    level: number;
    value: string;

    constructor(level: number, value: string) {
        this.level = level;
        this.value = value;
    }
};

type NestedList = Array<ListElement>;

interface Props {
    text: string
};

interface State {
    text: NestedList
};


export default class OrderedListBlock extends React.Component<Props, State> {

    LEVELS = {
        1: /\d\./,
        2: /[a-z]\)/,
        3: /[i|v]+\./
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            text: this.splitIntoLevels(props.text)
        };
    }


    componentDidUpdate(prevProps: Props) {
        if (prevProps.text !== this.props.text) {
            this.setState({text: this.splitIntoLevels(this.props.text)});
        }
    }


    splitIntoLevels(text: string): NestedList {
        var splitText: NestedList = [];
        text.split(this.LEVELS[1]).map((s) => s.trim()).forEach((level1) => {
            if (level1.length === 0) {
                return;
            }

            let level2Components = level1.split(this.LEVELS[2]);
            level2Components = level2Components
                .map((text) => text.trim())
                .filter((text) => text.length > 0);
            splitText.push(new ListElement(1, level2Components[0]));

            for (var i = 1; i < level2Components.length; i++) {
                let level2 = level2Components[i];
                let level3Components = level2.split(this.LEVELS[3]);
                level3Components = level3Components
                    .map((text) => text.trim())
                    .filter((text) => text.length > 0);
    
                splitText.push(new ListElement(2, level3Components[0]));
    
                for (var j = 1; j < level3Components.length; j++) {
                    let level3 = level3Components[j];
                    splitText.push(new ListElement(3, level3));
                }
            }
        });

        return splitText;
    }

    renderHeading(text: NestedList): JSX.Element {
        return (
            <ol>
            {
                text.map((component, idx) => {
                    let key = idx.toString();
                    switch (component.level) {
                        case 1:
                            return (
                                <li key={key}>
                                    <PlainTextBlock
                                        text={component.value}
                                    />
                                </li>
                            );
                        case 2:
                            return (
                                <ol key={"2-" + key}>
                                    <li key={key}>
                                        <PlainTextBlock
                                            text={component.value}
                                        />
                                    </li>
                                </ol>
                            );
                        default:
                            return (
                                <ol key={"23-" + key}>
                                    <ol key={"3-" + key}>
                                        <li key={key}>
                                             <PlainTextBlock
                                                text={component.value}
                                            />
                                        </li>
                                    </ol>
                                </ol>
                            );
                    }
                })
            }
            </ol>
        )
    }

    render() {
        return (
            <div className="OrderedListBlock">
                {this.renderHeading(this.state.text)}
            </div>
        )
    }
}
import React from 'react';

interface Props {
    text: string
};

interface State {
    text: string
};


export default class PlainTextBlock extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            text: props.text
        };
    }

    render() {
        return (
            <div className="PlainTextBlock">
                {this.state.text}
            </div>
        )
    }
}
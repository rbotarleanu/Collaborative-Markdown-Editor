import React from 'react';
import PlainTextBlock from './PlainTextBlock';


interface Props {
    text: string,
    headingLevel: number
};

interface State {
    text: string,
    headingLevel: number
};


export default class HeadingBlock extends React.Component<Props, State> {

    private PREFIXES: {[headingLevel: number]: string} = {
        1: '#',
        2: '##',
        3: '###',
        4: '####',
        5: '#####'
    };

    
    constructor(props: Props) {
        super(props);

        this.state = this.makeState(props);
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.text !== this.props.text) {
            this.setState(this.makeState(this.props));
        }
    }

    makeState(props: Props): State {
        return {
            text: this.stripPrefix(props.text, props.headingLevel),
            headingLevel: props.headingLevel
        };
    }
    stripPrefix(text: string, headingLevel: number) {
        let prefixIndex = text.indexOf(this.PREFIXES[headingLevel]);
        let prefixEnd = prefixIndex + this.PREFIXES[headingLevel].length;
        return text.substring(prefixEnd, text.length);
    }

    renderHeading(text: string, headingLevel: number) {
        switch(headingLevel) {
            case 1:
                return (<h1><PlainTextBlock text={text} /></h1>)
            case 2:
                return (<h2><PlainTextBlock text={text} /></h2>)
            case 3:
                return (<h3><PlainTextBlock text={text} /></h3>)
            case 4:
                return (<h4><PlainTextBlock text={text} /></h4>)
            default:
                return (<h5><PlainTextBlock text={text} /></h5>)
        }
    }

    render() {
        return (
            <div className="HeadingBlock">
                {this.renderHeading(this.state.text, this.state.headingLevel)}
            </div>
        )
    }
}
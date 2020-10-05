import React from 'react';
import '../styles/ImageBlock.css';


interface Props {
    text: string
};

interface State {
    text: string,
    url: string
};


export default class ImageBlock extends React.Component<Props, State> {

    private urlRegex = /\[(.*)]\((.*)\)/;

    constructor(props: Props) {
        super(props);
        this.state = this.makeState(props);
    }

    makeState(props: Props): State {
        let parsedText = this.parseText(props.text);
        return {
            text: parsedText.text,
            url: parsedText.url
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.text !== this.props.text) {
            this.setState(this.makeState(this.props));
        }
    }

    private sanitizeUrl(url: string): string {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "http://" + url;
        }

        return url;
    }

    private parseText(text: string): {url: string, text: string} {
        let match = text.match(this.urlRegex);

        if (!match || match.length !== 3) {
            return {text: "", url: ""};
        }

        return {
            text: match[2],
            url: this.sanitizeUrl(match[1])
        };
    }

    render() {
        return (
            <div className="ImageBlock">
                <img src={this.state.url} alt={this.state.text}/>
            </div>
        )
    }
}
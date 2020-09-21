import React from 'react';

interface Props {
    text: string
};

interface State {
    text: string,
    url: string
};


export default class HrefBlock extends React.Component<Props, State> {

    private urlRegex = /\[(.*)]\((.*)\)/;

    constructor(props: Props) {
        super(props);
        let parsedText = this.parseText(props.text);

        this.state = {
            text: parsedText.text,
            url: parsedText.url
        };
    }

    private sanitizeUrl(url: string): string {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "http://" + url;
        }

        return url;
    }

    private parseText(text: string): {url: string, text: string} {
        let match = text.match(this.urlRegex);

        if (!match || match.length != 3) {
            return {text: "", url: ""};
        }

        return {
            text: match[1],
            url: this.sanitizeUrl(match[2])
        };
    }

    render() {
        return (
            <div className="PlainTextBlock">
                <a href={this.state.url}>{this.state.text}</a>
            </div>
        )
    }
}
import React from 'react';
import '../styles/CollaborateMenu.css';
import Button from 'react-bootstrap/Button';

interface Props {
    notifyEditClose: () => void,
    shareableUrl: string 
};

interface State {
    shareableUrl: string
};

export default class CollaborateMenu extends React.Component<Props, State> {

    private notifyEditClose: () => void;
    private textAreaRef: HTMLTextAreaElement | null;

    constructor(props: Props) {
        super(props);

        this.state = {
            shareableUrl: props.shareableUrl
        };

        this.notifyEditClose = props.notifyEditClose;
        this.textAreaRef = null;
    }

    private handleCopyToClipboard() {
        if (!this.textAreaRef) {
            return;
        }

        this.textAreaRef.select();
        document.execCommand("copy");
    }

    render() {
        return (
            <div className="CollaborateMenu" id="collaborateMenu">
                <span>Send your collaborators this link:</span>
                <textarea
                    rows={1}
                    ref={(ref) => {this.textAreaRef = ref}}
                    onChange={() => {}}
                    value={this.state.shareableUrl}
                    onClick={() => {
                        if (this.textAreaRef) {
                            this.textAreaRef.setSelectionRange(
                                0, this.state.shareableUrl.length);
                        }
                    }}
                />
                <Button
                        variant="secondary"
                        onClick={() => {this.notifyEditClose()}}>
                            Ok
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {this.handleCopyToClipboard()}}>
                        Copy to clipboard
                </Button>
            </div>
        )
    }
}
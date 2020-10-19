import React from 'react';
import '../styles/MarkdownBlock.css';
import RenderableMarkdownBlock from './RenderableMarkdownBlock';
import Color from '../utils/Color';


import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';


type CursorPosition = {
    block: number,
    start: number,
    end: number
};

type Cursors = {
    [user: string]: {
        [block: string]: {
            start: number,
            end: number
        }
    }
};

type SelectionRange = {
    selectionStart: number,
    selectionEnd: number
};

type updateBlockInfoFn = (
    blockId: number, text: string,
    selectionStart: number, selectionEnd: number) => void;

interface State {
    text: string,
    inFocus: boolean,
    cursorPos: {x: number, y: number},
    lastKeyPressed: string,
    lastKeyPressTime: number,
    cursors: Cursors,
    colorAssignments: {[user: string]: Color}
};

interface Props {
    text: string,
    id: number,
    notifyFocus: (id: number) => void
    updateBlockInfo: updateBlockInfoFn,
    switchFocusToNextBlock: (id: number, reverse?: boolean) => void,
    cursors: Cursors,
    colorAssignments: {[user: string]: Color}
};

export default class MarkdownBlock extends React.Component<Props, State> {

    private notifyInFocus: (id: number) => void;
    private switchFocusToNextBlock: (id: number, reverse?: boolean) => void;
    private updateBlockInfo: updateBlockInfoFn;
    private id: number;
    private textAreaRef: typeof ContentEditable | null;
    private _isMounted: boolean = false;
    private HOTKEY_DELTA = 2000;
    private textAreaInnerRef: React.RefObject<HTMLElement>;

    constructor(props: Props) {
        super(props);
        this.state = {
            text: props.text,
            inFocus: false,
            cursorPos: {x: 0, y: 0},
            lastKeyPressTime: 0,
            lastKeyPressed: "",
            cursors: this.selectCorrespondingCursors(props.cursors, props.id),
            colorAssignments: props.colorAssignments
        };

        this.notifyInFocus = props.notifyFocus;
        this.updateBlockInfo = props.updateBlockInfo;
        this.switchFocusToNextBlock = props.switchFocusToNextBlock;
        this.id = props.id;
        this.textAreaRef = null;
        this.textAreaInnerRef = React.createRef();
    }

    selectCorrespondingCursors(cursors: Cursors, id: number) {
        let usersOnBlock: Array<string> = [];
        let relevantCursors: Cursors = {};
        let idStr = id.toString();
        Object.keys(cursors).map((user: string) => {
            if (user === 'self' || cursors[user][idStr] === undefined) {
                return null;
            }

            usersOnBlock.push(user);
            return null;
        });

        usersOnBlock.map((user: string) => {
            relevantCursors[user] = {...cursors[user]};
            return null;
        });

        return relevantCursors;
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.text !== this.props.text ||
            prevProps.cursors !== this.props.cursors) {
            this.setState({
                text: this.props.text,
                cursors: this.selectCorrespondingCursors(
                    this.props.cursors, this.props.id)
            });
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange(e: ContentEditableEvent) {
        if (!e.target) {
            return;
        }

        // We don't need to update the block info here since a selection event
        // is also triggered.
        this.setState({ text: e.target.value });
    }

    public handleOnFocus(cursorPosition: number = 0) {
        this.notifyInFocus(this.id);
        this.setState({ inFocus: true });
        cursorPosition = cursorPosition >= 0 ? cursorPosition : this.state.text.length;
        requestAnimationFrame(() => {
            if (this.textAreaRef) {
                if (!this.textAreaInnerRef.current) {
                    return;
                }
                
                let childEl: ChildNode;
                if (cursorPosition === this.state.text.length) {
                    if (!this.textAreaInnerRef.current.lastChild) {
                        return;
                    }

                    childEl = this.textAreaInnerRef.current.lastChild;
                } else {
                    if (!this.textAreaInnerRef.current.firstChild) {
                        return;
                    }

                    childEl = this.textAreaInnerRef.current.firstChild;
                }

                this.textAreaInnerRef.current.focus();
                let range = document.createRange();
                range.setStart(childEl, cursorPosition);
                range.setEnd(childEl, cursorPosition);
                window.getSelection()?.removeAllRanges();
                window.getSelection()?.addRange(range);
            }
        });
    }

    private getEditableSelectionRange(): SelectionRange {
        let selection = window.getSelection();
        let selectionStart = 0;
        let selectionEnd = 0;

        if (selection !== null) {
            selectionStart = selection.anchorOffset;
            selectionEnd = selection.focusOffset;
        }
        
        return {
            selectionStart: selectionStart,
            selectionEnd: selectionEnd
        };
    }

    private handleSelect(e: React.SyntheticEvent) {
        let selectionRange = this.getEditableSelectionRange();
        this.updateBlockInfo(
            this.id, this.state.text,
            selectionRange.selectionStart, selectionRange.selectionEnd);
    }

    public handleOffFocus() {
        if (this._isMounted) {
            this.setState({ inFocus: false });
        }
    }

    private handleEditorKeyPress(e: React.KeyboardEvent) {
        let newState = {...this.state};
        newState.lastKeyPressTime = e.timeStamp;
        newState.lastKeyPressed = e.key;
        var selectionRange: SelectionRange; 
        switch(e.key) {
            case "Escape":
                newState.inFocus = false;
                break;
            case "Enter":
                // Since we are monitoring key up events events in shift+enter
                // the enter key up event happens first
                if (this.state.lastKeyPressed === 'Shift' &&
                    e.timeStamp - this.state.lastKeyPressTime < this.HOTKEY_DELTA) {
                    newState.inFocus = false;
                    this.switchFocusToNextBlock(this.id);
                }
                break;
            case 'ArrowRight':
                selectionRange = this.getEditableSelectionRange();
                if (selectionRange.selectionEnd === this.state.text.length) {
                    newState.inFocus = false;
                    this.switchFocusToNextBlock(this.id);
                }
                break;
            case 'ArrowLeft':
                selectionRange = this.getEditableSelectionRange();
                if (selectionRange.selectionStart === 0) {
                    newState.inFocus = false;
                    this.switchFocusToNextBlock(this.id, true);
                }
                break;
            default:
                break;
        }

        this.setState(newState);
    }

    private makeColoredContentEditableText(): string {
        let indexColors: {[index: number]: Color} = {};
        let idStr = this.id.toString();

        Object.keys(this.state.cursors).forEach((user: string) => {
            let selection = this.state.cursors[user][idStr];
            let color = this.state.colorAssignments[user];

            for (var i = selection.start; i <= selection.end; ++i) {
                indexColors[i] = color;
            }
        });

        let i = 0;
        let formattedText = "";
        while (i < this.state.text.length) {
            if (indexColors[i] === undefined) {
                formattedText += this.state.text[i];
                i += 1;
                continue;
            }

            let j = i + 1;
            let color = indexColors[i];
            while (j < this.state.text.length) {
                if (indexColors[i] === indexColors[j]) {
                    j += 1;
                } else {
                    break;
                }
            }

            formattedText += "<span style=\"color:" + color.getRGB() +  "\">";
            formattedText += this.state.text.substr(i, j - i);
            formattedText += "</span>";
            i = j;
        }

        return formattedText;
    }

    render() {
        return (
            <div className="MarkdownBlock">
                {this.state.inFocus && 
                    <ContentEditable
                        html={this.makeColoredContentEditableText()}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (!this.state.inFocus) {
                                this.handleOnFocus();
                            }
                        }}
                        onChange={(e) => {this.handleChange(e);}}
                        onSelect={(e) => {this.handleSelect(e);}}
                        onKeyDown={(e) => {this.handleEditorKeyPress(e);}}
                        ref={(ref: any) => this.textAreaRef=ref as typeof ContentEditable}
                        innerRef={this.textAreaInnerRef}
                    />
                }
                {!this.state.inFocus &&
                    <RenderableMarkdownBlock
                        text={this.state.text}
                        onFocus={() => this.handleOnFocus()}
                    />
                }
            </div>
        )
    }
}
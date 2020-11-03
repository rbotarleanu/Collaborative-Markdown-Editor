import React from 'react';
import '../styles/MarkdownBlock.css';
import RenderableMarkdownBlock from './RenderableMarkdownBlock';
import Color from '../utils/Color';

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

let COLOR_SPAN_START_REGEX = /(<span style="background-color:rgb\(\d+,\d+,\d+\)">)/g;
let SPAN_START_REGEX = /(<span>)/g;
let SPAN_STOP_REGEX = /<\/span>/g;

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
    colorAssignments: {[user: string]: Color},
    activeUsers: Array<string>,
    userColors: Array<Color>
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

        let cursors = this.selectCorrespondingCursors(props.cursors, props.id);
        let users = Object.keys(cursors);
        let userColors = users.map((user: string) => props.colorAssignments[user]);

        this.state = {
            text: props.text.trim(),
            inFocus: false,
            cursorPos: {x: 0, y: 0},
            lastKeyPressTime: 0,
            lastKeyPressed: "",
            cursors: cursors,
            colorAssignments: props.colorAssignments,
            activeUsers: users,
            userColors: userColors
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
                text: this.props.text.trim(),
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
    
    private getSelectionContainerElement() {
        var range, sel, container;

        sel = window.getSelection();

        if (!sel) {
            return null;
        }

        if (sel.getRangeAt) {
            if (sel.rangeCount > 0) {
                range = sel.getRangeAt(0);
            }
        } else {
            // Old WebKit selection object has no getRangeAt, so
            // create a range from other selection properties
            range = document.createRange();

            if (sel.anchorNode) {
                range.setStart(sel.anchorNode, sel.anchorOffset);
            }
            if (sel.focusNode) {
                range.setEnd(sel.focusNode, sel.focusOffset);
            }

            // Handle the case when the selection was selected backwards (from the end to the start in the document)
            if (range.collapsed !== sel.isCollapsed) {
                if (sel.focusNode) {
                    range.setStart(sel.focusNode, sel.focusOffset);
                }
                if (sel.anchorNode) {
                    range.setEnd(sel.anchorNode, sel.anchorOffset);
                }
            }
        }

        if (range) {
            container = range.commonAncestorContainer;

            // Check if the container is a text node and return its parent if so
            return container.nodeType === 3 ? container.parentNode : container;
        }   
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
                if (cursorPosition > 0) {
                    if (!this.textAreaInnerRef.current.lastChild) {
                        return;
                    }

                    childEl = this.textAreaInnerRef.current.lastChild;

                    if (childEl.firstChild?.nodeValue) {
                        cursorPosition = childEl.firstChild.nodeValue.length;
                    }
                } else {
                    if (!this.textAreaInnerRef.current.firstChild) {
                        return;
                    }

                    childEl = this.textAreaInnerRef.current.firstChild;
                }
                
                this.setCursorAtPosition(childEl, cursorPosition);
            }
        });
    }

    private setCursorAtPosition(childEl: Node, cursorPosition: number) {
        if (!childEl || !this.textAreaInnerRef.current) {
            return;
        }

        this.textAreaInnerRef.current.focus();
        let range = document.createRange();
        if (childEl.firstChild) {
            childEl = childEl.firstChild;
        }

        range.setStart(childEl, cursorPosition);
        range.setEnd(childEl, cursorPosition);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
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

    private removeStylingFromText(text: string): string {
        return text.replace(SPAN_START_REGEX, "")
                   .replace(SPAN_STOP_REGEX, "")
                   .replace(COLOR_SPAN_START_REGEX, "");
    }

    private handleEditorKeyPress(e: React.KeyboardEvent) {
        let newState = {...this.state};
        newState.lastKeyPressTime = e.timeStamp;
        newState.lastKeyPressed = e.key;
        var selectionRange: SelectionRange; 
        var childNode: Node | null | undefined;
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
                childNode = this.getSelectionContainerElement();
                if (childNode === this.textAreaInnerRef.current?.lastChild &&
                        childNode && childNode.firstChild &&
                        selectionRange.selectionStart === childNode.firstChild.nodeValue?.length) {
                    newState.inFocus = false;
                    this.switchFocusToNextBlock(this.id);
                }
                break;
            case 'ArrowLeft':
                selectionRange = this.getEditableSelectionRange();
                childNode = this.getSelectionContainerElement();
                if (childNode === this.textAreaInnerRef.current?.firstChild &&
                        selectionRange.selectionStart === 0) {
                    newState.inFocus = false;
                    this.switchFocusToNextBlock(this.id, true);
                }
                break;
            default:
                break;
        }

        this.setState(newState);
    }

    private addColorStylingToText(text: string): string {
        if (text.indexOf('<span>') !== -1) {
            return text;
        }

        let indexColors: {[index: number]: Color} = {};
        let idStr = this.id.toString();

        Object.keys(this.state.cursors).forEach((user: string) => {
            let selection = this.state.cursors[user][idStr];
            let color = this.state.colorAssignments[user];

            for (var i = selection.start; i <= selection.end; ++i) {
                if (indexColors[i] === undefined) {
                    indexColors[i] = color;
                } else {
                    indexColors[i] = indexColors[i].combine(color);
                }
            }
        });

        let i = 0;
        let formattedText = "<span>";
        let previousColor: Color | null = null;
        // let formattedText = "";
        let inTextBlock = true;
        while (i < text.length) {
            if (indexColors[i] === undefined) {
                if (!inTextBlock) {
                    inTextBlock = true;
                    formattedText += "</span><span>";
                }
                formattedText += text[i];
                i += 1;
                continue;
            }

            inTextBlock = false;
            let j = i + 1;
            let color = indexColors[i];
            while (j < text.length) {
                if (indexColors[i] === indexColors[j]) {
                    j += 1;
                } else {
                    break;
                }
            }

            if (!previousColor || previousColor !== color) {
                formattedText += "</span>";
                formattedText += "<span style=\"background-color:" + color.getRGB() +  "\">";
                formattedText += text.substr(i, j - i);
            } else {
                formattedText += text.substr(i, j - 1);
            }
            previousColor = color;
            i = j;
        }
        formattedText += "</span>";

        return formattedText;
    }

    render() {
        return (
            <div className="MarkdownBlock">
                <div className="ActiveUsers">
                    {this.state.activeUsers.map((user: string, idx: number) => {
                        return (
                            <span
                                key={"active-user-" + idx}
                                style={{color: this.state.userColors[idx].getRGB()}}
                            >
                                {"|"}
                            </span>
                        );
                    })}
                </div>
                <div className="Content">
                    {this.state.inFocus && 
                        <ContentEditable
                            html={this.addColorStylingToText(this.state.text)}
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
            </div>
        )
    }
}
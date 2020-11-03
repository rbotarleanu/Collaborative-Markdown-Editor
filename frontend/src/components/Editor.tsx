import React from 'react';
import '../styles/Editor.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MarkdownBlock from './MarkdownBlock';
import { interpretBlockType } from '../utils/MarkdownBlockMatching';
import { MarkdownBlockTypes } from '../utils/MarkdownBlockTypes';
import CollaborateMenu from './CollaborateMenu';
import UserBar from './UserBar';
import Button from 'react-bootstrap/Button';
import FileSaver from 'file-saver';
import Color, {ColorPresets} from '../utils/Color';
import BackendUtils from '../utils/BackendUtils';


interface Props {
    text: string
};

type Cursors = {
    [user: string]: {
        [block: string]: {
            start: number,
            end: number
        }
    }
}

type MarshalledEditorState = {
    paragraphs: Array<string>
    cursors: Cursors
};

export type EditorState = {
    editorState: MarshalledEditorState, 
    documentId: string
};

interface State {
    paragraphs: Array<string>,
    cursors: Cursors,
    selectedFile: File | null,
    showCollaborateMenu: boolean,
    users: Array<string>,
    userColors: Array<Color>,
    documentId: string
};

class TextBlock {
    text: string;
    blockType: number;

    constructor(text: string, blockType: number) {
        this.text = text;
        this.blockType = blockType;
    }
};


export default class Editor extends React.Component<Props, State> {

    private blockRefs: { [ref: number]: MarkdownBlock };
    private DUMMY_BLOCK = "Click here to edit...";
    private userBarRef: UserBar | null;
    private backendUtils = new BackendUtils();

    constructor(props: Props) {
        super(props);
        var documentBlocks = this.splitDocumentIntoBlocks(props.text);
        documentBlocks.push(this.DUMMY_BLOCK);

        let users: Array<string> = [];

        this.state = {
            paragraphs: documentBlocks,
            cursors: {
                self: {
                    '-1': { start: -1, end: -1 }
                }
            },
            selectedFile: null, 
            showCollaborateMenu: false,
            users: users,
            documentId: "some-room",
            userColors: this.generateColors(users)
        };

        this.blockRefs = {};
        this.userBarRef = null;
    }

    private splitDocumentIntoBlocks(doc: string): Array<string> {
        var newlineBlocks: Array<TextBlock> = [];
        var mergedBlocks: Array<string> = [];
        
        doc.split('\n').forEach((block) => {
            if (block.trim().length === 0) {
                return;
            }

            let blockType = interpretBlockType(block);
            newlineBlocks.push(new TextBlock(block, blockType));
        });

        // If possible, try to merge consecutive blocks of these types
        let mergeableBlockTypes: Array<number> = [
            MarkdownBlockTypes.PLAIN_TEXT,
            MarkdownBlockTypes.ORDERED_LIST,
            MarkdownBlockTypes.UNORDERED_LIST,
            MarkdownBlockTypes.TABLE
        ];
        for (var i = 0; i < newlineBlocks.length; ++i) {
            if (mergeableBlockTypes.indexOf(newlineBlocks[i].blockType) === -1) {
                mergedBlocks.push(newlineBlocks[i].text);
                continue;
            }
            
            if (i === 0 || newlineBlocks[i - 1].blockType !== newlineBlocks[i].blockType) {
                mergedBlocks.push(newlineBlocks[i].text);
            } else {
                mergedBlocks[mergedBlocks.length - 1] += '\n' + newlineBlocks[i].text;
            }
        }

        return mergedBlocks;
    }

    private generateColors(names: Array<string>): Array<Color> {
        let colorAssignments: {[name: string]: Color} = {};
        let colorToNames: {[color: string]: string} = {};

        names.forEach((name: string, idx: number) => {
            if (colorAssignments[name] !== undefined) {
                return;
            }

            for (idx = 0; idx < ColorPresets.length; ++idx) {
                let choice = ColorPresets[idx];
                if (colorToNames[choice.getRGB()] === undefined) {
                    colorAssignments[name] = choice;
                    colorToNames[choice.getRGB()] = name;
                    break;
                }
            }
        });

        return names.map((name) => colorAssignments[name]);
    }

    private getColorAssignments(): {[name: string]: Color} {
        let colorAssignments: {[name: string]: Color} = {};

        this.state.users.map((name: string, idx: number) => {
            colorAssignments[name] = this.state.userColors[idx];
            return null;
        });

        return colorAssignments;
    }

    private cleanUpParagraphs(paragraphs: Array<string>, focusedBlockIdx: number): Array<string> {
        // Remove empty blocks
        paragraphs = paragraphs.filter(
            (block) => block.trim().length !== 0);

        // If there is more than 1 dummy block near the end, we remove redundant ones
        var numDummyBlocks = 0;
        for (var i = paragraphs.length - 1; i >= 0; --i) {
            if (paragraphs[i] !== this.DUMMY_BLOCK) {
                break;
            }

            numDummyBlocks += 1;
        }
        if (numDummyBlocks > 0) {
            paragraphs.splice(
                paragraphs.length - numDummyBlocks,
                numDummyBlocks);
        }

        // A single dummy block is always shown at the end of the document
        paragraphs.push(this.DUMMY_BLOCK);

        return paragraphs;
    }

    private handleSwitchToNextFocusBlock(currentBlockIdx: number, reverse: boolean = false): void {
        var newState = {...this.state};
        newState.paragraphs = this.cleanUpParagraphs(newState.paragraphs,
                                                     currentBlockIdx);
        let nextBlock = currentBlockIdx + (reverse ? -1 : 1);
        let cursorPos = reverse ? -1 : 0;

        this.setState(newState);
        requestAnimationFrame(() => {
            if (this.blockRefs[nextBlock]) {
                this.blockRefs[nextBlock].handleOnFocus(cursorPos);
            }
        });
    }

    private handleBlockFocus(focusedBlockIdx: number): void {
        Object.keys(this.blockRefs).forEach((idx: string) => {
            let idxToNum = parseInt(idx);
            if (idxToNum === focusedBlockIdx) {
                return;
            }

            if (this.blockRefs && this.blockRefs[idxToNum]) {
                this.blockRefs[idxToNum].handleOffFocus();
            }
        });

        var newState = {...this.state};
        newState.paragraphs = this.cleanUpParagraphs(newState.paragraphs, focusedBlockIdx);
        let numStr = focusedBlockIdx.toString();

        newState.cursors.self = {};
        newState.cursors.self[numStr] = {
            start: -1,
            end: -1
        };
    
        this.setState(newState);
    }

    private updateBlockInformation(blockId: number, text: string,
                                  selectionStart: number,
                                  selectionEnd: number): void {
        var newState = this.state;
        newState.paragraphs[blockId] = text;
        let blockIdStr = blockId.toString();
        
        newState.cursors.self = {};
        newState.cursors.self[blockIdStr] = {
            start: selectionStart,
            end: selectionEnd
        };
        this.setState(newState);
    }

    private onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target || !e.target.files || e.target.files.length === 0) {
            return;
        }

        this.setState({
            selectedFile: e.target.files[0]
        });
    }

    private handleExport() {
        let text = this.state.paragraphs
            .slice(0, this.state.paragraphs.length - 1)
            .join("\n");
        let data = new Blob([text], {type: "text/markdown"});
        FileSaver.saveAs(data, "README.md");
    }

    private notifyEditClose() {
        requestAnimationFrame(() => {
            this.setState({showCollaborateMenu: false})}
        );
    }

    private handleCollaborate() {
        requestAnimationFrame(() => {
            this.setState({showCollaborateMenu: true})}
        );
    }

    private marshallEditorState(): EditorState {
        let editorState = {
            documentId: this.state.documentId,
            editorState: {
                cursors: this.state.cursors,
                paragraphs: this.state.paragraphs,
            }
        };

        this.backendUtils.pushEditorState(editorState);
        return editorState;
    }

    private updateEditorState(editorState: EditorState) {
        this.setState({
            paragraphs: editorState.editorState.paragraphs,
            cursors: editorState.editorState.cursors
        });
    }

    render() {
        return (
            <div className="Editor" id="editor"
                    onClick={(e) => this.handleBlockFocus(-1) }>
                <div className="Toolbar">
                    <Button
                        variant="secondary"
                        onClick={() => this.handleExport()}>
                            Export
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => this.handleCollaborate()}
                    >
                        Collaborate
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => this.marshallEditorState()}
                    >
                        Serialize
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            let editorState = this.backendUtils.getEditorState(
                                this.state.documentId);
                            editorState.then((editorStateResponse) => {
                                let editorState = editorStateResponse.data;
                                this.updateEditorState(editorState);
                            });
                        }}
                    >
                        Deserialize
                    </Button>
                    <UserBar
                        users={this.state.users}
                        colors={this.state.userColors}
                    />
                </div>
                {this.state.showCollaborateMenu && (
                    <CollaborateMenu
                        notifyEditClose={() => this.notifyEditClose()}
                        shareableUrl="dummy link" 
                    />
                )}
                <div className="TextBlocks">
                    {
                        this.state.paragraphs.map((paragraph, idx) => {
                            return (
                                <MarkdownBlock
                                    text={paragraph}
                                    id={idx}
                                    key={idx}
                                    notifyFocus={(id: number) => this.handleBlockFocus(id)}
                                    switchFocusToNextBlock={(id: number, reverse: boolean = false) =>
                                        this.handleSwitchToNextFocusBlock(id, reverse)}
                                    updateBlockInfo={
                                        (blockId: number, text: string, selectionStart: number, selectionEnd: number) =>
                                        this.updateBlockInformation(blockId, text, selectionStart, selectionEnd)
                                    }
                                    cursors={this.state.cursors}
                                    colorAssignments={this.getColorAssignments()}
                                    ref={(ref) => {
                                        if (ref) {
                                            this.blockRefs[idx]=ref
                                        }
                                    }}
                                /> 
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
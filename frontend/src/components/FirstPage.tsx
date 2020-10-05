import React from 'react';
import '../styles/Editor.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/FirstPage.css';
import Button from 'react-bootstrap/Button';


interface Props {
    initializeEditor: (text: string) => void
};
interface State {
    selectedFile: File | null,
    initializeEditor: (text: string) => void
};


export default class FirstPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        // PROD
        // this.state = {
        //     selectedFile: null,
        //     initializeEditor: props.initializeEditor
        // };

        // DEBUG
        var sampleText = require('../utils/SampleText.js').sampleText;
        this.state = {
            selectedFile: new File([sampleText], "sample_document.md", {type: "text/markdown"}),
            initializeEditor: props.initializeEditor
        };
        requestAnimationFrame(() => {this.handleStartButton()});
    }

    private onFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
        if (!e.target || !e.target.files || e.target.files.length === 0) {
            return;
        }

        this.setState({selectedFile: e.target.files[0]});
    }

    private handleStartButton(): void {
        if (this.state.selectedFile) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                e.preventDefault();
                if (!e.target || !e.target.result || typeof e.target.result !== 'string') {
                    this.state.initializeEditor("");
                    return;
                }
                this.state.initializeEditor(e.target.result); 
            };

            reader.readAsText(this.state.selectedFile);
        } else {
            this.state.initializeEditor("");
        }
    }

    render() {
        return (
            <div className="FirstPage" id="frontPage">
                <span>(Optional) Select a markdown file:</span>
                <input type="file" onChange={(e) => {this.onFileChange(e)}}/>
                <Button variant="outline-primary"
                    onClick={() => {this.handleStartButton()}}>Go!</Button>
            </div>
        )
    }
}
import React from 'react';
import { First } from 'react-bootstrap/lib/Pagination';
import Editor from './Editor';
import FirstPage from './FirstPage';
import '../styles/MainPage.css';


interface Props {
};

interface State {
    initialized: boolean,
    text: string
};


export default class MainPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            initialized: false,
            text: ""
        };
    }

    render() {
        return (
            <div className="MainPage" id="mainPage">
                {!this.state.initialized && (
                    <FirstPage
                        initializeEditor={(text) => {
                            this.setState({
                                initialized: true,
                                text: text
                            });
                        }}
                    />
                )}
                {this.state.initialized && (
                    <Editor
                        text={this.state.text}
                    />
                )}
            </div>
        )
    }
}
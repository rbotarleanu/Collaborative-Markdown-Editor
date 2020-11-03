import axios from 'axios';
import { EditorState } from '../components/Editor';
import { Constants } from './Constants';


export default class BackendUtils {

    public pushEditorState(editorState: EditorState) {
        let payloadUrl = Constants.serverUrl + Constants.pushEditorStateEndpoint;
        axios.post(payloadUrl, editorState);
    }
    
    public async getEditorState(documentId: string): Promise<any> {
        let payloadUrl = Constants.serverUrl + Constants.getEditorStateEndpoint;
        let queryParams = {"documentId": documentId};
        
        return await axios.post(payloadUrl, queryParams);
    }
}

package com.rbotarleanu.coll_md_editor;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class DocumentStateService {

    public DocumentStateService() {

    }

    @CrossOrigin(origins="http://localhost:8080")
    @RequestMapping(value="/saveEditorState", method= RequestMethod.POST)
    public @ResponseBody Map<String, Object> saveEditorState(
            @RequestBody Map<String, Object> payload) {
        if (!payload.containsKey(JSONKeyConstants.DOCUMENT_ID)
                || !payload.containsKey(JSONKeyConstants.MARSHALLED_EDITOR_STATE)) {
            return ResponseBuilder.saveEditorStateError();
        }

        String roomKey = (String) payload.get(JSONKeyConstants.DOCUMENT_ID);
        System.out.println("Document key: " + roomKey);
        Map<String, Object> editorState = new HashMap<String, Object>((Map) payload.get(
                JSONKeyConstants.MARSHALLED_EDITOR_STATE));

        return ResponseBuilder.saveEditorStateSuccess();
    }

    @CrossOrigin(origins="http://localhost:8080")
    @RequestMapping(value="/getEditorState", method=RequestMethod.GET)
    public @ResponseBody Map<String, Object> getEditorState(
            @RequestBody Map<String, Object> payload) {
        String roomKey = (String) payload.get(JSONKeyConstants.DOCUMENT_ID);
        Map<String, Object> editorState = new HashMap<>();
        editorState.put(roomKey, "This is the editor mwahaha");

        if (editorState == null) {
            return ResponseBuilder.retrieveEditorStateError();
        } else {
            return ResponseBuilder.retrieveEditorStateSuccess(editorState);
        }
    }
}

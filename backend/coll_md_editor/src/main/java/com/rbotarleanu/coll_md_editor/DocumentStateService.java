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
            @RequestBody Map<String, Object> payload) throws JsonProcessingException {
        if (!payload.containsKey(JSONKeyConstants.ROOM_ID)
                || !payload.containsKey(JSONKeyConstants.MARSHALLED_EDITOR_STATE)) {
            return ResponseBuilder.saveEditorStateError();
        }

        String roomKey = (String) payload.get(JSONKeyConstants.ROOM_ID);
        System.out.println("Room key: " + roomKey);
        Map<String, Object> editorState = new HashMap<String, Object>((Map) payload.get(
                JSONKeyConstants.MARSHALLED_EDITOR_STATE));

        return ResponseBuilder.saveEditorStateSuccess();
    }
}

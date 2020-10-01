package com.rbotarleanu.coll_md_editor;

import java.util.HashMap;
import java.util.Map;

public class ResponseBuilder {
    static Map<String, Object> saveEditorStateError() {
        Map<String, Object> mapObject = new HashMap<>();
        mapObject.put(JSONKeyConstants.ERROR, true);
        mapObject.put(JSONKeyConstants.MESSAGE, ResponseConstants.ERR_SAVE_STATE);
        return mapObject;
    }

    static Map<String, Object> retrieveEditorStateError() {
        Map<String, Object> mapObject = new HashMap<>();
        mapObject.put(JSONKeyConstants.ERROR, true);
        mapObject.put(JSONKeyConstants.MESSAGE, ResponseConstants.ERR_GET_STATE);
        return mapObject;
    }

    static Map<String, Object> retrieveEditorStateSuccess(Map<String, Object> state) {
        Map<String, Object> mapObject = new HashMap<>();
        mapObject.put(JSONKeyConstants.ERROR, false);
        mapObject.put(JSONKeyConstants.MESSAGE, ResponseConstants.OK_GET_STATE);
        mapObject.put(JSONKeyConstants.MARSHALLED_EDITOR_STATE, state);
        return mapObject;
    }

    static Map<String, Object> saveEditorStateSuccess() {
        Map<String, Object> mapObject = new HashMap<>();
        mapObject.put(JSONKeyConstants.ERROR, false);
        mapObject.put(JSONKeyConstants.MESSAGE, ResponseConstants.OK_SAVE_STATE);
        return mapObject;
    }

}

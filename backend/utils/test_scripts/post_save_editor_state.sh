#! /bin/bash

METHOD_TYPE=${2:-POST}
ENDPOINT=$1

if [ $# -lt 1 ]; then
    echo "Use: curl_post_json endpoint"
    exit 1 
fi

curl -H "Content-Type: application/json" --request $METHOD_TYPE --data \
    '{"documentId":"alpha2", "editorState":{"textBlock1": "bold", "textBlock2":
    "italic", "textBlock3": "the moment is now"}}' $ENDPOINT



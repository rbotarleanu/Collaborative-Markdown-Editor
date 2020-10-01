#! /bin/bash

if [ $# -ne 1 ]; then
    echo "Use: curl_post_json endpoint"
    exit 1 
fi

#curl -H "Content-Type: application/json" --request POST --data \
#    '{"roomId":"alpha2","state":{"textBlock1": "bold", "textBlock2": "italic", "textBlock3": "ana are mere"}}' $1

curl -H "Content-Type: application/json" --request POST --data \
    '{"roomId":"alpha2", "editorState":{"textBlock1": "bold", "textBlock2": "italic", "textBlock3": "the moment is now"}}' $1



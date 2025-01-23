#!/bin/bash

read -p "Have you remembered to start the TMA Express.js server in a seprate terminal?: (y/n) [y]" response

# Set default response to 'yes' if no input is provided
response=${response:-y}

# Check the user's response
if [[ "$response" == "n" ]]; then
    echo "You will get a 404 error when you try to access the service."
fi

echo "Setting the service address in libraries/PhotoService.ts"
SED_CMD="s|/user/USERID/|$JUPYTERHUB_SERVICE_PREFIX|g"
echo $SED_CMD

sed -i $SED_CMD "libraries/PhotoService.ts"
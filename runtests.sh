#!/bin/bash

# fetch a list of the scripts from package.json
paths=(`npm run | grep '^[[:space:]]\{2\}[a-z].'`)


shutdownWiremock () {
    # wait for wiremock to shutdown
    while curl -s -k --data "" https://localhost:8082/__admin/shutdown > /dev/null; do
        sleep 1
    done
}

for path in ${paths[@]}
do 
    echo "${path}"
    java -jar ~/Downloads/wiremock/wiremock-standalone-2.5.0.jar --https-port=8082 --root-dir ~/github/vmware-sdk-rest-mock/REST/"${path}" > /dev/null &
    # wait until wiremock has started
    until curl --fail -s -k https://localhost:8082/__admin/docs > /dev/null; do
        sleep 1
    done
    npm run "${path}"
    # if the test failed shutdown wiremock and exit
    if [ $? -ne 0 ]; then
        shutdownWiremock;
        exit $?;
    fi
    shutdownWiremock;
done

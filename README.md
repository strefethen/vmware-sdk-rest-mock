# Mocking VMware REST SDK Samples using Wiremock

Leveraging [Wiremock](http://wiremock.org/docs/running-standalone/) we can capture REST API calls to vSphere.

## Capturing API calls from an SDK Sample:

Setup Steps:

1. Download and setup the [vSphere Automation SDK for REST](https://github.com/vmware/vsphere-automation-sdk-rest) normally.
2. [Download wiremock](http://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-standalone/2.5.0/wiremock-standalone-2.5.0.jar) (java app)
3. Create a folder for wiremock output ex: ~/Downloads/wiremock_output. This is where wiremock will place it's __file and mappings folders
4. Run wiremock and capture API calls as follows:

        java -jar wiremock-standalone-2.5.0.jar --proxy-all=<vsphere-url> --https-port=8082 --verbose --root-dir ~/Downloads/wiremock_output --record-mappings

5. In settings.js use the following:

    Note: This example uses the setup testbed as created by the Python SDK setup script.

        module.exports = {
            host: 'https://localhost:8082', //No default! Please provide a value.
            username: '<username>', //username. No default! Please provide a value.
            password: '<password>', // password. No default! Please provide a value.
            ssl: false, // use strict ssl or not.. false allows you to accept all certs.
                        // NOTE: SSL should be set to true in a production environment.
            host1: '<esx-host-ip-address>',
            host2: '<esx-host-ip-address>',
            hostUsername: '<host-username>',
            hostPassword: '',
            datacenter: '<datacenter-name>', // the name of the datacenter
            datastore: '<datastore-name>', // the name of a datastore
            vmName: 'Sample Basic VM for Simple Testbed', // a name of a VM, used in some of the samples,
            isoName: 'photonOS.iso', // the name of the ISO to use as the OS when creating a VM
                        // (e.g. [datastore1] hoton-minimal-1.0TP2.iso)
            cleanup: true // true to clean up any data a sample created, false to leave it
        }

6. Run the SDK Samples

Following the recording of a sample, wiremock will have captured the results of the API calls
in two folders under the "__files" and "mappings".

## Playback of the SDK Sample using captured API calls

Included is a shell script to run all of the tests using Wiremock. The script makes the following assumptions:

* The wiremock.jar file is located in ~/Downloads/wiremock/wiremock-standalone-2.5.0.jar
* This git repostory is located at ~/github/vmware-sdk-rest-mock.

        $ ./runtests.sh

The shell script enumerates the scripts from package.json, launches wiremock pointing to the correct mappings, 
executes the node script and shutsdown wiremock for the next iteration.

1. Restart wiremock server as follows:

        java -jar wiremock-standalone-2.5.0.jar --https-port=8082 --verbose --root-dir ~/REST/<sample_name>

2. Re-run the same SDK sample which should now use the captured API calls from wiremock.

NOTE: For Python the wiremock server can proxy port 443 though on Linux/OSX it will need to be launched using sudo to bind to that port #. On Windows this means
you'll need to use either "runas" from the command line or start a Command Prompt using "Run as Adminstrator" to access port 443. Also, note that if you are running
Skype it can bind to ports 80 and 443 causing issues for running samples.

Example:

    $ java -jar wiremock-standalone-2.5.0.jar --https-port=8082 --verbose --root-dir ~/REST/vm-power-on
    $ npm run vm-power-on

Output (executes in 1 second with cached API calls):

    $ vcenter npm run vm-power-on

    > vsphere-automation-rest-api-samples@6.5.0 vm-power-on /Users/strefethen/Downloads/VMware-vSphere-Automation-SDK-REST-6.5.0 original/client/samples/javascript/vcenter
    > node samples/vm/power/vm_power_on.js

    logging in
    Looking for VM with name Sample Basic VM for Simple Testbed
    found it.. vm-802
    Powering on vm-802
    {
    "statusCode": 200,
    "headers": {
        "date": "Fri, 24 Feb 2017 21:35:32 GMT",
        "connection": "close",
        "server": "Jetty(9.2.z-SNAPSHOT)"
    },
    "request": {
        "uri": {
        "protocol": "https:",
        "slashes": true,
        "auth": null,
        "host": "localhost:8082",
        "port": "8082",
        "hostname": "localhost",
        "hash": null,
        "search": null,
        "query": null,
        "pathname": "/rest/vcenter/vm/vm-802/power/start",
        "path": "/rest/vcenter/vm/vm-802/power/start",
        "href": "https://localhost:8082/rest/vcenter/vm/vm-802/power/start"
        },
        "method": "post",
        "headers": {
        "Cookie": "vmware-api-session-id=67653b9f861178c12c55a0498b2303e2",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "content-length": 0
        }
    }
    }
    logged out

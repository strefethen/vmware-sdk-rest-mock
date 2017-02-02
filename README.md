# Mocking REST SDK Samples

Leveraging [Wiremock](http://wiremock.org/docs/running-standalone/) we can capture sample API calls to vSphere.

## Capturing API calls from an SDK Sample:

Setup Steps:

1. [Download wiremock](http://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-standalone/2.5.0/wiremock-standalone-2.5.0.jar) (java app)
2. Create a folder for wiremock output ex: ~/Downloads/wiremock_output. This is where wiremock will place it's __file and mappings folders
3. Run wiremock and capture API calls as follows:

        java -jar wiremock-standalone-2.5.0.jar --proxy-all=https://sc-rdops-vm20-dhcp-124-25.eng.vmware.com --https-port=8082 --verbose --root-dir ~/Downloads/wiremock_output --record-mappings

4. In settings.js use:

    Note: This example uses the setup testbed as created by the Python SDK.

        module.exports = {
            host: 'https://localhost:8082', //No default! Please provide a value.
            username: 'administrator@vsphere.local', //username. No default! Please provide a value.
            password: 'Admin!23', // password. No default! Please provide a value.
            ssl: false, // use strict ssl or not.. false allows you to accept all certs.
                        // NOTE: SSL should be set to true in a production environment.
            host1: '10.162.110.106',
            host2: '10.162.98.79',
            hostUsername: 'root',
            hostPassword: '',
            datacenter: 'Sample DC 1', // the name of the datacenter
            datastore: 'Shared NFS Volume', // the name of a datastore
            vmName: 'Sample Basic VM for Simple Testbed', // a name of a VM, used in some of the samples,
            isoName: 'photonOS.iso', // the name of the ISO to use as the OS when creating a VM
                        // (e.g. [datastore1] hoton-minimal-1.0TP2.iso)
            cleanup: true // true to clean up any data a sample created, false to leave it
        }

5. Run the SDK Samples

Following the recording of a sample, wiremock will have captured the results of the API calls
in two folders under the "__files" and "mappings".

## Playback of the SDK Sample using captured API calls

1. Restart wiremock server as follows:

        java -jar wiremock-standalone-2.5.0.jar --https-port=8082 --verbose --root-dir ~/REST/<sample_name>

2. Re-run the same SDK sample which should use the captured API calls from wiremock.

NOTE: For Python the wiremock server can proxy port 443 though it will need to be launched using sudo to attach to that port #.

Example:

    $ java -jar wiremock-standalone-2.5.0.jar --https-port=8082 --verbose --root-dir ~/REST/vm-power-on
    $ npm run vm-power-on

Output (executes in 1 second with cached API calls):

    $ vcenter npm run vm-power-on

    > vsphere-automation-rest-api-samples@6.5.0 vm-power-on /Users/strefethen/Downloads/VMware-vSphere-Automation-SDK-REST-6.5.0/client/samples/javascript/vcenter
    > node samples/vm/power/vm_power_on.js

    logging in
    (node:33402) DeprecationWarning: 'GLOBAL' is deprecated, use 'global'
    Looking for VM with name Sample Basic VM for Simple Testbed
    found it.. vm-635
    Powering on vm-635
    {
    "statusCode": 200,
    "headers": {
        "date": "Thu, 26 Jan 2017 16:17:22 GMT",
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
        "pathname": "/rest/vcenter/vm/vm-635/power/start",
        "path": "/rest/vcenter/vm/vm-635/power/start",
        "href": "https://localhost:8082/rest/vcenter/vm/vm-635/power/start"
        },
        "method": "post",
        "headers": {
        "Cookie": "vmware-api-session-id=66ef0f64aadf7b0bac6a91555774d4c1",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "content-length": 0
        }
    }
    }
    Cleaning up...
    {
    "statusCode": 401,
    "body": {
        "type": "com.vmware.vapi.std.errors.unauthenticated",
        "value": {
        "messages": [
            {
            "args": [],
            "default_message": "This method requires authentication.",
            "id": "vapi.method.authentication.required"
            }
        ]
        }
    },
    "headers": {
        "date": "Thu, 26 Jan 2017 16:17:23 GMT",
        "content-type": "application/json",
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
        "pathname": "/rest/vcenter/vm/vm-635/power/stop",
        "path": "/rest/vcenter/vm/vm-635/power/stop",
        "href": "https://localhost:8082/rest/vcenter/vm/vm-635/power/stop"
        },
        "method": "post",
        "headers": {
        "Cookie": "vmware-api-session-id=66ef0f64aadf7b0bac6a91555774d4c1",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "content-length": 0
        }
    }
    }
    logged out





# Wiremock Mappings Scraper
This is a simple nodejs app that will print the URL's from the output of wiremock.

Install:

    yarn install

Execute:

    node index.js <path_to_wiremock_output>

Example using output from this repo:

    $ node index.js ../REST
    Output Path: ../REST
    /rest/com/vmware/cis/session
    /rest/com/vmware/cis/session
    /rest/vcenter/datacenter/datacenter-591
    ...
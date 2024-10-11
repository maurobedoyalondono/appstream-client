const { AppStreamClient, ListAssociatedFleetsCommand, DescribeFleetsCommand } = require("@aws-sdk/client-appstream");

const config = { 
    region: "us-east-1" 
};

const client = new AppStreamClient(config);

const associatedFleetsRequest = {
  StackName: "stream-arena-stack-large",
};

async function getAssociatedFleets(client, associatedFleetsRequest) {
    const command = new ListAssociatedFleetsCommand(associatedFleetsRequest);
    const response = await client.send(command);
    return response;
}

getAssociatedFleets(client, associatedFleetsRequest).then( data => {
    console.log(data);
    console.log(data.Names.length);

    data.Names.forEach(name => {
        console.log(name);

        client.send(new DescribeFleetsCommand({ Names: [ name ]})).then ( fleetDetail => {
            console.log(fleetDetail);
        })
    });
    
    /*
    data.Names.forEach(name => {
        console.log(name);
        
        client.send(new DescribeFleetsCommand([ name ])).then ( fleetDetail => {
            console.log(fleetDetail);
        })
    });
    */
});
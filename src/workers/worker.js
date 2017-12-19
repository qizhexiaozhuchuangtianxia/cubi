this.addEventListener('message', function(event) { 
    // read data from event.data
    // receive data by this.postMessage([data]);
    
    // Example:
    this.postMessage(event.data.num + 1);
});

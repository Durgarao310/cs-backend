
const logger = (request, response, next) =>{
    console.log(`${request.method} ${request.protocol}://${request.get('host')}${request.oigionalUrl}`)
};

module.exports = logger;

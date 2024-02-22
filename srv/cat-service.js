const aihandler =  require('./utils/ai-core');
module.exports = async (srv) => {

    
    srv.on('connectToGenAI',async (req) => {
        const input = '%'+req.data.prompt+'%';
         
         return aihandler.connectToGenAI(input);
     }); 
    

     
}
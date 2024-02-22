//define the destination created in BTP cockpit
const AI_CORE_DESTINATION = "PROVIDER_AI_CORE_DESTINATION_HUB";

//define the API Version of the LLM model
const API_VERSION = process.env["AI_CORE_API_VERSION"] || "2023-05-15";

       async function connectToGenAI(prompt)
{

    const resourceGroupId = "default"; 
    const headers = { "Content-Type": "application/json", "AI-Resource-Group": resourceGroupId };

    //connect to the Gen AI hub destination service  
    const aiCoreService = await cds.connect.to(AI_CORE_DESTINATION);
        
    //Get embeddings fom Gen AI hub based on the prompt
    const texts = prompt;

    //Enter the deployment id associated to the embedding model
    const embedDeploymentId = "dd7f9b60b161ebc1";
       
    //prepare the input data to be sent to Gen AI hub model       
    const payloadembed  = {
                    input: texts
                };

    //call Gen AI rest API via the desyination              
    const responseEmbed = await aiCoreService.send({
                    // @ts-ignore
                    query: `POST /inference/deployments/${embedDeploymentId}/embeddings?api-version=${API_VERSION}`,
                    data: payloadembed,
                    headers: headers
                });

    
    //The embediing is retieved from the rest API
    const input = responseEmbed["data"][0]?.embedding;
           
    
    //Get the embedding information from the vector table.
    const query = "SELECT TOP 10 TO_VARCHAR(TEXT) as TEXT FROM  PRODUCT_REVIEWS ORDER BY COSINE_SIMILARITY(VECTOR, TO_REAL_VECTOR('[" +input+"]')) DESC";
    const result = await cds.run(query);


    //Pass the embedding to LLM model to receive the sentiment.

    //Provide the deployment id associated to sentiment defined in Gen AI hub.
    const sentimentDeplymentId = 'db29da32431562ca';
    var sentimentPrompt = null;
    var payload = {};
    var sentimentResponse = {};
    var finalResponse = {Response:[]};
    //Loop through the 10 records and retrive the sentiment associated for them
    for (let i = 0; i < 10 ;i++) {

        //Preapring the prompt for te model
        sentimentPrompt = "Provide sentiment in exactly one word for the:'"+result[i].TEXT+"'";
   
     payload = {
    model:"tiiuae--falcon-40b-instruct",
            max_tokens: 60,
            prompt: sentimentPrompt
    };
    
    sentimentResponse = await aiCoreService.send({
        // @ts-ignore
        query: `POST /inference/deployments/${sentimentDeplymentId}/completions?api-version=${API_VERSION}`,
        data: payload,
        headers: headers
    });
    finalResponse.Response.push({"TEXT": result[i].TEXT,"SENTIMENT": sentimentResponse["choices"][0].text })
    
      }
    
   
    return finalResponse;

   
}

module.exports= {connectToGenAI};
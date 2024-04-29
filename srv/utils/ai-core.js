//define the destination created in BTP cockpit
const AI_CORE_DESTINATION = "PROVIDER_AI_CORE_DESTINATION_HUB";
const OPENAI_CORE_DESTINATION = "PROVIDER_OPENAI_CORE_DESTINATION"

//define the API Version of the LLM model
const API_VERSION = process.env["AI_CORE_API_VERSION"] || "2023-05-15";

const AI_API_VERSION = "2023-03-15-preview"

       async function connectToGenAI(prompt)
{

    const resourceGroupId = "default"; 
    const headers = { "Content-Type": "application/json", "AI-Resource-Group": resourceGroupId };

    //connect to the Gen AI hub destination service  
    const aiCoreService = await cds.connect.to(AI_CORE_DESTINATION);
        
    //Get embeddings fom Gen AI hub based on the prompt
    const texts = prompt;

    //Enter the deployment id associated to the embedding model
    const embedDeploymentIdGenAI =  "<Your DeploymenT ID>";

    //Enter the deployment id associated to sentiment defined in Gen AI hub.
    const sentimentDeploymentIdGenAI =  "<Your DeploymenT ID>";
       
    //prepare the input data to be sent to Gen AI hub model       
    const payloadembed  = {
                    input: texts
                };

    //call Gen AI rest API via the desyination              
    const responseEmbed = await aiCoreService.send({
                    // @ts-ignore
                    query: `POST /inference/deployments/${embedDeploymentIdGenAI}/embeddings?api-version=${API_VERSION}`,
                    data: payloadembed,
                    headers: headers
                });

    
    //The embediing is retieved from the rest API
    const input = responseEmbed["data"][0]?.embedding;
           
    
    //Get the embedding information from the vector table.
    const query = "SELECT TOP 10 FILENAME,TO_VARCHAR(TEXT) as TEXT,COSINE_SIMILARITY(VECTOR, TO_REAL_VECTOR('[" +input+"]')) as SCORING FROM  REVIEWS_TARGET ORDER BY COSINE_SIMILARITY(VECTOR, TO_REAL_VECTOR('[" +input+"]')) DESC";
    const result = await cds.run(query);


    //Pass the embedding to LLM model to receive the sentiment.

    
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
        query: `POST /inference/deployments/${sentimentDeploymentIdGenAI}/completions?api-version=${API_VERSION}`,
        data: payload,
        headers: headers
    });
    finalResponse.Response.push({"FILENAME":result[i].FILENAME,"TEXT": result[i].TEXT,"SCORING":result[i].SCORING,"SENTIMENT": sentimentResponse["choices"][0].text })
    
      }
    
   
    return finalResponse;

   
}

async function connectToOpenAI(prompt)
{

    const apikey = "93c4ccc9eac54631afcf7b181cc48b0f"; 
    const headers = { "Content-Type": "application/json", "api-key": apikey };

    //connect to the Gen AI hub destination service  
    const aiCoreService = await cds.connect.to(OPENAI_CORE_DESTINATION);
        
    //Get embeddings fom Gen AI hub based on the prompt
    const texts = prompt;

    //Enter the deployment id associated to the embedding model
    const embedDeploymentIdOpenAI =  "<Your DeploymenT ID>";

    //Provide the deployment id associated to sentiment defined in Gen AI hub.
    const sentimentDeploymentIdOpenAI =  "<Your DeploymenT ID>";
       
    //prepare the input data to be sent to Gen AI hub model       
    const payloadembed  = {
                    input: texts
                };

    //call Gen AI rest API via the desyination              
    const responseEmbed = await aiCoreService.send({
                    // @ts-ignore
                    query: `POST openai/deployments/${embedDeploymentIdOpenAI}/embeddings?api-version=${AI_API_VERSION}`,
                    data: payloadembed,
                    headers: headers
                });

    
    //The embediing is retieved from the rest API
    const input = responseEmbed["data"][0]?.embedding;
           
    
    //Get the embedding information from the vector table.
    const query = "SELECT TOP 10 FILENAME,TO_VARCHAR(TEXT) as TEXT,COSINE_SIMILARITY(VECTOR, TO_REAL_VECTOR('[" +input+"]')) as SCORING FROM  REVIEWS_TARGET ORDER BY COSINE_SIMILARITY(VECTOR, TO_REAL_VECTOR('[" +input+"]')) DESC";
    const result = await cds.run(query);


    //Pass the embedding to LLM model to receive the sentiment.

   
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
        query: `POST openai/deployments/${sentimentDeploymentIdOpenAI}/completions/?api-version=${AI_API_VERSION}`,
        data: payload,
        headers: headers
    });
    finalResponse.Response.push({"FILENAME":result[i].FILENAME,"TEXT": result[i].TEXT,"SCORING":result[i].SCORING,"SENTIMENT": sentimentResponse["choices"][0].text })
    
      }
    
   
    return finalResponse;

   
}

module.exports= {connectToGenAI,connectToOpenAI};
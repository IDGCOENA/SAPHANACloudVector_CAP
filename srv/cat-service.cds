using PRODUCT_REVIEWS from '../db/data-model';



service GenAIService {

   
    entity ProductResponse as projection on PRODUCT_REVIEWS excluding {  VECTOR };
    action connectToGenAI(prompt:String) returns String;

}
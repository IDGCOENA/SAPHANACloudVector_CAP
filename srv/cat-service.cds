using PRODUCT_REVIEWS from '../db/data-model';
using REVIEWS_TARGET from '../db/data-model';



service GenAIService {

   
    entity ProductResponse as projection on PRODUCT_REVIEWS excluding {  VECTOR };
    entity ReviewResponse as projection on REVIEWS_TARGET excluding {VECTOR};
    action connectToGenAI(prompt:String) returns String;
     action connectToOpenAI(prompt:String) returns String;

}
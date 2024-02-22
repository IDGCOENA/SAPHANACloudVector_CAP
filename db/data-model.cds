



@cds.persistence.exists
Entity PRODUCT_REVIEWS {
  USER_ID: String(100);
  TEXT: LargeString  @title: 'text' ; 
  VECTOR: cds.Vector  @title: 'VECTOR' ; 
}




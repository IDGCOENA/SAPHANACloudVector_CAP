




@cds.persistence.exists
entity REVIEWS_TARGET {
   FILENAME: String(100);
  TEXT: LargeString  @title: 'text' ; 
  VECTOR: cds.Vector  @title: 'VECTOR' ; 
}


package com.library.library.Repo;


import com.library.library.Library.BookStock;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookStockRepo extends MongoRepository<BookStock, String> {

    @Query(value = "{ 'bookId': ?0 }", exists = true)
    boolean existsByBookId(String bookId);

    @Query("{'bookId':  ?0 }")
    Optional<BookStock> findByBookId(String bookId);

    Optional<BookStock> findByBookName(String bookName);

}

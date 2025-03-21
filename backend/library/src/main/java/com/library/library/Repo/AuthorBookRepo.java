package com.library.library.Repo;

import com.library.library.Library.AuthorBook;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthorBookRepo extends MongoRepository<AuthorBook, String> {

    @Query("{ 'authorId' : ?0 }")
    List<AuthorBook> findByAuthorId(String authorId);

    Optional<AuthorBook> findByAuthorIdAndBookId(String authorId, String bookId);

    Optional<AuthorBook> findByAuthorIdAndBookName(String authorId, String bookName);

    boolean existsByAuthorIdAndBookId(String id, String id1);
}

package com.library.library.Repo;

import com.library.library.Library.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepo extends MongoRepository<Book, String>, PagingAndSortingRepository<Book, String> {
    public Optional<Book> findBooksByTitle(String bookName);

    @Query("{ 'author': ?0 }")
    public List<Book> findBooksByAuthor(String AuthorName);


    @Query("{ 'isbn': { $in: ?0 } }")
    public List<Book> findBooksByIds(Collection<String> bookIds);

    boolean existsById(@NonNull String id);

    Optional<Book> findById(@NonNull String id);  // Returns an Optional<Book>

    void deleteById(@NonNull String id);

    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(String title, String author);

}




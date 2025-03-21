package com.library.library.Repo;

import com.library.library.Library.Author;
import com.library.library.Library.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthorRepo extends MongoRepository<Author, String> {
    public Optional<Author> findByName(String name);

    public Optional<Author> findById(@NonNull String id);

    public boolean existsById(@NonNull String id);

    public void deleteById(@NonNull String id);

}

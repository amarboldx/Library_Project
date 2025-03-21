package com.library.library.Repo;


import org.springframework.data.mongodb.repository.MongoRepository;
import com.library.library.Library.User;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);

    @Query("{}")
    List<User> findAllUsers();
}

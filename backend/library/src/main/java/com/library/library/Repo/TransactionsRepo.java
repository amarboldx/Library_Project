package com.library.library.Repo;

import com.library.library.Library.BookStock;
import com.library.library.Library.Transactions;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactionsRepo extends MongoRepository<Transactions, String> {
}

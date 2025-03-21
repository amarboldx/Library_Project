package com.library.library.Library;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.Map;

@Data
public class Transactions {
    @Id
    private String id;

    private String userId;
    private Map<String, Integer> books; // Map of bookId -> quantity
    private Date purchaseDate;

    public Transactions(String userId, Map<String, Integer> books, Date purchaseDate) {
        this.userId = userId;
        this.books = books;
        this.purchaseDate = purchaseDate;
    }
}

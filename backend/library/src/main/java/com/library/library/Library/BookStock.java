package com.library.library.Library;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class BookStock {
    @Id
    private String id;

    @NotBlank
    private String bookId;
    @NotBlank
    private String bookName;
    @NotBlank
    private int quantity = 0;


    public BookStock(String bookId, String bookName) {
        this.bookId = bookId;
        this.bookName = bookName;
    }
}

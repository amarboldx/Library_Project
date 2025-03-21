package com.library.library.Library;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "author_book")
public class AuthorBook {
    @Id
    private String id;

    @NotBlank
    private String authorId;
    @NotBlank
    private String bookId;
    @NotBlank
    private String bookName;

    public AuthorBook(String authorId, String bookId, String bookName) {
        this.authorId = authorId;
        this.bookId = bookId;
        this.bookName = bookName;
    }
}

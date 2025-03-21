package com.library.library.Library;


import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "books")
public class Book {
    @Id
    public String id;

    @NotBlank
    public String title;
    @NotBlank
    public String author;
    @NotBlank
    public int year;
    @NotBlank
    public int pages;
    @NotBlank
    public int isbn;
    @NotBlank
    public String genre;
    @NotBlank
    public String description;
    @NotBlank
    @URL
    public String cover; //URL
    @NotBlank
    public double price;

    public Book(String title, String author, int year, int pages, int isbn, String genre, String description, String cover, double price) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.pages = pages;
        this.isbn = isbn;
        this.genre = genre;
        this.description = description;
        this.cover = cover;
        this.price = price;
    }
}

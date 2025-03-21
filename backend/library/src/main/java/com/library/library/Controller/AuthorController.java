package com.library.library.Controller;


import com.library.library.Library.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import com.library.library.Library.Author;
import com.library.library.Services.AuthorService;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {
    private final AuthorService authorService;

    @Autowired
    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping("/get/all")
    public Iterable<Author> getAllAuthors() {
        return authorService.getAllAuthors();
    }

    @GetMapping("/get/{id}")
    public Optional<Author> getAuthorById(@PathVariable String id) {
        return authorService.getAuthorById(id);
    }

    @GetMapping("/get/books/{id}")
    public List<Book> getBookByAuthor(@PathVariable String id) {
        return authorService.getBookByAuthor(id);
    }


    @GetMapping("/get/name/{name}")
    public Optional<Author> getAuthorByName(@PathVariable String name) {
        return authorService.getAuthorByName(name);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/post/author")
    public String addAuthor(@RequestBody Author author) {
        return authorService.addAuthor(author);
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/put/{id}")
    public Author updateAuthor(@PathVariable String id, @RequestBody Author updatedAuthor) {
        return authorService.updateAuthor(id, updatedAuthor);
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public String deleteAuthor(@PathVariable String id) {
        return authorService.deleteAuthor(id);
    }



}

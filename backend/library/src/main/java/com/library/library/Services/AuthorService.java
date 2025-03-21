package com.library.library.Services;

import com.library.library.Library.Author;
import com.library.library.Library.AuthorBook;
import com.library.library.Library.Book;
import com.library.library.Repo.AuthorRepo;
import com.library.library.Repo.AuthorBookRepo;
import com.library.library.Repo.BookRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AuthorService {
    private final AuthorRepo authorRepo;
    private final BookRepo bookRepo;
    private final AuthorBookRepo author_BookRepo;


    public Iterable<Author> getAllAuthors() {
        return authorRepo.findAll();
    }

    public Optional<Author> getAuthorById(String id) {
        return authorRepo.findById(id);
    }

    public Optional<Author> getAuthorByName(String name) {
        return authorRepo.findByName(name);
    }

    public List<Book> getBookByAuthor(String id) {
        List<String> bookIds = author_BookRepo.findByAuthorId(id)
                .stream()
                .map(AuthorBook::getBookId)
                .collect(Collectors.toList());
        return bookRepo.findAllById(bookIds);
    }


    public String addAuthor(Author author) {
        Optional<Author> existingAuthor = authorRepo.findByName(author.getName());
        if (existingAuthor.isPresent()) {
            return existingAuthor.get() + " already exists";
        }

        authorRepo.save(author);

        return author + "\nadded successfully";
    }


    public Author updateAuthor(String id, Author updatedAuthor) {
        return authorRepo.findById(id)
                .map(existingAuthor -> {
                    existingAuthor.setName(updatedAuthor.getName());
                    return authorRepo.save(existingAuthor);
                })
                .orElseThrow(() -> new IllegalArgumentException("Author with id " + id + " not found."));
    }

    public String deleteAuthor(String id) {
        if (!authorRepo.existsById(id)) {
            throw new IllegalArgumentException("Author not found" + id);
        }
        authorRepo.deleteById(id);
        return "Author Deleted Successfully";
    }
}

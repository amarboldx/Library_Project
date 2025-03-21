package com.library.library.IntegrationTests;

import com.library.library.Controller.BookController;
import com.library.library.Library.Author;
import com.library.library.Library.AuthorBook;
import com.library.library.Library.Book;
import com.library.library.Library.BookStock;
import com.library.library.Repo.AuthorBookRepo;
import com.library.library.Repo.AuthorRepo;
import com.library.library.Repo.BookRepo;
import com.library.library.Repo.BookStockRepo;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class BookControllerIT {
    @Autowired
    private BookController bookController;
    @Autowired
    private BookRepo bookRepo;
    @Autowired
    private AuthorBookRepo authorBookRepo;
    @Autowired
    private AuthorRepo authorRepo;
    @Autowired
    private BookStockRepo bookStockRepo;


    @AfterEach
    public void tearDown() {
        bookRepo.deleteAll();
        authorBookRepo.deleteAll();
        authorRepo.deleteAll();
        bookStockRepo.deleteAll();
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    public void testAddBook() {
        Book book = new Book();
        book.setTitle("Integration Test Book");
        book.setAuthor("Test Author");

        String response = bookController.addBook(book);

        assertThat(response).isEqualTo("Successfully added Integration Test Book");

        Optional<Book> retrievedBook = bookRepo.findBooksByTitle("Integration Test Book");
        assertThat(retrievedBook).isPresent();
        String retrievedBookId = retrievedBook.get().getId();
        assertThat(retrievedBook.get().getAuthor()).isEqualTo("Test Author");

        Optional<Author> retrievedAuthor = authorRepo.findByName("Test Author");
        assertThat(retrievedAuthor).isPresent();
        String retrievedAuthorId = retrievedAuthor.get().getId();
        assertThat(retrievedAuthor.get().getName()).isEqualTo("Test Author");

        List<AuthorBook> retrievedAuthorBook = authorBookRepo.findByAuthorId(retrievedAuthorId);
        assertThat(authorBookRepo.existsByAuthorIdAndBookId(retrievedAuthorId, retrievedBookId)).isTrue();
        assertThat(retrievedAuthorBook.size()).isEqualTo(1);
        assertThat(retrievedAuthorBook.getFirst().getBookId()).isEqualTo(retrievedBook.get().getId());
        assertThat(retrievedAuthorBook.getFirst().getAuthorId()).isEqualTo(retrievedAuthorId);
        assertThat(retrievedAuthorBook.getFirst().getBookName()).isEqualTo("Integration Test Book");

        Optional<BookStock> retrievedBookStock = bookStockRepo.findByBookId(retrievedBookId);
        assertThat(retrievedBookStock).isPresent();
        assertThat(retrievedBookStock.get().getBookId()).isEqualTo(retrievedBookId);
        assertThat(retrievedBookStock.get().getBookName()).isEqualTo("Integration Test Book");
        assertThat(retrievedBookStock.get().getQuantity()).isEqualTo(0);


    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    public void testGetAllBooks() {
        // Given
        Book book1 = new Book();
        book1.setTitle("Book 1");
        book1.setAuthor("Author 1");

        Book book2 = new Book();
        book2.setTitle("Book 2");
        book2.setAuthor("Author 2");

        bookController.addBook(book1);
        bookController.addBook(book2);

        // When
        List<Book> books = bookController.getAllBooks();

        // Then
        assertThat(books.size()).isEqualTo(2);

        String retrievedBookId = bookController.getBookByTitle("Book 1").get().getId();
        bookController.deleteBook(retrievedBookId);
        books = bookController.getAllBooks();
        assertThat(books.size()).isEqualTo(1);
        books.getFirst().getTitle().equals("Book 2");

    }

    @Test
    public void testGetBook() {
        // Given
        Book book = new Book();
        book.setTitle("Book 1");
        book.setAuthor("Author 1");

        bookRepo.save(book);

        // When
        Optional<Book> retrievedBook = bookController.getBookByTitle("Book 1");

        assertThat(retrievedBook).isPresent();

        // Then
        assertThat(retrievedBook.get()).isNotNull();
        assertThat(retrievedBook.get().getTitle()).isEqualTo("Book 1");
        assertThat(retrievedBook.get().getAuthor()).isEqualTo("Author 1");
    }

}

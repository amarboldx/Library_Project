package com.library.library.Controller;


import com.library.library.Exceptions.BookNotFoundException;
import com.library.library.Repo.BookRepo;
import com.library.library.Services.BookService;
import com.library.library.Library.Book;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class BookController {
    private final BookService bookService;
    private final BookRepo bookRepo;

    @GetMapping("/get/all")
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/get/page/{page}")
    public Page<Book> getAllBooksPage(@PathVariable Integer page){
        int pageSize = 4;
        return bookService.getBooksByPage(page - 1, pageSize);
    }

    @GetMapping("/get/{id}")
    public Optional<Book> getBookById(@PathVariable String id) {
        return bookService.getBookById(id);
    }

    @GetMapping("/get/title/{title}")
    public Optional<Book> getBookByTitle(@PathVariable String title) {
        return bookService.getBookByTitle(title);
    }

    @GetMapping("/get/author/{author}")
    public List<Book> getBookByAuthor(@PathVariable String author) {
        return bookService.getBookByAuthor(author);
    }

    @GetMapping("/get/search")
    public ResponseEntity<List<Book>> getBookBySearch(@RequestParam String query) {
        List<Book> searchResult =  bookService.searchBook(query);
        return ResponseEntity.ok(searchResult);
    }

    @PutMapping("/add-to-liked/{bookId}")
    public String addBookToLiked(
            @PathVariable String bookId,
            @AuthenticationPrincipal UserDetails userDetails){
        Optional<Book> book = bookRepo.findById(bookId);
        if(book.isPresent()){
            bookService.addToLiked(book.get(), userDetails);
            return String.format("Book by ID %s added to liked list", bookId);
        }else{
            return String.format("Book by ID %s not found", bookId);
        }
    }

    @PutMapping("/remove-from-liked/{bookId}")
    public void removeBookFromLiked(
            @PathVariable String bookId,
            @AuthenticationPrincipal UserDetails userDetails){
        Optional<Book> book = bookRepo.findById(bookId);
        if(book.isPresent()){
            bookService.removeFromLiked(book.get(), userDetails);
        }else{
            throw new BookNotFoundException("Book by ID " + bookId + " not found");
        }
    }

    @PutMapping("/remove-from-cart/{bookId}/{quantity}")
    public void removeBookFromCart(
            @PathVariable String bookId,
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable int quantity
    ){
        bookService.removeFromCart(bookId, userDetails, quantity);
    }

    @PutMapping("/add-to-cart/{bookId}/{quantity}")
    public void addBookToCart(
            @PathVariable String bookId,
            @PathVariable int quantity,
            @AuthenticationPrincipal UserDetails userDetails

    ){
            bookService.addToCart(bookId, userDetails, quantity);
    }

    @GetMapping("/likedBooks")
    public List<Book> getLikedBooks(@AuthenticationPrincipal UserDetails userDetails){
        return bookService.getLikedBooks(userDetails);
    }
    @GetMapping("/cart")
    public List<Map<String, Object>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        Map<Book, Integer> cart = bookService.getCart(userDetails);

        List<Map<String, Object>> cartList = new ArrayList<>();
        for (Map.Entry<Book, Integer> entry : cart.entrySet()) {
            Map<String, Object> cartItem = new HashMap<>();
            cartItem.put("book", entry.getKey());
            cartItem.put("quantity", entry.getValue());
            cartList.add(cartItem);
        }

        return cartList;
    }

    @GetMapping("/liked-count")
    public int getLikedCount(@AuthenticationPrincipal UserDetails userDetails){
        return bookService.getLikedCount(userDetails);
    }

    @GetMapping("/cart-count")
    public int getCartCount(@AuthenticationPrincipal UserDetails userDetails){
        return bookService.getCartCount(userDetails);
    }


    @PutMapping("/purchase-cart")
    public String purchaseCart(@AuthenticationPrincipal UserDetails userDetails){
        return bookService.purchaseAllBooksInCart(userDetails);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/order-supply")
    public String orderBook(
            @RequestParam String bookId,
            @RequestParam int quantity
    ){
        return bookService.orderBookSupply(bookId, quantity);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/post/book")
    public String addBook(@RequestBody Book book) {
        bookService.addBook(book);
        return String.format("Successfully added %s", book.getTitle());
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/post/books")
    public String addBooks(@RequestBody List<Book> books) {
        for (Book book : books) {
            bookService.addBook(book);
        }
        return String.format("Successfully added %d books", books.size());
    }



    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable String id) {
        try {
            String result = bookService.deleteBook(id);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/update/{id}")
    public Book updateBook(@PathVariable String id, @RequestBody Book updatedBook) {
        return bookService.updateBook(id, updatedBook);
    }

}

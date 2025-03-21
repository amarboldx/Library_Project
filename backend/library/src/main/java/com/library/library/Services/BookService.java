package com.library.library.Services;


import com.library.library.Exceptions.*;
import com.library.library.Library.*;
import com.library.library.Repo.*;
import com.mongodb.client.result.UpdateResult;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class BookService {
    private final BookRepo bookRepo;
    private final AuthorRepo authorRepo;
    private final AuthorBookRepo authorBookRepo;
    private final BookStockRepo bookStockRepo;
    private final UserProfileRepo userProfileRepo;
    private final UserRepo userRepo;
    private final TransactionsRepo transactionsRepo;
    private final MongoTemplate mongoTemplate;


    public List<Book> getAllBooks() {
        return bookRepo.findAll();
    }

    public Page<Book> getBooksByPage(int pageNumber, int pageSize) {
        return bookRepo.findAll(PageRequest.of(pageNumber, pageSize));
    }

    public Optional<Book> getBookById(String id) {
        return bookRepo.findById(id);
    }

    public Optional<Book> getBookByTitle(String title) {
        return bookRepo.findBooksByTitle(title);
    }

    public List<Book> getBookByAuthor(String author) {
        return bookRepo.findBooksByAuthor(author);
    }

    public List<Book> searchBook(String query){
        return bookRepo.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(query, query);
    }

    public int getLikedCount(UserDetails userDetails) {
        Optional<User> user = userRepo.findByUsername(userDetails.getUsername());
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }

        String userId = user.get().getId();
        Optional<UserProfile> userProfile = userProfileRepo.findById(userId);
        if (userProfile.isEmpty()) {
            throw new UsernameNotFoundException("User Profile not found");
        }

        return userProfile.get().getLikedItems().size();
    }

    public int getCartCount(UserDetails userDetails) {
        Optional<User> user = userRepo.findByUsername(userDetails.getUsername());
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }

        String userId = user.get().getId();
        Optional<UserProfile> userProfile = userProfileRepo.findById(userId);
        if (userProfile.isEmpty()) {
            throw new UsernameNotFoundException("User Profile not found");
        }

        Map<String, Integer> cart = userProfile.get().getCart();
        return cart.values().stream()
                .mapToInt(Integer::intValue) 
                .sum();
    }

    @Transactional
    public List<Book> getLikedBooks(UserDetails userDetails) {
        Optional<User> user = userRepo.findByUsername(userDetails.getUsername());
        List<String> likedBookIds;

        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }

        String userId = user.get().getId();
        Optional<UserProfile> userProfile = userProfileRepo.findById(userId);
        if (userProfile.isEmpty()) {
            throw new UsernameNotFoundException("User Profile not found");
        }

        likedBookIds = userProfile.get().getLikedItems();

        return bookRepo.findAllById(likedBookIds);
    }

    @Transactional
    public Map<Book, Integer> getCart(UserDetails userDetails) {
        Optional<User> user = userRepo.findByUsername(userDetails.getUsername());

        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }

        String userId = user.get().getId();
        Optional<UserProfile> userProfile = userProfileRepo.findById(userId);

        if (userProfile.isEmpty()) {
            throw new UsernameNotFoundException("User Profile not found");
        }

        Map<String, Integer> cartIds = userProfile.get().getCart(); // Book ID -> Quantity map

        if (cartIds.isEmpty()) {
            return new HashMap<>(); // Return empty map if no cart items
        }

        // Fetch all books in one query for efficiency
        List<Book> books = bookRepo.findAllById(cartIds.keySet());

        // Convert <Book, Integer> map
        return books.stream()
                .collect(Collectors.toMap(book -> book, book -> cartIds.getOrDefault(book.getId(), 0)));
    }

    @Transactional
    public void addBook(Book book) {
        Optional<Book> existingBook = bookRepo.findBooksByTitle(book.getTitle());
        if (existingBook.isPresent()) {
            throw new BookAlreadyExistsException();
        }

        Book savedBook = bookRepo.save(book);

        String authorName = book.getAuthor();

        Author author = authorRepo.findByName(authorName)
                .orElseGet(() -> authorRepo.save(new Author(authorName)));

        authorBookRepo.findByAuthorIdAndBookName(author.getId(), savedBook.getTitle())
                .orElseGet(() -> authorBookRepo.save(new AuthorBook(author.getId(), savedBook.getId(), savedBook.getTitle())));

        bookStockRepo.findByBookName(savedBook.getTitle())
                .orElseGet(() -> bookStockRepo.save(new BookStock(savedBook.getId(), savedBook.getTitle())));

    }

    @Transactional
    public void addToLiked(Book book, UserDetails userDetails) {
        String userName = userDetails.getUsername();

        User user = userRepo.findByUsername(userName)
                .orElseThrow(UserNotLoggedInException::new);

        Query query = new Query(Criteria.where("_id").is(user.getId()));
        Update update = new Update().addToSet("likedItems", book.getId());  // Ensures no duplicates

        UpdateResult result = mongoTemplate.updateFirst(query, update, UserProfile.class);

        if (result.getMatchedCount() == 0) {
            throw new UserNotFoundException("User profile not found.");
        }
        if (result.getModifiedCount() == 0) {
            throw new BookAlreadyLikedException();
        }
    }


    @Transactional
    public void removeFromLiked(Book book, UserDetails userDetails) {
        if (userDetails == null) {
            throw new UserNotLoggedInException();
        }

        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        Query query = new Query(Criteria.where("_id").is(user.getId()));
        Update update = new Update().pull("likedItems", book.getId());  // Removes the book if it exists

        UpdateResult result = mongoTemplate.updateFirst(query, update, UserProfile.class);

        if (result.getMatchedCount() == 0) {
            throw new UserNotFoundException("User profile not found.");
        }
        if (result.getModifiedCount() == 0) {
            throw new BookNotFoundException("Book is not in the liked list.");
        }
    }



    @Transactional
    public void addToCart(String bookId, UserDetails userDetails, int quantity) {
        String userName = userDetails.getUsername();

        Book book = bookRepo.findById(bookId).orElseThrow(() ->
                new BookNotFoundException(String.format("Book with ID %s not found", bookId))
        );

        BookStock bookStock = bookStockRepo.findByBookName(book.getTitle()).orElseThrow(() ->
                new StockNotFoundException(String.format("Stock for Book with title %s not found", book.getTitle()))
        );

        User user = userRepo.findByUsername(userName).orElseThrow(() ->
                new UserNotFoundException("Please log in to add this book to your cart.")
        );

        UserProfile userProfile = userProfileRepo.findById(user.getId()).orElseThrow(() ->
                new UserNotFoundException("User profile not found.")
        );

        if (bookStock.getQuantity() < quantity) {
            throw new InsufficientStockException(String.format("Not enough stock for Book with ID %s", bookId));
        }

        Query query = new Query(Criteria.where("_id").is(userProfile.getId()));
        Update update = new Update().inc("cart." + bookId, quantity);

        mongoTemplate.updateFirst(query, update, UserProfile.class);
    }


    @Transactional
    public void removeFromCart(String bookId, UserDetails userDetails, int quantity) {
        String userName = userDetails.getUsername();

        User user = userRepo.findByUsername(userName).orElseThrow(() ->
                new UserNotFoundException("Please log in to remove this book from your cart.")
        );

        UserProfile userProfile = userProfileRepo.findById(user.getId()).orElseThrow(() ->
                new UserNotFoundException("User profile not found.")
        );

        Query query = new Query(Criteria.where("_id").is(userProfile.getId()).and("cart." + bookId).gt(0));

        Update update = new Update().inc("cart." + bookId, -quantity);

        mongoTemplate.updateFirst(query, update, UserProfile.class);

        Query removeQuery = new Query(Criteria.where("_id").is(userProfile.getId()).and("cart." + bookId).is(0));
        Update removeUpdate = new Update().unset("cart." + bookId);

        mongoTemplate.updateFirst(removeQuery, removeUpdate, UserProfile.class);
    }






    @Transactional
    public String purchaseAllBooksInCart(UserDetails userDetails) {
        String userName = userDetails.getUsername();
        Optional<User> userOptional = userRepo.findByUsername(userName);

        if (userOptional.isEmpty()) {
            return "Please log in to purchase books.";
        }

        String userId = userOptional.get().getId();
        Optional<UserProfile> userProfileOptional = userProfileRepo.findById(userId);

        if (userProfileOptional.isEmpty()) {
            return "User profile not found.";
        }

        UserProfile userProfile = userProfileOptional.get();
        Map<String, Integer> cart = userProfile.getCart();

        // Calculate the total cost of books in the cart
        double totalCost = 0.0;
        for (Map.Entry<String, Integer> entry : cart.entrySet()) {
            String bookId = entry.getKey();
            int quantity = entry.getValue();

            Optional<Book> bookOptional = bookRepo.findById(bookId);
            Optional<BookStock> bookStockOptional = bookStockRepo.findByBookId(bookId);

            if (bookOptional.isEmpty() || bookStockOptional.isEmpty()) {
                return "One or more books in the cart are unavailable.";
            }

            Book book = bookOptional.get();
            BookStock bookStock = bookStockOptional.get();

            if (bookStock.getQuantity() < quantity) {
                return String.format("Not enough stock for book %s", book.getTitle());
            }

            totalCost += book.getPrice() * quantity;
        }

        // Check if the user has enough balance to complete the purchase
        if (userProfile.getBalance() < totalCost) {
            return "You do not have enough balance to complete this purchase.";
        }

        // Create a transaction map to record all books purchased in this transaction
        Map<String, Integer> transactionBooks = new HashMap<>();

        // Proceed with the purchase and update the stock and user's balance
        for (Map.Entry<String, Integer> entry : cart.entrySet()) {
            String bookId = entry.getKey();
            int quantity = entry.getValue();

            Optional<Book> bookOptional = bookRepo.findById(bookId);
            if (bookOptional.isPresent()) {
                Book book = bookOptional.get();

                // Deduct balance for each book
                userProfile.setBalance(userProfile.getBalance() - (book.getPrice() * quantity));

                // Update stock after the purchase
                if(bookStockRepo.findByBookId(bookId).isEmpty()){
                    return "Could not find Book Stock";
                }
                BookStock bookStock = bookStockRepo.findByBookId(bookId).get();
                bookStock.setQuantity(bookStock.getQuantity() - quantity);
                bookStockRepo.save(bookStock);

                // Add the book and quantity to the transaction map
                transactionBooks.put(bookId, quantity);
            }
        }

        // Save the transaction with all books
        transactionsRepo.save(new Transactions(userId, transactionBooks, new Date()));

        // Clear the cart
        cart.clear();

        // Save the updated user profile
        userProfileRepo.save(userProfile);

        return "All books in the cart have been purchased successfully.";
    }



    @Transactional
    public String orderBookSupply(String bookId, int quantity) {
        Optional<Book> book = bookRepo.findById(bookId);
        if (book.isPresent()) {
            // Find the stock record for the book
            Optional<BookStock> bookStockOptional = bookStockRepo.findByBookName(book.get().getTitle());

            if (bookStockOptional.isPresent()) {
                // Update the quantity for the existing stock record
                BookStock bookStock = bookStockOptional.get();
                bookStock.setQuantity(bookStock.getQuantity() + quantity);
                bookStockRepo.save(bookStock);
            } else {
                // Create a new stock record if none exists
                BookStock newBookStock = new BookStock(bookId, book.get().getTitle());
                newBookStock.setBookId(bookId);
                newBookStock.setQuantity(quantity);
                bookStockRepo.save(newBookStock);
            }

            return String.format("Ordered %d copies for the book: %s", quantity, book.get().getTitle());
        } else {
            return String.format("Book with ID %s was not found", bookId);
        }
    }



    @Transactional
    public Book updateBook(String id, Book updatedBook) {
        Query query = new Query(Criteria.where("id").is(id));
        Update update = new Update()
                .set("title", updatedBook.getTitle())
                .set("year", updatedBook.getYear())
                .set("pages", updatedBook.getPages())
                .set("isbn", updatedBook.getIsbn())
                .set("genre", updatedBook.getGenre())
                .set("description", updatedBook.getDescription())
                .set("cover", updatedBook.getCover())
                .set("price", updatedBook.getPrice());

        FindAndModifyOptions options = new FindAndModifyOptions().returnNew(true);

        Book result = mongoTemplate.findAndModify(query, update, options, Book.class);

        if (result == null) {
            throw new IllegalArgumentException("Book with id " + id + " not found");
        }

        Query bookStockQuery = new Query(Criteria.where("bookId").is(id));
        Update bookStockUpdate = new Update()
                .set("bookName", updatedBook.getTitle());

        mongoTemplate.findAndModify(bookStockQuery, bookStockUpdate,
                new FindAndModifyOptions().returnNew(true), BookStock.class);

        Query authorBookQuery = new Query(Criteria.where("bookId").is(id));
        Update authorBookUpdate = new Update()
                .set("bookName", updatedBook.getTitle());

        mongoTemplate.findAndModify(authorBookQuery, authorBookUpdate,
                new FindAndModifyOptions().returnNew(true), AuthorBook.class);

        return result;
    }

    @Transactional
    public String deleteBook(String id) {
        Query query = new Query(Criteria.where("id").is(id));
        Book deletedBook = mongoTemplate.findAndRemove(query, Book.class);

        Query bookStockQuery = new Query(Criteria.where("bookId").is(id));
        mongoTemplate.findAndRemove(bookStockQuery, BookStock.class);

        Query authorBookQuery = new Query(Criteria.where("bookId").is(id));
        mongoTemplate.findAndRemove(authorBookQuery, AuthorBook.class);

        if (deletedBook == null) {
            throw new IllegalArgumentException(String.format("Book with id %s not found", id));
        }

        return String.format("Book with ID %s deleted successfully", id);
    }
}

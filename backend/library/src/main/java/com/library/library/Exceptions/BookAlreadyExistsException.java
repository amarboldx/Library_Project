package com.library.library.Exceptions;

public class BookAlreadyExistsException extends RuntimeException {
    public BookAlreadyExistsException() {
        super("Book already exists in the library.");
    }
}

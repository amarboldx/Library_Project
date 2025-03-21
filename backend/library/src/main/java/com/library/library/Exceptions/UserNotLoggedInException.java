package com.library.library.Exceptions;

public class UserNotLoggedInException extends RuntimeException {
    public UserNotLoggedInException() {
        super("Please log in to add this book to your liked list.");
    }
}
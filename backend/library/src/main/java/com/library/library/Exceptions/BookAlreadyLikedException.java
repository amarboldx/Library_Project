package com.library.library.Exceptions;

public class BookAlreadyLikedException extends RuntimeException {
    public BookAlreadyLikedException() {
        super("This book is already in your liked list.");
    }
}
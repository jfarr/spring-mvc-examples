package examples.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import examples.data.Book;
import examples.data.Library;

public abstract class AbstractBookController {

    private Library library;

    @Autowired
    public void setLibrary(Library library) {
        this.library = library;
    }
    
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @SuppressWarnings("serial")
    public class NotFoundException extends Exception {
    }

    protected List<Book> getBooks() {
        return library.getBooks();
    }
    
    protected Book getBook(int bookId) throws NotFoundException {
        Book book = library.getBook(bookId);
        if (book == null) {
            throw new NotFoundException();
        }
        return book;
    }

    protected void saveBook(Book book) {
        library.saveBook(book);
    }
}

package examples.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import examples.data.Book;
import examples.data.Library;

@Controller
@RequestMapping("/books")
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

package examples.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import examples.data.Book;
import examples.data.Library;

public abstract class AbstractBookController {

    private static final int DEFAULT_FIRST_RESULT = 0;
    private static final int DEFAULT_MAX_RESULTS = 5;

    private Library library;

    @Autowired
    public void setLibrary(Library library) {
        this.library = library;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @SuppressWarnings("serial")
    public class NotFoundException extends Exception {
    }

    protected Map<String, Object> getBooks(Integer firstResult) {
        firstResult = calculateFirstResult(firstResult);
        int maxResults = calculateMaxResults();
        List<Book> books = library.getBooks(firstResult, maxResults);
        long count = library.countBooks();
        return buildListModel(books, firstResult, maxResults, count);
    }

    protected int calculateFirstResult(Integer firstResult) {
        return (firstResult == null ? DEFAULT_FIRST_RESULT : firstResult);
    }

    protected int calculateMaxResults() {
        return DEFAULT_MAX_RESULTS;
    }

    private Map<String, Object> buildListModel(List<Book> books, Integer firstResult, int maxResults, long count) {
        Integer nextResult = ((firstResult + maxResults < count) ? firstResult + maxResults : null);
        Integer prevResult = ((firstResult - maxResults >= 0) ? firstResult - maxResults : null);
        
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("books", books);
        model.put("total", count);
        model.put("count", books.size());
        model.put("firstResult", firstResult);
        model.put("nextResult", nextResult);
        model.put("prevResult", prevResult);
        model.put("maxResults", maxResults);
        return model;
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

    protected Map<String, Object> searchBooks(String title, Integer firstResult) {
        firstResult = calculateFirstResult(firstResult);
        int maxResults = calculateMaxResults();
        List<Book> books = library.searchBooksByTitle(title, firstResult, maxResults);
        long count = library.countBooksByTitle(title);
        return buildListModel(books, firstResult, maxResults, count);
    }
}

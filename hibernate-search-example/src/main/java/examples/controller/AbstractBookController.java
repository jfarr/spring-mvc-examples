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

    private Library library;
    private Paginator paginator;
    
    @Autowired
    public void setLibrary(Library library) {
        this.library = library;
    }

    @Autowired
    public void setPaginator(Paginator paginator) {
        this.paginator = paginator;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @SuppressWarnings("serial")
    public class NotFoundException extends Exception {
    }

    protected Map<String, Object> getBooks(Integer firstResult, Integer maxResults) {
        firstResult = paginator.getFirstResult(firstResult);
        maxResults = paginator.getMaxResults(maxResults);
        return buildListModel(
                library.getBooks(firstResult, maxResults), 
                firstResult, 
                maxResults, 
                library.countBooks());
    }

    private Map<String, Object> buildListModel(List<Book> books, Integer firstResult, int maxResults, long total) {
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("books", books);
        model.put("total", total);
        model.put("count", books.size());
        model.put("firstResult", firstResult);
        model.put("maxResults", maxResults);
        model.put("nextResult", paginator.getNextResult(firstResult, maxResults, total));
        model.put("prevResult", paginator.getPreviousResult(firstResult, maxResults));
        model.put("startResult", paginator.getStartResult(firstResult));
        model.put("lastResult", paginator.getLastResult(firstResult, maxResults, total));
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

    protected Map<String, Object> searchBooks(String title, Integer firstResult, Integer maxResults) {
        firstResult = paginator.getFirstResult(firstResult);
        maxResults = paginator.getMaxResults(maxResults);
        return buildListModel(
                library.searchBooksByTitle(title, firstResult, maxResults), 
                firstResult, 
                maxResults, 
                library.countBooksByTitle(title));
    }
}

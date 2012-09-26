package examples.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import examples.data.Book;
import examples.data.Library;
import examples.data.MissingBookException;

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
        long total = library.countBooks();
        Page page = paginator.getPage(firstResult, maxResults, total);
        return buildListModel(
                library.getBooks(page.getFirstResult(), page.getMaxResults()),
                page);
    }

    private Map<String, Object> buildListModel(List<Book> books, Page page) {
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("books", books);
        model.put("count", books.size());
        model.put("total", page.getTotal());
        model.put("firstResult", page.getFirstResult());
        model.put("maxResults", page.getMaxResults());
        model.put("nextResult", page.getNextResult());
        model.put("prevResult", page.getPrevResult());
        model.put("startResult", page.getStartResult());
        model.put("lastResult", page.getLastResult());
        return model;
    }

    protected Book getBook(int bookId) throws NotFoundException {
        Book book = library.getBook(bookId);
        if (book == null) {
            throw new NotFoundException();
        }
        return book;
    }

    protected void saveBook(Book book) throws NotFoundException {
        try {
            library.saveBook(book);
        } catch (MissingBookException e) {
            throw new NotFoundException();
        }
    }

    protected void deleteBook(int bookId) {
        library.deleteBook(bookId);
    }

    protected Map<String, Object> searchBooksByTitle(String title, Integer firstResult, Integer maxResults) {
        long total = library.countBooksByTitle(title);
        Page page = paginator.getPage(firstResult, maxResults, total);
        return buildListModel(
                library.searchBooksByTitle(title, page.getFirstResult(), page.getMaxResults()),
                page);
    }

    protected Map<String, Object> searchBooksByTitlePrefix(String title, Integer firstResult, Integer maxResults) {
        long total = library.countBooksByTitlePrefix(title);
        Page page = paginator.getPage(firstResult, maxResults, total);
        return buildListModel(
                library.searchBooksByTitlePrefix(title, page.getFirstResult(), page.getMaxResults()),
                page);
    }
    
    protected void importBooksAsCsv(InputStream inputStream) throws IOException {
        library.importBooksAsCsv(inputStream);
    }
}

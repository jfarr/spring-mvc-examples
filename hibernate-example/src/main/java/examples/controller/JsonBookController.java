package examples.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import examples.data.Book;

@Controller
@RequestMapping("/books")
public class JsonBookController extends AbstractBookController {

    @RequestMapping(value = "/", method = RequestMethod.GET, headers = "Accept=application/json")
    public @ResponseBody Map<String, Object> list(
            @RequestParam(required = false) Integer firstResult,
            @RequestParam(required = false) Integer maxResults) {
        return getBooks(firstResult, maxResults);
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, headers = "Content-type=application/json")
    public @ResponseBody Book add(@RequestBody Book book) {
        book.setBookId(null);
        try {
            saveBook(book);
        } catch (NotFoundException e) {
        }
        return book;
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.PUT, headers = "Content-type=application/json")
    public @ResponseBody Book update(@PathVariable int bookId, @RequestBody Book book) throws NotFoundException {
        book.setBookId(bookId);
        saveBook(book);
        return book;
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable int bookId) {
        deleteBook(bookId);
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.GET, headers = "Accept=application/json")
    public @ResponseBody Book view(@PathVariable int bookId) throws NotFoundException {
        return getBook(bookId);
    }

    @RequestMapping(value = "/search", headers = "Accept=application/json")
    public @ResponseBody Map<String, Object> search(
            @RequestParam(required = false) String contains,
            @RequestParam(required = false) String prefix,
            @RequestParam(required = false) Integer firstResult,
            @RequestParam(required = false) Integer maxResults) {
        if (contains != null) {
            return searchBooksByTitle(contains, firstResult, maxResults);
        } else if (prefix != null) {
            return searchBooksByTitlePrefix(prefix, firstResult, maxResults);
        }
        return getBooks(firstResult, maxResults);
    }
}

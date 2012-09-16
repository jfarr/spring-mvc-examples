package examples.controller;

import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

import examples.data.Book;

@Controller
@RequestMapping("/books")
public class JsonBookController extends AbstractBookController {

    @RequestMapping(value = "/", method = RequestMethod.GET, headers = "Accept=application/json")
    public ModelAndView list(
            @RequestParam(required = false) Integer firstResult,
            @RequestParam(required = false) Integer maxResults) {
        return new ModelAndView("book/list-json", getBooks(firstResult, maxResults));
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, headers = "Content-type=application/json")
    public ModelAndView add(@RequestBody Book book) {
        saveBook(book);
        return new ModelAndView("book/view-json", "book", book);
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.PUT, headers = "Content-type=application/json")
    public ModelAndView update(@PathVariable int bookId, @RequestBody Book book) {
        book.setBookId(bookId);
        saveBook(book);
        return new ModelAndView("book/view-json", "book", book);
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable int bookId) {
        deleteBook(bookId);
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.GET, headers = "Accept=application/json")
    public ModelAndView view(@PathVariable int bookId) throws NotFoundException {
        return new ModelAndView("book/view-json", "book", getBook(bookId));
    }

    @RequestMapping(value = "/search", headers = "Accept=application/json")
    public ModelAndView search(
            @RequestParam(required = false) String contains,
            @RequestParam(required = false) String prefix,
            @RequestParam(required = false) Integer firstResult,
            @RequestParam(required = false) Integer maxResults) {
        if (contains != null) {
            return new ModelAndView("book/list-json", searchBooksByTitle(contains, firstResult, maxResults));
        } else if (prefix != null) {
            return new ModelAndView("book/list-json", searchBooksByTitlePrefix(prefix, firstResult, maxResults));
        }
        return new ModelAndView("book/list-json", "books", new ArrayList<Book>());
    }
}

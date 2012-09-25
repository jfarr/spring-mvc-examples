package examples.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import examples.data.Book;

@Controller
@RequestMapping("/books")
public class JsonBookController extends AbstractBookController {

    @RequestMapping(value = "/", method = RequestMethod.GET, headers = "Accept=application/json")
    public @ResponseBody List<Book> list() {
        return getBooks();
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, headers = "Content-type=application/json")
    public @ResponseBody Book add(@RequestBody Book book) {
        saveBook(book);
        return book;
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.PUT, headers = "Content-type=application/json")
    public @ResponseBody Book update(@PathVariable int bookId, @RequestBody Book book) {
        book.setBookId(bookId);
        saveBook(book);
        return book;
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.GET, headers = "Accept=application/json")
    public @ResponseBody Book view(@PathVariable int bookId) throws NotFoundException {
        return getBook(bookId);
    }
}

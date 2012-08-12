package examples.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import examples.data.Book;

@Controller
@RequestMapping("/books")
public class JsonBookController extends AbstractBookController {

    @RequestMapping(value = "/", method = RequestMethod.GET, headers = "Accept=application/json")
    public ModelAndView list() {
        return new ModelAndView("book/list-json", "books", getBooks());
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

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.GET, headers = "Accept=application/json")
    public ModelAndView view(@PathVariable int bookId) throws NotFoundException {
        return new ModelAndView("book/view-json", "book", getBook(bookId));
    }
}

package examples.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import examples.data.Book;

import java.util.Map;

@Controller
@RequestMapping("/books")
public class JsonBookController extends AbstractBookController {

    @RequestMapping(value = "/", method = RequestMethod.POST, headers = "Content-type=application/json")
    public @ResponseBody Book addJson(@RequestBody Book book) throws Exception {
        saveBook(book);
        return book;
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.PUT, headers = "Content-type=application/json")
    public @ResponseBody Book updateJson(@PathVariable int bookId, @RequestBody Book book) throws Exception {
        book.setBookId(bookId);
        saveBook(book);
        return book;
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.GET, headers = "Accept=application/json")
    public @ResponseBody Book viewJson(@PathVariable int bookId) throws NotFoundException {
        return getBook(bookId);
    }

    @RequestMapping(value = "/", method = RequestMethod.GET, headers = "Accept=application/json")
    public @ResponseBody Map<Integer, Book> listJson() throws NotFoundException {
        return library.getBooks();
    }
}

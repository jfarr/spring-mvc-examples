package examples.controller;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

import examples.data.Book;

@Controller
@RequestMapping("/books")
public class HtmlBookController extends AbstractBookController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView list(
            @RequestParam(required = false) Integer firstResult,
            @RequestParam(required = false) Integer maxResults) {
        return new ModelAndView("book/list", getBooks(firstResult, maxResults));
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ModelAndView save(@ModelAttribute("book") Book book) {
        saveBook(book);
        return new ModelAndView("redirect:/library/books/");
    }

    @RequestMapping("/addForm")
    public ModelAndView addForm() {
        return new ModelAndView("book/edit", "book", new Book());
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.GET)
    public ModelAndView view(@PathVariable int bookId) throws NotFoundException {
        return new ModelAndView("book/view", "book", getBook(bookId));
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.POST)
    public ModelAndView delete(@PathVariable int bookId, @RequestParam String submit, @RequestParam String action) 
            throws NotFoundException, InvalidActionException {
        
        if (action.equals("confirmDelete")) {
            return new ModelAndView("book/delete", "book", getBook(bookId));
            
        } else if (action.equals("delete"))  {
            if (submit.equals("Cancel")) {
                return new ModelAndView("redirect:/library/books/book/" + bookId + "/editForm");
            } else {
                deleteBook(bookId);
                return new ModelAndView("redirect:/library/books/");
            }
        }
        throw new InvalidActionException();
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @SuppressWarnings("serial")
    public class InvalidActionException extends Exception {
    }

    @RequestMapping("/book/{bookId}/editForm")
    public ModelAndView editForm(@PathVariable int bookId) throws NotFoundException {
        return new ModelAndView("book/edit", "book", getBook(bookId));
    }

    @RequestMapping("/searchForm")
    public ModelAndView searchForm() {
        return new ModelAndView("book/search");
    }

    @RequestMapping("/search")
    public ModelAndView search(
            @RequestParam String title,
            @RequestParam(required = false) Integer firstResult,
            @RequestParam(required = false) Integer maxResults) {
        return new ModelAndView("book/list", searchBooksByTitle(title, firstResult, maxResults));
    }
}

package examples.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

import examples.data.Book;
import examples.data.Library;

@Controller
@RequestMapping("/books")
public class BookController {

    private Library library;

    @Autowired
    public void setLibrary(Library library) {
        this.library = library;
    }

    @RequestMapping("/")
    public ModelAndView addForm() {
        return new ModelAndView("book/edit", "book", new Book());
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ModelAndView save(@ModelAttribute("book") Book book) throws Exception {
        library.saveBook(book);
        return new ModelAndView("redirect:book/" + book.getBookId());
    }

    @RequestMapping("/book/{bookId}")
    public ModelAndView view(@PathVariable int bookId) throws NotFoundException {
        return new ModelAndView("book/view", "book", getBook(bookId));
    }

    @RequestMapping("/book/{bookId}/editForm")
    public ModelAndView editForm(@PathVariable int bookId) throws NotFoundException {
        return new ModelAndView("book/edit", "book", getBook(bookId));
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, headers = "Content-type=application/json")
    public ModelAndView addJson(@RequestBody Book book) throws Exception {
        library.saveBook(book);
        return new ModelAndView("book/view-json", "book", book);
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.PUT, headers = "Content-type=application/json")
    public ModelAndView updateJson(@PathVariable int bookId, @RequestBody Book book) throws Exception {
        book.setBookId(bookId);
        library.saveBook(book);
        return new ModelAndView("book/view-json", "book", book);
    }

    @RequestMapping(value = "/book/{bookId}", method = RequestMethod.GET, headers = "Accept=application/json")
    public ModelAndView viewJson(@PathVariable int bookId) throws NotFoundException {
        return new ModelAndView("book/view-json", "book", getBook(bookId));
    }

    private Book getBook(int bookId) throws NotFoundException {
        Book book = library.getBook(bookId);
        if (book == null) {
            throw new NotFoundException();
        }
        return book;
    }
    
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @SuppressWarnings("serial")
    public class NotFoundException extends Exception {
    }
}

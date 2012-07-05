package examples.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import examples.data.Book;

@Controller
@RequestMapping("/books")
public class HtmlBookController extends AbstractBookController {


    @RequestMapping("/")
    public ModelAndView addForm() {
        return new ModelAndView("book/edit", "book", new Book());
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ModelAndView save(@ModelAttribute("book") Book book) throws Exception {
        saveBook(book);
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
}

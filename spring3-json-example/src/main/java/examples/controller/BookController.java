package examples.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import examples.data.Book;
import examples.data.Library;

@Controller
@RequestMapping("/book.form")
public class BookController {

    private Library library;

    @Autowired
    public void setLibrary(Library library) {
        this.library = library;
    }

    @RequestMapping("/")
    public ModelAndView addForm(HttpServletRequest request, HttpServletResponse response) {
        return new ModelAndView("book/edit", "book", new Book());
    }

    @RequestMapping(params="action=save")
    public ModelAndView save(@ModelAttribute("book") Book book) throws Exception {
        library.saveBook(book);
        return new ModelAndView("redirect:book.form?action=view", "bookId", book.getBookId());
    }

    @RequestMapping(params="action=save", headers="Content-type=application/json")
    public ModelAndView saveJson(@RequestBody Book book) throws Exception {
        library.saveBook(book);
        return new ModelAndView("redirect:book.form?action=view", "bookId", book.getBookId());
    }

    @RequestMapping(params="action=view")
    public ModelAndView view(@RequestParam Integer bookId) {
        return new ModelAndView("book/view", "book", library.getBook(bookId));
    }

    @RequestMapping(params="action=view", headers="Accept=application/json")
    public ModelAndView viewJson(@RequestParam Integer bookId) {
        return new ModelAndView("book/view-json", "book", library.getBook(bookId));
    }
    
    @RequestMapping(params="action=editForm")
    public ModelAndView editForm(@RequestParam Integer bookId) {
        return new ModelAndView("book/edit", "book", library.getBook(bookId));
    }
}

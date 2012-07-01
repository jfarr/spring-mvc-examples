package examples.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.Validate;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import examples.data.Book;
import examples.data.Library;
import examples.reader.HttpRequestReader;

public class BookController extends MultiActionController {

    private Library library;
    private HttpRequestReader<Book> jsonRequestReader;
    
    public void setLibrary(Library library) {
        this.library = library;
    }

    public void setJsonRequestReader(HttpRequestReader<Book> jsonRequestReader) {
        this.jsonRequestReader = jsonRequestReader;
    }

    public ModelAndView addForm(HttpServletRequest request, HttpServletResponse response) {
        return new ModelAndView("book/edit", "book", new Book());
    }

    public ModelAndView save(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Book book = bind(request);
        library.saveBook(book);
        return new ModelAndView("redirect:book.form?action=view", "bookId", book.getBookId());
    }

    private Book bind(HttpServletRequest request) throws Exception {
        Book book = new Book();
        bind(request, book);
        return book;
    }

    public ModelAndView saveJson(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Book book = bindJson(request);
        library.saveBook(book);
        return new ModelAndView("redirect:book.form?action=view", "bookId", book.getBookId());
    }
    
    private Book bindJson(HttpServletRequest request) throws Exception {
        return jsonRequestReader.read(Book.class, request);
    }

    public ModelAndView view(HttpServletRequest request, HttpServletResponse response) {
        return new ModelAndView("book/view", "book", getBook(request));
    }
    
    public ModelAndView viewJson(HttpServletRequest request, HttpServletResponse response) {
        return new ModelAndView("book/json-view", "book", getBook(request));
    }

    public ModelAndView editForm(HttpServletRequest request, HttpServletResponse response) {
        return new ModelAndView("book/edit", "book", getBook(request));
    }

    private Book getBook(HttpServletRequest request) {
        String bookId = request.getParameter("bookId");
        Validate.notNull(bookId, "missing bookId parameter");
        return library.getBook(Integer.parseInt(bookId));
    }
}

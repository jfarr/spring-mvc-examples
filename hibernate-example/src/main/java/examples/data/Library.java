package examples.data;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.csvreader.CsvReader;

@Repository
@Transactional
public class Library {

    private final static int MAX_LEN = 255;
    
    private SessionFactory sessionFactory;

    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public Book getBook(int bookId) {
        return (Book) getCurrentSession().get(Book.class, bookId);
    }

    public void deleteBook(int bookId) {
        Book book = (Book) getCurrentSession().get(Book.class, bookId);
        if (book != null) {
            getCurrentSession().delete(book);
        }
    }

    public void saveBook(Book book) throws MissingBookException {
        Integer bookId = book.getBookId();
        if (bookId != null && getBook(bookId) == null) {
            throw new MissingBookException("no book with id " + bookId);
        } else {
            getCurrentSession().merge(book);
        }
    }

    @SuppressWarnings("unchecked")
    public List<Book> getBooks(int firstResult, int maxResults) {
        return getCurrentSession()
                .createCriteria(Book.class)
                .addOrder(Order.asc("title"))
                .setFirstResult(firstResult)
                .setMaxResults(maxResults)
                .list();
    }

    public long countBooks() {
        return (Long) getCurrentSession()
                .createCriteria(Book.class)
                .setProjection(Projections.rowCount())
                .uniqueResult();
    }
    
    @SuppressWarnings("unchecked")
    public List<Book> searchBooksByTitle(String title, int firstResult, int maxResults) {
        return getSearchByTitleCriteria(title)
                .addOrder(Order.asc("title"))
                .setFirstResult(firstResult)
                .setMaxResults(maxResults)
                .list();
    }

    public long countBooksByTitle(String title) {
        return (Long) getSearchByTitleCriteria(title)
                .setProjection(Projections.rowCount())
                .uniqueResult();
    }

    private Criteria getSearchByTitleCriteria(String title) {
        return getCurrentSession()
                .createCriteria(Book.class)
                .add(Restrictions.or(
                        Restrictions.or(
                                Restrictions.ilike("title", title),
                                Restrictions.ilike("title", "% " + title + " %")),
                        Restrictions.or(
                                Restrictions.ilike("title", "% " + title),
                                Restrictions.ilike("title", title + " %"))
                ));
    }
    
    @SuppressWarnings("unchecked")
    public List<Book> searchBooksByTitlePrefix(String title, int firstResult, int maxResults) {
        return getSearchByTitlePrefixCriteria(title)
                .addOrder(Order.asc("title"))
                .setFirstResult(firstResult)
                .setMaxResults(maxResults)
                .list();
    }

    public long countBooksByTitlePrefix(String title) {
        return (Long) getSearchByTitlePrefixCriteria(title)
                .setProjection(Projections.rowCount())
                .uniqueResult();
    }

    private Criteria getSearchByTitlePrefixCriteria(String title) {
        return getCurrentSession()
                .createCriteria(Book.class)
                .add(Restrictions.ilike("title", title + "%"));
    }

    public void importBooksAsCsv(InputStream inputStream) throws IOException {
        CsvReader reader = new CsvReader(inputStream, Charset.forName("UTF-8"));
        while (reader.readRecord()) {
            try {
                saveBook(createBook(reader.get(0), reader.get(1)));
            } catch (MissingBookException e) {
            }
        }
    }

    private Book createBook(String title, String author) {
        return new Book(truncate(title), truncate(author));
    }

    private String truncate(String field) {
        return field.length() > MAX_LEN ? field.substring(0, MAX_LEN) : field;
    }

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }
}

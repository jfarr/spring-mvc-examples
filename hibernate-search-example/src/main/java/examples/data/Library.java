package examples.data;

import java.util.List;

import org.apache.lucene.index.Term;
import org.apache.lucene.search.PrefixQuery;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.Sort;
import org.apache.lucene.search.SortField;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.search.FullTextSession;
import org.hibernate.search.Search;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class Library {

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

    public void saveBook(Book book) {
        getCurrentSession().saveOrUpdate(book);
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

    public void index() throws InterruptedException {
        getFullTextSession().createIndexer().startAndWait();
    }

    public long countBooksByTitle(String title) {
        try {
            Query query = new PrefixQuery(new Term("title", title));
            return getFullTextSession()
                .createFullTextQuery(query, Book.class)
                .getResultSize();
        } catch (HibernateException e) {
            throw new RuntimeException(e);
        }
    }
    
    @SuppressWarnings("unchecked")
    public List<Book> searchBooksByTitle(String title, int firstResult, int maxResults) {
        try {
            Query query = new PrefixQuery(new Term("title", title));
            Sort sort = new Sort(new SortField("title", SortField.STRING));
            return getFullTextSession()
                .createFullTextQuery(query, Book.class)
                .setSort(sort)
                .setFirstResult(firstResult)
                .setMaxResults(maxResults)
                .list();
        } catch (HibernateException e) {
            throw new RuntimeException(e);
        }
    }
    
    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    private FullTextSession getFullTextSession() {
        return Search.getFullTextSession(getCurrentSession());
    }
}

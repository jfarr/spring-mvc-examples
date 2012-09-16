package examples.data;

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
    
    @SuppressWarnings("unchecked")
    public List<Book> searchBooksByTitle(String title, int firstResult, int maxResults) {
        return getSearchByTitleCriteria(title)
                .addOrder(Order.asc("title"))
                .setFirstResult(firstResult)
                .setMaxResults(maxResults)
                .list();
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

    public long countBooksByTitle(String title) {
        return (Long) getSearchByTitleCriteria(title)
                .setProjection(Projections.rowCount())
                .uniqueResult();
    }

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }
}

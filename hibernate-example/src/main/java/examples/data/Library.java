package examples.data;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
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

    public void saveBook(Book book) {
        getCurrentSession().saveOrUpdate(book);
    }

    @SuppressWarnings("unchecked")
    public List<Book> getBooks() {
        return getCurrentSession()
                .createCriteria(Book.class)
                .addOrder(Order.asc("title"))
                .list();
    }

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }
}

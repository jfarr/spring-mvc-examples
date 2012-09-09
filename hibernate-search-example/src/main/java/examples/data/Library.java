package examples.data;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
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
import org.hibernate.search.FullTextQuery;
import org.hibernate.search.FullTextSession;
import org.hibernate.search.Search;
import org.hibernate.search.SearchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class Library {

    private static final String TITLE_INDEX = "title";
    private static final String TITLE_FULLTEXT_INDEX = "title_fulltext";

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
        if (StringUtils.isEmpty(title)) {
            return 0L;
        }
        try {
            return getFullTextSession()
                .createFullTextQuery(buildPhraseQuery(TITLE_INDEX, title), Book.class)
                .getResultSize();
        } catch (SearchException e) {
            return 0L;
        } catch (HibernateException e) {
            throw new RuntimeException(e);
        }
    }
    
    @SuppressWarnings("unchecked")
    public List<Book> searchBooksByTitle(String title, int firstResult, int maxResults) {
        if (StringUtils.isEmpty(title)) {
            return new ArrayList<Book>();
        }
        try {
            return buildFullTextQuery(
                    buildPhraseQuery(TITLE_INDEX, title),
                    TITLE_INDEX,
                    firstResult,
                    maxResults)
                    .list();
        } catch (SearchException e) {
            return new ArrayList<Book>();
        } catch (HibernateException e) {
            throw new RuntimeException(e);
        }
    }

    private FullTextQuery buildFullTextQuery(Query query, String index, int firstResult, int maxResults) {
        return getFullTextSession()
            .createFullTextQuery(query, Book.class)
            .setSort(new Sort(new SortField(index, SortField.STRING)))
            .setFirstResult(firstResult)
            .setMaxResults(maxResults);
    }

    private Query buildPhraseQuery(String field, String value) {
        return getFullTextSession()
                .getSearchFactory()
                .buildQueryBuilder()
                .forEntity(Book.class)
                .get()
                .phrase()
                .onField(field)
                .sentence(value)
                .createQuery();
    }

    public long countBooksByTitlePrefix(String title) {
        if (StringUtils.isEmpty(title)) {
            return 0L;
        }
        try {
            return getFullTextSession()
                .createFullTextQuery(buildPrefixQuery(TITLE_FULLTEXT_INDEX, title), Book.class)
                .getResultSize();
        } catch (HibernateException e) {
            throw new RuntimeException(e);
        }
    }
    
    @SuppressWarnings("unchecked")
    public List<Book> searchBooksByTitlePrefix(String title, int firstResult, int maxResults) {
        if (StringUtils.isEmpty(title)) {
            return new ArrayList<Book>();
        }
        try {
            return buildFullTextQuery(
                    buildPrefixQuery(TITLE_FULLTEXT_INDEX, title.toLowerCase()), 
                    TITLE_FULLTEXT_INDEX, 
                    firstResult, 
                    maxResults)
                    .list();
        } catch (HibernateException e) {
            throw new RuntimeException(e);
        }
    }

    private Query buildPrefixQuery(String fieldName, String value) {
        return new PrefixQuery(new Term(fieldName, value));
    }
    
    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    private FullTextSession getFullTextSession() {
        return Search.getFullTextSession(getCurrentSession());
    }
}

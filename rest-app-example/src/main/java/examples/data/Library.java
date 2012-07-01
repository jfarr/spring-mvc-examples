package examples.data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository
public class Library {

	private int nextBookId = 1;
	private Map<Integer, Book> books = new HashMap<Integer, Book>();
	
	public Book getBook(int bookId) {
		return books.get(bookId);
	}

	public void saveBook(Book book) {
		Integer bookId = book.getBookId();
		if (bookId == null) {
			bookId = nextBookId++;
			book.setBookId(bookId);
		}
		books.put(bookId, book);
	}

    public List<Book> getBooks() {
        List<Book> books = new ArrayList<Book>();
        for (Integer bookId : getSortedBookIds()) {
            books.add(this.books.get(bookId));
        }
        return books;
    }

    private List<Integer> getSortedBookIds() {
        List<Integer> bookIds = new ArrayList<Integer>(this.books.keySet());
        Collections.sort(bookIds);
        return bookIds;
    }
}

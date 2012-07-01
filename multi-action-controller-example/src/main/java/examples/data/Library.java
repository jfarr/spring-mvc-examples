package examples.data;

import java.util.HashMap;
import java.util.Map;

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
}

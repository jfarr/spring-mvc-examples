<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<c:set var="isEditing" value="${book.bookId != null}" />
<c:set var="title" value="${isEditing ? 'Edit Book' : 'Add Book'}" />
<c:url var="listAction" value="/library/books/"/>
<c:url var="searchAction" value="/library/books/searchForm"/>
<c:url var="addAction" value="/library/books/addForm"/>
<c:url var="editAction" value="/library/books/"/>
<c:url var="deleteAction" value="/library/books/book/${book.bookId}"/>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title><c:out value="${title}" /></title>
</head>
<body>
<h2><c:out value="${title}" /></h2>
<a href="${listAction}">book list</a>
&nbsp;
<a href="${searchAction}">search books</a>
&nbsp;
<a href="${addAction}">add book</a>
<br/><br/>
<form action="${editAction}" method="POST">
<table>
	<tr>
		<th>Title</th>
		<td><input type="text" name="title" value="<c:out value='${book.title}' />" /></td>
	</tr>
	<tr>
		<th>Author</th>
		<td><input type="text" name="author" value="<c:out value='${book.author}' />" /></td>
	</tr>
	<tr><td colspan="2">&nbsp;</td></tr>
	<tr>
		<td colspan="2""><input type="submit" name="submit" value="Save" /></td>
	</tr>
</table>
<c:if test="${isEditing}">
	<input type="hidden" name="bookId" value="<c:out value="${book.bookId}"/>" />
</c:if>
</form>
<c:if test="${isEditing}">
<form action="${deleteAction}" method="POST">
    <input type="submit" name="submit" value="Delete" />
    <input type="hidden" name="action" value="confirmDelete" />
    <input type="hidden" name="bookId" value="<c:out value="${book.bookId}"/>" />
</form>
</c:if>
<hr>
request:
<c:out value="${param}" />
<br />
<br />
model:
<br />
book:
<c:out value="${book}" />
<br />
</body>
</html>

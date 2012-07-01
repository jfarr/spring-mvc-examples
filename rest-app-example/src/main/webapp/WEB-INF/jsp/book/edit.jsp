<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<c:set var="title"
	value="${book.bookId == null ? 'Add Book' : 'Edit Book'}" />
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title><c:out value="${title}" /></title>
</head>
<body>
<h2><c:out value="${title}" /></h2>
<c:url var="action" value="/library/books/"/>
<form action="${action}" method="POST">
<table>
	<tr>
		<th>Title</th>
		<td><input type="text" name="title" value="${book.title}" /></td>
	</tr>
	<tr>
		<th>Author</th>
		<td><input type="text" name="author" value="${book.author}" /></td>
	</tr>
	<tr>
		<td rowspan="2""><input type="submit" name="submit" value="Save" /></td>
	</tr>
</table>
<c:if test="${book.bookId != null}">
	<input type="hidden" name="bookId" value="<c:out value="${book.bookId}"/>" />
</c:if>
</form>
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

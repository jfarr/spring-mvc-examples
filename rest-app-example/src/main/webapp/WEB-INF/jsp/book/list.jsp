<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<c:url var="addUrl" value="/library/books/addForm"/>
<c:url var="stylesheet" value="/css/styles.css" />
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Book List</title>
<link rel="stylesheet" href="${stylesheet}" type="text/css" media="all" />
</head>
<body>
<h2>Book List</h2>
<a href="${addUrl}">add book</a>
<div id="list-view">
<c:choose>
<c:when test="${empty(books)}">
<p>Library has no books.</p>
</c:when>
<c:otherwise>
<table>
<tr>
	<th>Title</th>
	<th>Author</th>
	<th>&nbsp;</th>
</tr>
<c:forEach items="${books}" var="book">
<c:url var="viewUrl" value="/library/books/book/${book.bookId}/"/>
<c:url var="editUrl" value="/library/books/book/${book.bookId}/editForm"/>
<tr>
	<td><a href="<c:out value="${viewUrl}"/>"><c:out value="${book.title}" /></a></td>
	<td><c:out value="${book.author}" /></td>
	<td class="commands"><a href="${editUrl}">edit</a></td>
</tr>
</c:forEach>
</table>
</c:otherwise>
</c:choose>
</div>
<hr>
request:
<c:out value="${param}" />
<br />
<br />
model:
<br />
books:
<c:out value="${books}" />
<br />
</body>
</html>

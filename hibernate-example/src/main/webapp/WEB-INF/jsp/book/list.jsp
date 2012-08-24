<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Book List</title>
</head>
<body>
<h2>Book List</h2>
<a href="<c:url value="addForm"/>">add book</a>
<c:choose>
	<c:when test="${empty(books)}">
		<p>Library has no books.</p>
	</c:when>
	<c:otherwise>
		<p />
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
					<td><a href="${editUrl}">edit</a></td>
				</tr>
			</c:forEach>
		</table>
	</c:otherwise>
</c:choose>
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

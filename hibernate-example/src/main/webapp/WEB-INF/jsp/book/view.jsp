<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>View Book</title>
</head>
<body>
<c:url var="addUrl" value="/library/books/addForm"/>
<c:url var="listUrl" value="/library/books/" />
<c:url var="editUrl" value="/library/books/book/${book.bookId}/editForm" />
<c:url var="searchUrl" value="/library/books/searchForm"/>
<c:url var="uploadUrl" value="/library/books/uploadForm"/>
<h2>View Book</h2>
<p><a href="${listUrl}">book list</a>&nbsp;<a href="${searchUrl}">search books</a>&nbsp;<a href="${addUrl}">add book</a></p>
<table>
	<tr>
		<th>Title</th>
		<td><c:out value="${book.title}" /></td>
	</tr>
	<tr>
		<th>Author</th>
		<td><c:out value="${book.author}" /></td>
	</tr>
</table>
<form action="${editUrl}">
    <input type="submit" name="submit" value="Edit" />
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

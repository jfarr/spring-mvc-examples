<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>View Book</title>
</head>
<body>
<h2>View Book</h2>
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
<form action="book.form" method="POST">
<input type="submit" name="submit" value="Edit" />
<input type="hidden" name="bookId" value="<c:out value="${book.bookId}"/>" /> 
<input type="hidden" name="action" value="editForm" />
</form>
<hr>
request:
<c:out value="${param}" />
<br />
model:
<c:out value="${book}" />
<br />
</body>
</html>

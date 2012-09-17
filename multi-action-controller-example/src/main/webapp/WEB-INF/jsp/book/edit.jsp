<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<link rel="stylesheet" href="css/styles.css" type="text/css" media="all" />
<c:choose>
	<c:when test="${param.bookId == null}">
		<title>Add Book</title>
	</c:when>
	<c:otherwise>
		<title>Edit Book</title>
	</c:otherwise>
</c:choose>
</head>
<body>
<c:choose>
    <c:when test="${param.bookId == null}">
        <h2>Add Book</h2>
    </c:when>
    <c:otherwise>
        <h2>Edit Book</h2>
    </c:otherwise>
</c:choose>
<form action="book.form" method="POST">
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
<input type="hidden" name="action" value="save" />
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

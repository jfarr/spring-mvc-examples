<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Confirm Delete Book</title>
</head>
<body>
<h2>Confirm Delete Book</h2>
<c:url var="action" value="/library/books/book/${book.bookId}"/>
<p>Are you sure you want to delete the book '<c:out value="${book.title}" />'?</p> 
<form action="${action}" method="POST">
    <input type="submit" name="submit" value="Cancel" />
    <input type="submit" name="submit" value="Delete" />
    <input type="hidden" name="action" value="delete" />
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

<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<c:url var="listUrl" value="/library/books/" />
<c:url var="editUrl" value="/library/books/book/${book.bookId}/editForm" />
<c:url var="stylesheet" value="/css/styles.css" />
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>View Book</title>
<link rel="stylesheet" href="${stylesheet}" type="text/css" media="all" />
</head>
<body>
<h2>View Book</h2>
<p><a href="${listUrl}">list</a></p>
<form:form action="${editUrl}" commandName="book">
<fieldset>
<div class="field">
<label>Title</label><br/>
<c:out value="${book.title}" />
</div>
<div class="field">
<label>Author</label><br/>
<c:out value="${book.author}" />
</div>
<div class="field">
<input type="submit" name="submit" value="Edit" />
</div>
</fieldset>
<input type="hidden" name="action" value="editForm" />
</form:form>
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

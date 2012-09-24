<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<c:set var="isEditing" value="${book.bookId != null}" />
<c:set var="title" value="${isEditing ? 'Edit Book' : 'Add Book'}" />
<c:url var="stylesheet" value="/css/styles.css" />
<c:url var="action" value="/library/books/" />
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title><c:out value="${title}" /></title>
<link rel="stylesheet" href="${stylesheet}" type="text/css" media="all" />
</head>
<body>
<h2><c:out value="${title}" /></h2>
<form:form id="${isEditing ? 'edit-form' : 'add-form'}" action="${action}" commandName="book">
<fieldset>
<div class="field">
<label for="title">Title</label><br/>
<form:input path="title" />
</div>
<div class="field">
<label for="author">Author</label><br/>
<form:input path="author" />
</div>
<div class="field">
<input type="submit" name="submit" value="Save" />
</div>
</fieldset>
<c:if test="${isEditing}">
<form:hidden path="bookId" />
</c:if>
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

<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<c:url var="listUrl" value="/library/books/"/>
<c:url var="searchUrl" value="/library/books/searchForm"/>
<c:url var="addUrl" value="/library/books/addForm"/>
<c:url var="editUrl" value="/library/books/"/>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Upload Books</title>
</head>
<body>
<h2>Upload Books</h2>
<a href="${listUrl}">book list</a>&nbsp;<a href="${searchUrl}">search books</a>&nbsp;<a href="<c:url value="addForm"/>">add book</a>&nbsp;upload&nbsp;books
<br />
<br />
<c:url var="action" value="/library/books/upload" />
<form:form action="${action}" modelAttribute="uploadFile" method="post" enctype="multipart/form-data">
<p>
    <form:label for="fileData" path="fileData">Input File</form:label>
    <form:input path="fileData" type="file"/>
</p>
<p>
    <input type="submit" />
</p>
</form:form>
</body>
</html>

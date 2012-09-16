<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<c:url var="addUrl" value="/library/books/addForm"/>
<c:url var="listUrl" value="/library/books/"/>
<c:url var="uploadUrl" value="/library/books/uploadForm"/>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Search Books</title>
</head>
<body>
<h2>Search Books</h2>
<a href="${listUrl}">book&nbsp;list</a>&nbsp;search&nbsp;books&nbsp;<a href="${addUrl}">add&nbsp;book</a>&nbsp<a href="${uploadUrl}">upload&nbsp;books</a>
<br />
<br />
<c:url var="action" value="/library/books/search" />
<form action="${action}" method="GET">
<table>
	<tr>
		<th>Title</th>
		<td><input type="text" name="title" /></td>
        <td rowspan="2""><input type="submit" value="Search" /></td>
	</tr>
</table>
</form>
</body>
</html>

<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Search Books</title>
</head>
<body>
<h2>Search Books</h2>
<a href="<c:url value="."/>">book list</a>
&nbsp;
<a href="<c:url value="searchForm"/>">search books</a>
&nbsp;
<a href="<c:url value="addForm"/>">add book</a>
<br />
<br />
<c:url var="action" value="/library/books/search" />
<form action="${action}" method="GET">
<table>
	<tr>
		<th>Title</th>
		<td><input type="text" name="title" /></td>
	</tr>
	<tr>
		<td rowspan="2""><input type="submit" value="Search" /></td>
	</tr>
</table>
</form>
</body>
</html>

<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<c:set var="morePages"
	value="${nextResult != null || prevResult != null}" />
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title><c:out value="Book List" /></title>
</head>
<body>
	<h2>
		<c:out value="Book List" />
	</h2>
	<p>book list&nbsp;<a href="<c:url value="addForm"/>">add book</a></p>
	<c:choose>
		<c:when test="${empty(books)}">
			<p>Library has no books.</p>
		</c:when>
		<c:otherwise>
			<p>
				Displaying
				<c:choose>
					<c:when test="${morePages}">
						<c:choose>
							<c:when test="${count == 1}">
								<c:out value="${firstResult + 1}" /> of <c:out value="${total}" />
							</c:when>
							<c:otherwise>
								<c:out value="${firstResult + 1}" /> - <c:out
									value="${firstResult + count}" /> of <c:out value="${total}" />
							</c:otherwise>
						</c:choose>book<c:if test="${total > 1}">s</c:if>
					</c:when>
					<c:otherwise>
						<c:out value="${count}" />
						<c:if test="${total > 1}"> of <c:out value="${total}" />
						</c:if> book<c:if test="${total > 1}">s</c:if>
					</c:otherwise>
				</c:choose>
			</p>
			<p />
			<table>
				<tr>
					<th>Title</th>
					<th>Author</th>
					<th>&nbsp;</th>
				</tr>
				<c:forEach items="${books}" var="book">
					<c:url var="viewUrl" value="/library/books/book/${book.bookId}/" />
					<c:url var="editUrl"
						value="/library/books/book/${book.bookId}/editForm" />
					<tr>
						<td><a href="<c:out value="${viewUrl}"/>"><c:out
									value="${book.title}" /></a></td>
						<td><c:out value="${book.author}" /></td>
						<td><a href="${editUrl}">edit</a></td>
					</tr>
				</c:forEach>
				<c:if test="${morePages}">
					<tr>
						<td colspan="3">
							<table width="100%" border="0" cellpadding="0" cellspacing="0">
								<tr>
									<td colspan="2">&nbsp;</td>
								</tr>
								<tr>
									<c:choose>
										<c:when test="${prevResult != null || startResult != null}">
											<td width="50%"><c:if test="${prevResult != null}">
													<a href="?firstResult=<c:out value="${startResult}" />">first&nbsp;<c:out
															value="${maxResults}" /></a></c:if>&nbsp;<c:if test="${prevResult != null}"><a href="?firstResult=<c:out value="${prevResult}" />">previous&nbsp;<c:out
															value="${maxResults}" /></a>
												</c:if></td>
										</c:when>
										<c:otherwise>
											<td width="50%">&nbsp;</td>
										</c:otherwise>
									</c:choose>
									<c:choose>
										<c:when test="${nextResult != null || lastResult != null}">
											<td width="50%" align="right"><c:if
													test="${nextResult != null}">
													<a href="?firstResult=<c:out value="${nextResult}" />">next&nbsp;<c:out
															value="${maxResults}" /></a></c:if>&nbsp;<c:if test="${lastResult != null}"><a href="?firstResult=<c:out value="${lastResult}" />">last&nbsp;<c:out
															value="${maxResults}" /></a>
												</c:if></td>
										</c:when>
										<c:otherwise>
											<td width="50%" align="right">&nbsp;</td>
										</c:otherwise>
									</c:choose>
								</tr>
							</table>
						</td>
					</tr>
				</c:if>
			</table>
		</c:otherwise>
	</c:choose>
	<hr>
	request:
	<c:out value="${param}" />
	<br />
	<br /> model:
	<br />
	<br /> books:
	<c:out value="${books}" />
	<br /> total:
	<c:out value="${total}" />
	<br /> count:
	<c:out value="${count}" />
	<br /> firstResult:
	<c:out value="${firstResult}" />
	<br /> nextResult:
	<c:out value="${nextResult}" />
	<br /> prevResult:
	<c:out value="${prevResult}" />
	<br /> maxResults:
	<c:out value="${maxResults}" />
</body>
</html>

<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<c:set var="isSearchPage" value="${param.title != null}" />
<c:set var="title"
    value="${isSearchPage ? 'Search Books' : 'Book List'}" />
<c:set var="morePages"
	value="${nextResult != null || prevResult != null}" />
<c:url var="listUrl" value="/library/books/"/>
<c:url var="searchUrl" value="/library/books/searchForm"/>
<c:url var="addUrl" value="/library/books/addForm"/>
<c:url var="uploadUrl" value="/library/books/uploadForm"/>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title><c:out value="${title}" /></title>
</head>
<body>
<h2><c:out value="${title}" /></h2>
<c:choose><c:when test="${isSearchPage}"><a href="${listUrl}">book&nbsp;list</a></c:when><c:otherwise>book&nbsp;list</c:otherwise></c:choose>&nbsp;<c:choose><c:when test="${isSearchPage}">search&nbsp;books</c:when><c:otherwise><a href="${searchUrl}">search&nbsp;books</a></c:otherwise></c:choose>&nbsp;<a href="${addUrl}">add&nbsp;book</a>&nbsp;<a href="${uploadUrl}">upload&nbsp;books</a>
<c:choose>
    <c:when test="${empty(books)}">
        <p>Library has no books<c:if test="${isSearchPage}"> containing '<c:out value="${param.title}" />'</c:if>.</p>
    </c:when>
    <c:otherwise>
        <c:if test="${isSearchPage}">
            <br />
            <br />
            <c:url var="action" value="/library/books/search" />
            <form action="${action}" method="GET">
            <table>
                <tr>
                    <th>Title</th>
                    <td><input type="text" name="title" value="${param.title}" /></td>
                    <td rowspan="2""><input type="submit" name="submit"
                        value="Search" /></td>
                </tr>
            </table>
            </form>
        </c:if>
        <p>Displaying <c:choose
            ><c:when test="${morePages}"
            ><c:choose
                ><c:when test="${count == 1}"
                    ><c:out value="${firstResult + 1}" /> of <c:out value="${total}" 
                    /></c:when
                    ><c:otherwise
                    ><c:out value="${firstResult + 1}" /> - <c:out
                            value="${firstResult + count}" /> of <c:out value="${total}" 
                   /></c:otherwise
            ></c:choose> book<c:if test="${total > 1}">s</c:if
            ></c:when
            ><c:otherwise
               ><c:out value="${count}" /> book<c:if test="${total > 1}">s</c:if
            ></c:otherwise
            ></c:choose
            ><c:if test="${isSearchPage}"> containing '<c:out value="${param.title}" />'</c:if>.</p>
        <p />
		<table width="100%">
			<tr>
				<th align="left">Title</th>
				<th align="left">Author</th>
				<th width="50px" align="right">&nbsp;</th>
			</tr>
			<c:forEach items="${books}" var="book">
				<c:url var="viewUrl" value="/library/books/book/${book.bookId}/" />
				<c:url var="editUrl"
					value="/library/books/book/${book.bookId}/editForm" />
				<tr>
					<td><a href="<c:out value="${viewUrl}"/>"><c:out
								value="${book.title}" /></a></td>
					<td><c:out value="${book.author}" /></td>
					<td width="50px" align="right"><a href="${editUrl}">edit</a></td>
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
												<a href="?<c:if test="${isSearchPage}">title=<c:out value="${param.title}"/>&</c:if>firstResult=<c:out value="${startResult}" />">first&nbsp;<c:out
														value="${maxResults}" /></a></c:if>&nbsp;<c:if test="${prevResult != null}"><a href="?<c:if test="${isSearchPage}">title=<c:out value="${param.title}"/>&</c:if>firstResult=<c:out value="${prevResult}" />">previous&nbsp;<c:out
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
												<a href="?<c:if test="${isSearchPage}">title=<c:out value="${param.title}"/>&</c:if>firstResult=<c:out value="${nextResult}" />">next&nbsp;<c:out
														value="${maxResults}" /></a></c:if>&nbsp;<c:if test="${lastResult != null}"><a href="?<c:if test="${isSearchPage}">title=<c:out value="${param.title}"/>&</c:if>firstResult=<c:out value="${lastResult}" />">last&nbsp;<c:out
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
<br /> lastResult:
<c:out value="${lastResult}" />
<br /> maxResults:
<c:out value="${maxResults}" />
</body>
</html>

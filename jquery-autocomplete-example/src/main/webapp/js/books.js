/*******************************************************************************
 * global variables
 */

var bookServiceUrl = 'http://localhost:8080/hibernate-search-example/library/books/';
var maxAutoComplete = 5;

/*******************************************************************************
 * index.html / search.html functions
 */

function onLoadList() {
    $.getJSON(bookServiceUrl, renderBookList);
}

function onClickFirstList() {
    $.getJSON(bookServiceUrl + '?firstResult='
            + $('#first').attr('idx'), renderBookList);
    return false;
}

function onClickPrevList() {
    $.getJSON(bookServiceUrl + '?firstResult='
            + $('#prev').attr('idx'), renderBookList);
    return false;
}

function onClickNextList() {
    $.getJSON(bookServiceUrl + '?firstResult='
            + $('#next').attr('idx'), renderBookList);
    return false;
}

function onClickLastList() {
    $.getJSON(bookServiceUrl + '?firstResult='
            + $('#last').attr('idx'), renderBookList);
    return false;
}

function renderBookList(bookList) {
    $('.bookRow').remove();
    if (bookList.books.length == 0) {
        var title = $('#title').attr('value');
        $('#bookCount').html('Library contains no books' + (title ? ' starting with \'' + title + '\'' : ''));
        $('#bookList').hide();
    } else {
        renderBookCount(bookList);

        var morePages = (bookList.nextResult != null || bookList.prevResult != null);
        var prevSibling = $('#book_0');
        $.each(bookList.books, function(i, book) {
            var tr = $('#book_0').clone();
            tr.attr('class', 'bookRow');
            tr.attr('id', 'book_' + (i + 1));
            var viewLink = tr.find('td.bookTitle').find('a');
            viewLink.attr('href', viewLink.attr('href') + book.bookId);
            viewLink.html(book.title);
            tr.find('td.bookAuthor').html(book.author);
            var editLink = tr.find('td.editBook').find('a');
            editLink.attr('href', editLink.attr('href') + book.bookId);
            prevSibling.after(tr);
            prevSibling = tr;
            tr.show();
        });
        renderNavLinks(bookList);
        $('#bookData').html(JSON.stringify(bookList));
        $('#bookList').show();
    }
}

function renderBookCount(bookList) {
    var title = $('#title').attr('value');
    var morePages = (bookList.nextResult != null || bookList.prevResult != null);
    if (morePages) {
        $('#bookCount').html(
                'Displaying ' + (bookList.firstResult + 1) + ' - '
                        + (bookList.firstResult + bookList.count) + ' of '
                        + bookList.total + ' books' + (title ? ' starting with \'' + title + '\'' : ''));
    } else {
        $('#bookCount').html(
                'Displaying ' + bookList.count + ' of ' + bookList.total
                        + ' books' + (title ? ' starting with \'' + title + '\'' : ''));
    }
    $('#bookCount').show();
}

function renderNavLinks(bookList) {
    var morePages = (bookList.nextResult != null || bookList.prevResult != null);
    if (morePages) {
        if (bookList.startResult != null || bookList.prevResult != null) {
            var firstLink = $('#first');
            if (bookList.startResult != null) {
                firstLink.attr('idx', bookList.startResult);
                firstLink.html('First&nbsp;' + bookList.maxResults);
                firstLink.show();
            } else {
                firstLink.hide();
            }
            var prevLink = $('#prev');
            if (bookList.prevResult != null) {
                prevLink.attr('idx', bookList.prevResult);
                prevLink.html('Prev&nbsp;' + bookList.maxResults);
                prevLink.show();
            } else {
                prevLink.hide();
            }
            $('#first-prev').show();
        } else {
            $('#first-prev').hide();
        }
        if (bookList.nextResult != null || bookList.lastResult != null) {
            var nextLink = $('#next');
            if (bookList.nextResult != null) {
                nextLink.attr('idx', bookList.nextResult);
                nextLink.html('Next&nbsp;' + bookList.maxResults);
                nextLink.show();
            } else {
                nextLink.show();
            }
            var lastLink = $('#last');
            if (bookList.lastResult != null) {
                lastLink.attr('idx', bookList.lastResult);
                lastLink.html('Last&nbsp;' + bookList.maxResults);
                lastLink.show();
            } else {
                lastLink.hide();
            }
            $('#next-last').show();
        } else {
            $('#next-last').hide();
        }
        $('.navRow').show();
    } else {
        $('.navRow').hide();
    }
}

function onLoadSearch() {
    var title = $('#title').attr('value');
    if (title == "") {
        $('#bookCount').hide();
        $('#bookList').hide();
        $('#bookData').html("");
    } else {
        var searchUrl = bookServiceUrl + 'search?title=' + $('#title').attr('value');
        $.getJSON(searchUrl, renderBookList);
    }
}

function onClickSearch() {
    onLoadSearch();
    return false;
}

function onClickFirstSearch() {
    $.getJSON(bookServiceUrl + 'search.html?title=' + $('#title').attr('value') + '&firstResult='
            + $('#first').attr('idx'), renderBookList);
    return false;
}

function onClickPrevSearch() {
    $.getJSON(bookServiceUrl + 'search.html?title=' + $('#title').attr('value') + '&firstResult='
            + $('#prev').attr('idx'), renderBookList);
    return false;
}

function onClickNextSearch() {
    $.getJSON(bookServiceUrl + 'search.html?title=' + $('#title').attr('value') + '&firstResult='
            + $('#next').attr('idx'), renderBookList);
    return false;
}

function onClickLastSearch() {
    $.getJSON(bookServiceUrl + 'search.html?title=' + $('#title').attr('value') + '&firstResult='
            + $('#last').attr('idx'), renderBookList);
    return false;
}

function searchTimer() {
    var currentText = $('#title').attr('value');
    if (currentText != searchText) {
        searchText = currentText;
        onLoadSearch();
    }
    setTimeout(searchTimer, 1000);
}

function autoComplete(request, response) {
    var searchUrl = bookServiceUrl + 'search?title=' + request.term + '&maxResults=' + maxAutoComplete;
    $.getJSON(searchUrl, function(bookList) {
        var results = [];
        $.each(bookList.books, function(i, book) {
            results.push(book.title);
        });
        response(results);
    });
}

/*******************************************************************************
 * addForm.html functions
 */

function onSubmitAdd() {
    $.post(bookServiceUrl, $('form').serializeArray(), function() {
        window.location = 'index.html';
    }, 'json');
    return false;
}

/*******************************************************************************
 * editForm.html functions
 */

function onLoadEditForm() {
    var bookId = $.url().param('bookId');
    if (bookId == null) {
        $('#editForm').replaceWith('<p>Missing bookId.</p>');
    } else {
        $.getJSON(bookServiceUrl + 'book/' + bookId, function(book) {
            $('#title').attr('value', book.title);
            $('#author').attr('value', book.author);
            $('#bookId').attr('value', book.bookId);
            $('#bookData').replaceWith(JSON.stringify(book));
        });
    }
}

function onSubmitEdit() {
    var book = $('form').serializeJSON();
    delete book.submit;
    $.ajax(bookServiceUrl + 'book/' + $('#bookId').attr('value'), {
        type : 'PUT',
        contentType : 'application/json',
        data : JSON.stringify(book),
        processData : false,
        success : function() {
            window.location = 'index.html';
        }
    });
    return false;
}

/*******************************************************************************
 * view.html functions
 */

function onLoadView() {
    var bookId = $.url().param('bookId');
    if (bookId == null) {
        $('#bookView').replaceWith('<p>Missing bookId.</p>');
    } else {
        $.getJSON(bookServiceUrl + 'book/' + bookId, function(book) {
            $('#title').html(book.title);
            $('#author').html(book.author);
            $('#editForm').attr('action',
                    $('#editForm').attr('action') + book.bookId);
            $('#bookData').replaceWith(JSON.stringify(book));
        });
    }
}

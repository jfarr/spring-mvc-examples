/*******************************************************************************
 * global variables
 */

var bookServiceUrl = 'http://localhost:8080/hibernate-search-example/library/books/';
var searchText = '';
var maxAutoComplete = 5;
var addDialog;
var editDialog;
var confirmDeleteDialog;

function onLoad() {
    $('#first').click(onClickFirst);
    $('#next').click(onClickNext);
    $('#prev').click(onClickPrev);
    $('#last').click(onClickLast);
    $('#add-link').click(onClickAdd);

    addDialog = $('#add-dialog')
        .dialog({
            autoOpen: false,
            title: 'Add Book',
            resizable: false,
            modal: true,
            buttons: {
                "Save": function() {
                    onAddDialogSubmit();
                },
                "Cancel": function() {
                    closeAddDialog();
                }
            }
        });

    editDialog = $('#edit-dialog')
        .dialog({
            autoOpen: false,
            title: 'Edit Book',
            resizable: false,
            modal: true,
            buttons: {
                "Save": function() {
                    onEditDialogSubmit();
                },
                "Cancel": function() {
                    closeEditDialog();
                }
            }
        });
    
    $('#confirm-delete').hide();

    searchText = $('#title').attr('value');
    setTimeout(searchTimer, 1000);
    $('#title').autocomplete({
        source : autoComplete
    });
    
    renderSearchList();
}

function renderSearchList() {
    var title = $('#title').attr('value');
    if (title == "") {
        listBooks();
    } else {
        var searchUrl = bookServiceUrl + 'search?contains=' + title;
        $.getJSON(searchUrl, renderBookList);
    }
}

function listBooks() {
    $.getJSON(bookServiceUrl, renderBookList);
}

function renderBookList(bookList) {
    $('.bookRow').remove();
    if (bookList.books.length == 0) {
        var title = $('#title').attr('value');
        $('#bookCount').html('Library contains no books' + (title ? ' containing \'' + title + '\'' : ''));
        $('#bookList').hide();
    } else {
        renderBookCount(bookList);

        var morePages = (bookList.nextResult != null || bookList.prevResult != null);
        var prevSibling = $('#book_0');
        $.each(bookList.books, function(i, book) {
            var tr = $('#book_0').clone();
            tr.attr('class', 'bookRow');
            tr.attr('id', 'book_' + (i + 1));0
            var viewLink = tr.find('td.bookTitle').find('a');
            viewLink.attr('href', viewLink.attr('href') + book.bookId);
            viewLink.html(book.title);
            tr.find('td.bookAuthor').html(book.author);
            tr.find('a.edit-link').click(function () { 
                onClickEdit(book); 
                return false; 
                });
            tr.find('a.delete-link').click(function () { 
                onClickDelete(book); 
                return false; 
                });
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
                        + bookList.total + ' books' + (title ? ' containing \'' + title.trim() + '\'' : ''));
    } else {
        $('#bookCount').html(
                'Displaying ' + bookList.count + ' of ' + bookList.total
                        + ' books' + (title ? ' containing \'' + title.trim() + '\'' : ''));
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

function onClickSearch() {
    renderSearchList();
    return false;
}

function onClickFirst() {
    var title = $('#title').attr('value');
    if (title == '') {
        $.getJSON(bookServiceUrl + '?firstResult=' + $('#first').attr('idx'), renderBookList);
    } else {
        $.getJSON(bookServiceUrl + 'search?contains=' + $('#title').attr('value') + '&firstResult='
                + $('#first').attr('idx'), renderBookList);
    }
    return false;
}

function onClickPrev() {
    var title = $('#title').attr('value');
    if (title == '') {
        $.getJSON(bookServiceUrl + '?firstResult=' + $('#prev').attr('idx'), renderBookList);
    } else {
        $.getJSON(bookServiceUrl + 'search?contains=' + $('#title').attr('value') + '&firstResult='
                + $('#prev').attr('idx'), renderBookList);
    }
    return false;
}

function onClickNext() {
    var title = $('#title').attr('value');
    if (title == '') {
        $.getJSON(bookServiceUrl + '?firstResult=' + $('#next').attr('idx'), renderBookList);
    } else {
        $.getJSON(bookServiceUrl + 'search?contains=' + $('#title').attr('value') + '&firstResult='
                + $('#next').attr('idx'), renderBookList);
    }
    return false;
}

function onClickLast() {
    var title = $('#title').attr('value');
    if (title == '') {
        $.getJSON(bookServiceUrl + '?firstResult=' + $('#last').attr('idx'), renderBookList);
    } else {
        $.getJSON(bookServiceUrl + 'search?contains=' + $('#title').attr('value') + '&firstResult='
                + $('#last').attr('idx'), renderBookList);
    }
    return false;
}

function searchTimer() {
    var currentText = $('#title').attr('value');
    if (currentText != searchText) {
        searchText = currentText;
        renderSearchList();
    }
    setTimeout(searchTimer, 1000);
}

function autoComplete(request, response) {
    var searchUrl = bookServiceUrl + 'search?prefix=' + request.term + '&maxResults=' + maxAutoComplete;
    $.getJSON(searchUrl, function(bookList) {
        var results = [];
        $.each(bookList.books, function(i, book) {
            results.push(truncate(book.title, 5));
        });
        response(results);
    });
}

function truncate(text, maxCapWords) {
    var words = [];
    var capwords = 0;
    $.each(text.split(' '), function(i, word) { 
        if (capwords < maxCapWords) {
            words.push(word);
            if (word.charAt(0) == word.toUpperCase().charAt(0)) {
                capwords += 1;
            }
        }
    });
    return words.join(' ');
}

function onClickAdd() {
    $('#add-form [name=title]').attr('value', '');
    $('#add-form [name=author]').attr('value', '');
    addDialog.dialog('open');
    return false;
}

function onAddDialogSubmit() {
    $.post(bookServiceUrl, 
            $('#add-form').serializeArray(),
            listBooks,
            'json');
    closeAddDialog();
    return false;
}

function closeAddDialog() {
    $('#add-dialog').dialog('close');
    $('#add-form [name=title]').attr('value', '');
    $('#add-form [name=author]').attr('value', '');
}

function onClickEdit(book) {
    $('#edit-form [name=title]').attr('value', book.title);
    $('#edit-form [name=author]').attr('value', book.author);
    $('#edit-form [name=bookId]').attr('value', book.bookId);
    editDialog.dialog('open');
    return false;
}

function onEditDialogSubmit() {
    var bookId = $('#edit-form [name=bookId]').attr('value');
    var book = $('#edit-form').serializeJSON();
    $.ajax(bookServiceUrl + 'book/' + bookId, {
        type : 'PUT',
        contentType : 'application/json',
        data : JSON.stringify(book),
        processData : false,
        success : listBooks 
    });
    closeEditDialog();
    return false;
}

function closeEditDialog() {
    $('#edit-form [name=title]').attr('value', '');
    $('#edit-form [name=author]').attr('value', '');
    $('#edit-dialog').dialog('close');
}

function onClickDelete(book) {
    confirmDeleteDialog = $('#confirm-delete').dialog({
        autoOpen: false,
        title: 'Confirm Delete',
        resizable: false,
        modal: true,
        buttons: {
            "Delete": function() {
                onConfirmDelete(book);
            },
            "Cancel": function() {
                closeConfirmDelete();
            }
        }
    });
    confirmDeleteDialog.find('#confirm-title').html(book.title);
    confirmDeleteDialog.dialog('open');
    return false;
}

function onConfirmDelete(book) {
    $.ajax(bookServiceUrl + 'book/' + book.bookId, {
        type : 'DELETE',
        success : function() {
            closeConfirmDelete(); 
            listBooks();
        }
    });
}

function closeConfirmDelete() {
    $('#confirm-delete').dialog('close'); 
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
            $('#bookData').html(JSON.stringify(book));
        });
    }
}

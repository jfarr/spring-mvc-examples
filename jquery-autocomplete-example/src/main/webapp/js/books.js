/*******************************************************************************
 * global variables
 */

var bookServiceUrl = 'http://hibernate-example.cloudfoundry.com/library/books/';
var bookServiceUrlList = [
    'http://hibernate-example.cloudfoundry.com/library/books/',
    'http://localhost:8080/hibernate-example/library/books/'
];
var searchText = '';
var maxAutoComplete = 5;
var addDialog;
var editDialog;
var viewDialog;
var confirmDeleteDialog;

function onLoad() {
    $('#clear').button();
    $('#clear').click(onClearSearch);
    $('#first').click(onClickFirst);
    $('#next').click(onClickNext);
    $('#prev').click(onClickPrev);
    $('#last').click(onClickLast);
    $('#add-link').click(onClickAdd);
    $('#bookServiceUrl').change(onChangeUrl);

    addDialog = $('#add-dialog')
        .dialog({
            autoOpen: false,
            title: 'Add Book',
            resizable: false,
            modal: true,
            width: 600,
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
            width: 600,
            buttons: {
                "Save": function() {
                    onEditDialogSubmit();
                },
                "Cancel": function() {
                    closeEditDialog();
                }
            }
        });

    viewDialog = $('#view-dialog')
        .dialog({
            autoOpen: false,
            title: 'View Book',
            resizable: false,
            modal: true,
            width: 600
        });
    
    $('#confirm-delete').hide();

    searchText = $('#search-title').attr('value');
    setTimeout(searchTimer, 1000);
    $('#search-title').autocomplete({
        source : autoComplete
    });
    
    renderBookServiceUrlSelect();
    renderSearchList();
}

function renderBookServiceUrlSelect() {
    $('#bookServiceUrl').html('');
    $.each(bookServiceUrlList, function(i, url) {
        var option = document.createElement('option');
        $(option).attr('value', url);
        var text = document.createTextNode(url);
        option.appendChild(text);
        $(option).appendTo('#bookServiceUrl');
    });
}

function onChangeUrl(event) {
    bookServiceUrl = $('#bookServiceUrl option:selected')[0].value;
    renderSearchList();
}

function renderSearchList() {
    var title = $('#search-title').attr('value');
    if (title == "") {
        $.getJSON(bookServiceUrl, renderBookList);
    } else {
        var searchUrl = bookServiceUrl + 'search?contains=' + title;
        $.getJSON(searchUrl, renderBookList);
    }
}

function renderBookList(bookList) {
    $('.bookRow').remove();
    $('#book_0').hide();
    if (bookList.books.length == 0) {
        var title = $('#search-title').attr('value');
        $('#bookCount').html('Library contains no books' + (title ? ' containing \'' + title + '\'' : '') + '.');
        $('#bookList').hide();
    } else {
        renderBookCount(bookList);
        renderBooks(bookList);
        renderNavLinks(bookList);
        $('#bookData').html(JSON.stringify(bookList));
        $('#bookList').show();
    }
}

function renderBooks(bookList) {
    var prevSibling = $('#book_0');
    $.each(bookList.books, function(i, book) {
        var tr = $('#book_0').clone();
        tr.attr('id', 'book_' + (i + 1));
        tr.attr('class', 'bookRow');
        tr.find('a.view-link').html(book.title);
        tr.find('a.view-link').click(function() {
            onClickView(book);
            return false;
        });
        tr.find('td.author').html(book.author);
        tr.find('a.edit-link').click(function() { 
            onClickEdit(book); 
            return false; 
            });
        tr.find('a.delete-link').click(function() { 
            onClickDelete(book); 
            return false; 
            });
        prevSibling.after(tr);
        prevSibling = tr;
        tr.show();
    });
}

function renderBookCount(bookList) {
    var title = $('#search-title').attr('value');
    var morePages = (bookList.nextResult != null || bookList.prevResult != null);
    if (morePages) {
        $('#bookCount').html(
                'Displaying ' + (bookList.firstResult + 1) + ' - '
                        + (bookList.firstResult + bookList.count) + ' of '
                        + bookList.total + ' books' + (title ? ' containing \'' + title.trim() + '\'' : '') + '.');
    } else {
        $('#bookCount').html(
                'Displaying ' + bookList.count + ' of ' + bookList.total
                        + ' books' + (title ? ' containing \'' + title.trim() + '\'' : '') + '.');
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
            $('.prev-links').show();
        } else {
            $('.prev-links').hide();
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
            $('.next-links').show();
        } else {
            $('.next-links').hide();
        }
        $('.nav-links').show();
    } else {
        $('.nav-links').hide();
    }
}

function onClickFirst() {
    var title = $('#search-title').attr('value');
    if (title == '') {
        $.getJSON(bookServiceUrl + '?firstResult=' + $('#first').attr('idx'), renderBookList);
    } else {
        $.getJSON(bookServiceUrl + 'search?contains=' + $('#search-title').attr('value') + '&firstResult='
                + $('#first').attr('idx'), renderBookList);
    }
    return false;
}

function onClickPrev() {
    var title = $('#search-title').attr('value');
    if (title == '') {
        $.getJSON(bookServiceUrl + '?firstResult=' + $('#prev').attr('idx'), renderBookList);
    } else {
        $.getJSON(bookServiceUrl + 'search?contains=' + $('#search-title').attr('value') + '&firstResult='
                + $('#prev').attr('idx'), renderBookList);
    }
    return false;
}

function onClickNext() {
    var title = $('#search-title').attr('value');
    if (title == '') {
        $.getJSON(bookServiceUrl + '?firstResult=' + $('#next').attr('idx'), renderBookList);
    } else {
        $.getJSON(bookServiceUrl + 'search?contains=' + $('#search-title').attr('value') + '&firstResult='
                + $('#next').attr('idx'), renderBookList);
    }
    return false;
}

function onClickLast() {
    var title = $('#search-title').attr('value');
    if (title == '') {
        $.getJSON(bookServiceUrl + '?firstResult=' + $('#last').attr('idx'), renderBookList);
    } else {
        $.getJSON(bookServiceUrl + 'search?contains=' + $('#search-title').attr('value') + '&firstResult='
                + $('#last').attr('idx'), renderBookList);
    }
    return false;
}

function searchTimer() {
    var currentText = $('#search-title').attr('value');
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

function onClearSearch() {
    searchText = '';
    $('#search-title').attr('value', '');
    renderSearchList();
    return false;
}

function onClickView(book) {
    $('#view-dialog .title').html(book.title);
    $('#view-dialog .author').html(book.author);
    viewDialog.dialog('open');
}

function closeViewDialog() {
    $('#view-dialog').dialog('close'); 
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
            renderSearchList,
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
}

function onEditDialogSubmit() {
    var bookId = $('#edit-form [name=bookId]').attr('value');
    var book = $('#edit-form').serializeJSON();
    $.ajax(bookServiceUrl + 'book/' + bookId, {
        type : 'PUT',
        contentType : 'application/json',
        data : JSON.stringify(book),
        processData : false,
        success : renderSearchList 
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
        width: 600,
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
            renderSearchList();
        }
    });
}

function closeConfirmDelete() {
    $('#confirm-delete').dialog('close'); 
}

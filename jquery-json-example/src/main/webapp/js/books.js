/*******************************************************************************
 * global variables
 */

var bookServiceUrl = 'http://localhost:8080/rest-app-example/library/books/';

/*******************************************************************************
 * index.html functions
 */

function onLoadList() {
    $.getJSON(
        bookServiceUrl,
        function(books) {
            if (books.length == 0) {
                $('#bookList').replaceWith('<p>Library contains no books.</p>');
            } else {
                $.each(books, function(i, book) {
                    var tr = $('#book_0').clone();
                    tr.attr('id', 'book_' + (i + 1));
                    var viewLink = tr.find('td.bookTitle').find('a');
                    viewLink.attr('href', viewLink.attr('href') + book.bookId);
                    viewLink.html(book.title);
                    tr.find('td.bookAuthor').html(book.author);
                    var editLink = tr.find('td.editBook').find('a');
                    editLink.attr('href', editLink.attr('href') + book.bookId);
                    $('#bookListContent').append(tr);
                });
                $('#book_0').remove();
                $('#bookData').replaceWith(JSON.stringify(books));
            }
        });
}

/*******************************************************************************
 * addForm.html functions
 */

function onSubmitAdd() {
    $.post(
        bookServiceUrl, 
        $('form').serializeArray(),
        function() { window.location = 'index.html'; },
        'json');
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
        $.getJSON(
            bookServiceUrl + 'book/' + bookId,
            function(book) {
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
    $.ajax(
        bookServiceUrl + 'book/' + $('#bookId').attr('value'), {
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(book),
            processData: false,
            success: function() { window.location = 'index.html'; }
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
        $.getJSON(
            bookServiceUrl + 'book/' + bookId,
            function(book) {
                $('#title').html(book.title);
                $('#author').html(book.author);
                $('#editForm').attr('action', $('#editForm').attr('action') + book.bookId);
                $('#bookData').replaceWith(JSON.stringify(book));
            });
    }
}

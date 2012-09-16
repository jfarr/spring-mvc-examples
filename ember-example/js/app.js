
App = Em.Application.create({
    ready: function() {
        App.bookController.onLoad();
    }
});

App.bookController = Em.ArrayController.create({
    
    bookServiceUrl: 'http://hibernate-example.cloudfoundry.com/library/books/',
    
    bookServiceUrlList: [
        'http://hibernate-example.cloudfoundry.com/library/books/',
        'http://localhost:8080/hibernate-example/library/books/'
    ],
    
    bookServiceUrlChanged: function() {
        this.loadList();
    }.observes('bookServiceUrl'),

    content: [],

    // search text input field current value
    inputTitle: null,
    // current search value
    searchTitle: null,

    // current book
    book: null,

    // index of the first item on the page
    firstIndex: null,
    // starting index of the last page
    lastIndex: null,
    // starting index of the next page 
    nextResult: null,
    // starting index of the previous page
    prevResult: null,
    // max results per page
    maxResults: null,
    // item count for this page
    count: null,
    // total item count
    total: null,
    
    // maximum number of auto-complete entries
    maxAutoComplete: 5,
    // maximum number of capitalized words before truncating auto-complete entries
    maxCapWords: 5,
    
    // number of the first item on the page as displayed in the UI
    firstResult: function() {
        var firstIndex = this.get('firstIndex');
        return firstIndex == null ? null : firstIndex + 1;
    }.property('firstIndex'),
    
    // number of the last item on the page as displayed in the UI
    lastResult: function() {
        var firstIndex = this.get('firstIndex');
        var count = this.get('count');
        return count == null ? null : (firstIndex == null ? count : firstIndex + count);
    }.property('firstIndex', 'count'),
    
    // true if more pages, otherwise false
    morePages: function() {
        return this.get('nextResult') || this.get('prevResult');
    }.property('nextResult', 'prevResult'),
    
    // true if has a previous page, otherwise false
    hasPrevResult: function() {
        return this.get('prevResult') != null;
    }.property('prevResult'),
    
    onLoad: function() {
        App.BookListView.create().append();
        App.AddDialog.create().append();
        App.ViewDialog.create().append();
        App.EditDialog.create().append();
        App.ConfirmDeleteDialog.create().append();
        this.loadList();
        this.searchTimer();
    },
    
    loadList: function(firstResult) {
        var self = this;
        $.getJSON(this.getBookListUrl(firstResult), function(bookList) {
            self.update(bookList);
        });
    },

    getBookListUrl: function(firstResult) {
        var url = this.get('bookServiceUrl');
        var title = this.get('searchTitle');
        if (title) {
            url += 'search?contains=' + title;
            if (firstResult != null) {
                url += "&firstResult=" + firstResult;
            }
        } else if (firstResult != null) {
            url += "?firstResult=" + firstResult;
        }
        return url;
    },
    
    search: function(title) {
        this.set('inputTitle', title);
        this.set('searchTitle', title);
        this.loadList(this.get('firstIndex'));
    },
    
    update: function(bookList) {
        this.set('content', bookList.books);
        this.set('firstIndex', bookList.firstResult);
        this.set('lastIndex', bookList.lastResult);
        this.set('nextResult', bookList.nextResult);
        this.set('prevResult', bookList.prevResult);
        this.set('maxResults', bookList.maxResults);
        this.set('count', bookList.count);
        this.set('total', bookList.total);
    },
    
    autoCompleteTitle: function(request, response) {
        var self = this;
        var searchUrl = this.bookServiceUrl + 'search?prefix=' + request.term + '&maxResults=' + this.maxAutoComplete;
        $.getJSON(searchUrl, function(bookList) {
            var results = [];
            $.each(bookList.books, function(i, book) {
                results.push(self.truncate(book.title));
            });
            response(results);
        });
    },

    truncate: function(text) {
        var words = [];
        var capwords = 0;
        var self = this;
        $.each(text.split(' '), function(i, word) { 
            if (capwords < self.maxCapWords) {
                words.push(word);
                if (word.charAt(0) == word.toUpperCase().charAt(0)) {
                    capwords += 1;
                }
            }
        });
        return words.join(' ');
    },

    searchTimer: function(self) {
        self = self == null ? this : self;
        if (self.get('inputTitle') != self.get('searchTitle')) {
            self.set('searchTitle', self.get('inputTitle'));
            self.loadList();
        }
        setTimeout(function() {
            self.searchTimer(self);
        }, 1000);
    },
    
    clearSearch: function() {
        this.set('inputTitle', '');
        this.set('searchTitle', '');
        this.loadList();
    },
    
    onClickFirst: function() {
        this.loadList();
    },
    
    onClickPrev: function() {
        this.loadList(this.get('prevResult'));
    },
    
    onClickNext: function() {
        this.loadList(this.get('nextResult'));
    },
    
    onClickLast: function() {
        this.loadList(this.get('lastIndex'));
    },
    
    onClickAdd: function() {
        this.set('book', {title: null, author: null});
        $('#add-dialog').dialog('open');
    },
    
    onSaveAdd: function() {
        this.addBook(this.get('book'));
    },
    
    onClickView: function(bookId) {
        this.loadBook(bookId, function() {
            $('#view-dialog').dialog('open');
        });
    },
    
    onClickEdit: function(bookId) {
        this.loadBook(bookId, function() {
            $('#edit-dialog').dialog('open');
        });
    },
    
    onSaveEdit: function() {
        this.updateBook(this.get('book'));
    },
    
    onClickDelete: function(bookId) {
        this.loadBook(bookId, function() {
            $('#confirm-delete-dialog').dialog('open');
        });
    },
    
    onConfirmDelete: function() {
        this.deleteBook(this.get('book'));
    },

    addBook: function(book) {
        var self = this;
        $.ajax(this.get('bookServiceUrl'), {
            type : 'POST',
            contentType : 'application/json',
            data : JSON.stringify(book),
            processData : false,
            success : function() { 
                 self.loadList(self.get('firstIndex'));
            } 
        });
    },
    
    loadBook: function(bookId, success) {
        var self = this;
        var url = this.get('bookServiceUrl') + 'book/' + bookId;
        $.getJSON(url, function(book) {
            self.set('book', book);
            if (success) {
                success();
            }
        });
    },
    
    updateBook: function(book) {
        var self = this;
        $.ajax(this.get('bookServiceUrl') + 'book/' + book.bookId, {
            type : 'PUT',
            contentType : 'application/json',
            data : JSON.stringify({
                title: book.title,
                author: book.author
            }),
            processData : false,
            beforeSend: function() {
                $('#spinner_' + book.bookId).show();
            },
            success : function() { 
                 self.loadList(self.get('firstIndex'));
            }, 
            complete: function() {
                $('#spinner_' + book.bookId).hide();
            }
        });
    },
    
    deleteBook: function(book) {
        var self = this;
        $.ajax(this.get('bookServiceUrl') + 'book/' + book.bookId, {
            type : 'DELETE',
            beforeSend: function() {
                $('#spinner_' + book.bookId).show();
            },
            success : function() { 
                 self.loadList(self.get('firstIndex'));
            }, 
            complete: function() {
                $('#spinner_' + book.bookId).hide();
            }
        });
    }
});

App.SearchTitleField = JQ.AutoComplete.extend({
    elementId: 'searchTitle',
    valueBinding: 'App.bookController.inputTitle',
    
    source: function(request, response) {
        App.bookController.autoCompleteTitle(request, response);
    },
    
    select: function(event, ui) {
        App.bookController.search(ui.item.value);
    }
});

App.ClearButton = JQ.Button.extend({
    elementId: ['clear-button'],
    click : function() {
        event.preventDefault(event);
        App.bookController.clearSearch();
    }
});

App.BookListView = Em.View.extend({
    controller: App.bookController,
    templateName: 'book-list-template',
    elementId: ['list-view'],
    
    onClickAdd: function(event) {
        this.controller.onClickAdd();
    },
    
    onClickView: function(event) {
        var bookId = event.target.attributes.getNamedItem('bookId').value;
        this.controller.onClickView(bookId);
    },
    
    onClickEdit: function(event) {
        var bookId = event.target.attributes.getNamedItem('bookId').value;
        this.controller.onClickEdit(bookId);
    },
    
    onClickDelete: function(event) {
        var bookId = event.target.attributes.getNamedItem('bookId').value;
        this.controller.onClickDelete(bookId);
    },

    onClickFirst: function(event) {
        this.controller.onClickFirst();
    },
    
    onClickPrev: function(event) {
        this.controller.onClickPrev();
    },
    
    onClickNext: function(event) {
        this.controller.onClickNext();
    },
    
    onClickLast: function(event) {
        this.controller.onClickLast();
    }
});

App.AddDialog = JQ.Dialog.extend({
    controller: App.bookController,
    elementId: 'add-dialog',
    templateName: 'add-dialog-template',
    autoOpen: false,
    title: 'Add Book',
    resizable: false,
    modal: true,
    width: 550,
    buttons: {
        "Save": function() {
            App.bookController.onSaveAdd();
            $('#add-dialog').dialog('close');
        },
        "Cancel": function() {
            $('#add-dialog').dialog('close');
        }
    }
});

App.ViewDialog = JQ.Dialog.extend({
    controller: App.bookController,
    elementId: 'view-dialog',
    templateName: 'view-dialog-template',
    autoOpen: false,
    title: 'View Book',
    resizable: false,
    modal: true,
    width: 550,
    buttons: {
        "Close": function() {
            $('#view-dialog').dialog('close');
        }
    }
});

App.EditDialog = JQ.Dialog.extend({
    controller: App.bookController,
    elementId: 'edit-dialog',
    templateName: 'edit-dialog-template',
    autoOpen: false,
    title: 'Edit Book',
    resizable: false,
    modal: true,
    width: 550,
    buttons: {
        "Save": function() {
            App.bookController.onSaveEdit();
            $('#edit-dialog').dialog('close');
        },
        "Cancel": function() {
            $('#edit-dialog').dialog('close');
        }
    }
});

App.ConfirmDeleteDialog = JQ.Dialog.extend({
    controller: App.bookController,
    elementId: 'confirm-delete-dialog',
    templateName: 'confirm-delete-dialog-template',
    autoOpen: false,
    title: 'Confirm Delete',
    resizable: false,
    modal: true,
    width: 550,
    buttons: {
        "Delete": function() {
            App.bookController.onConfirmDelete();
            $('#confirm-delete-dialog').dialog('close');
        },
        "Cancel": function() {
            $('#confirm-delete-dialog').dialog('close');
        }
    }
});

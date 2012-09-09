
App = Em.Application.create({
    ready: function() {
        App.bookController.onLoad();
    }
});

App.bookController = Em.ArrayController.create({
    
    bookServiceUrl: 'http://localhost:8080/hibernate-search-example/library/books/',
    
    content: [],

    addDialog: null,
    
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
        this.createDialogs();
        this.loadList();
        this.searchTimer();
    },
    
    createDialogs: function() {
        var self = this;
        Ember.run.later(function() {
            self.addDialog = $('#add-dialog').dialog({
                autoOpen: false,
                title: 'Add Book',
                resizable: false,
                modal: true,
                width: 550,
                buttons: {
                    "Save": function() {
                        self.addBook({
                            title: self.get('book.title'), 
                            author: self.get('book.author')
                        });
                        self.closeAddDialog();
                    },
                    "Cancel": function() {
                        self.closeAddDialog();
                    }
                }
            });
            self.viewDialog = $('#view-dialog').dialog({
                autoOpen: false,
                title: 'View Book',
                resizable: false,
                modal: true,
                width: 550
            });
            self.editDialog = $('#edit-dialog').dialog({
                autoOpen: false,
                title: 'Edit Book',
                resizable: false,
                modal: true,
                width: 550,
                buttons: {
                    "Save": function() {
                        self.updateBook(self.get('book'));
                        self.closeEditDialog();
                    },
                    "Cancel": function() {
                        self.closeEditDialog();
                    }
                }
            });
            self.confirmDeleteDialog = $('#confirm-delete-dialog').dialog({
                autoOpen: false,
                title: 'Confirm Delete',
                resizable: false,
                modal: true,
                width: 550,
                buttons: {
                    "Delete": function() {
                        self.deleteBook(self.get('book'));
                        self.closeConfirmDeleteDialog();
                    },
                    "Cancel": function() {
                        self.closeConfirmDeleteDialog();
                    }
                }
            });
        }, 100) ;  
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
        this.addDialog.dialog('open');
    },
    
    closeAddDialog: function() {
        this.addDialog.dialog('close');
    },
    
    onClickView: function(bookId) {
        var self = this;
        this.loadBook(bookId, function() {
            self.viewDialog.dialog('open');
        });
    },
    
    onClickEdit: function(bookId) {
        var self = this;
        this.loadBook(bookId, function() {
            self.get('editDialog').dialog('open');
        });
    },
    
    closeEditDialog: function() {
        this.get('editDialog').dialog('close');
    },
    
    onClickDelete: function(bookId) {
        var self = this;
        this.loadBook(bookId, function() {
            self.loadBook(bookId, function() {
                self.get('confirmDeleteDialog').dialog('open');
            });
        });
    },
    
    closeConfirmDeleteDialog: function() {
        this.get('confirmDeleteDialog').dialog('close');
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
            success : function() { 
                 self.loadList(self.get('firstIndex'));
            } 
        });
    },
    
    deleteBook: function(book) {
        var self = this;
        $.ajax(this.get('bookServiceUrl') + 'book/' + book.bookId, {
            type : 'DELETE',
            success : function() { 
                 self.loadList(self.get('firstIndex'));
            } 
        });
    }
});

App.SearchForm = Ember.View.extend({
    tagName: 'form',
    controller: App.bookController,
    
    clear: function(event) {
        event.preventDefault();
        this.get('controller').clearSearch();
    }
});

App.SearchTitleField = JQ.AutoComplete.extend({
    source: function(request, response) {
        App.bookController.autoCompleteTitle(request, response);
    },
    attributeBindings: ['name'],
    name: 'searchTitle',
    valueBinding: 'App.bookController.inputTitle'
});

App.BookListView = Em.View.extend({
    controller: App.bookController,
    templateName: 'book-list-template',
    
    onClickAdd: function(event) {
        this.get('controller').onClickAdd();
    },
    
    onClickView: function(event) {
        var bookId = event.target.attributes.getNamedItem('bookId').value;
        this.get('controller').onClickView(bookId);
    },
    
    onClickEdit: function(event) {
        var bookId = event.target.attributes.getNamedItem('bookId').value;
        this.get('controller').onClickEdit(bookId);
    },
    
    onClickDelete: function(event) {
        var bookId = event.target.attributes.getNamedItem('bookId').value;
        this.get('controller').onClickDelete(bookId);
    },

    onClickFirst: function(event) {
        this.get('controller').onClickFirst();
    },
    
    onClickPrev: function(event) {
        this.get('controller').onClickPrev();
    },
    
    onClickNext: function(event) {
        this.get('controller').onClickNext();
    },
    
    onClickLast: function(event) {
        this.get('controller').onClickLast();
    }
});

App.AddDialog = Ember.View.extend({
    templateName: 'add-dialog-template'
});

App.AddForm = Ember.View.extend({
    tagName: 'form',
    controller: App.bookController
});

App.ViewDialog = Em.View.extend({
    templateName: 'view-dialog-template',
    controller: App.bookController
});

App.EditDialog = Ember.View.extend({
    templateName: 'edit-dialog-template'
});

App.EditForm = Ember.View.extend({
    tagName: 'form',
    controller: App.bookController
});

App.ConfirmDeleteDialog = Ember.View.extend({
    templateName: 'confirm-delete-dialog-template',
    controller: App.bookController
});

App.BookListView.create().append();
App.AddDialog.create().append();
App.ViewDialog.create().append();
App.EditDialog.create().append();
App.ConfirmDeleteDialog.create().append();

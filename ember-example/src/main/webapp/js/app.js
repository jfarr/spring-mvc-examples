
App = Ember.Application.create({
    ready: function() {
        App.bookController.onLoad();
    }
});

App.bookController = Ember.ArrayController.create({
    
    bookServiceUrl: 'http://localhost:8080/hibernate-search-example/library/books/',
    
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
    
    addBook: function(title, author) {
        this.pushObject(App.Book.create({title: title, author: author}));
    },
    
    onLoad: function() {
        this.createDialogs();
        this.loadList();
        this.searchTimer();
        
    },
    
    createDialogs: function() {
        var self = this;
        this.addDialog = $('#add-dialog').dialog({
            autoOpen: false,
            title: 'Add Book',
            resizable: false,
            modal: true,
            width: 600,
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
        this.viewDialog = $('#view-dialog').dialog({
            autoOpen: false,
            title: 'View Book',
            resizable: false,
            modal: true,
            width: 600
        });
        this.editDialog = $('#edit-dialog').dialog({
            autoOpen: false,
            title: 'Edit Book',
            resizable: false,
            modal: true,
            width: 600,
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
        this.confirmDeleteDialog = $('#confirm-delete-dialog').dialog({
            autoOpen: false,
            title: 'Confirm Delete',
            resizable: false,
            modal: true,
            width: 600,
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
    },
    
    loadList: function(firstResult) {
        var self = this;
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
        $.getJSON(url, function(bookList) {
            self.update(bookList);
        });
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
    
    search: function() {
        this.set('searchTitle', this.get('inputTitle'));
        this.loadList();
    },
    
    clearSearch: function() {
        this.set('inputTitle', '');
        this.set('searchTitle', '');
        this.loadList();
    },
    
    onClickAdd: function() {
        this.set('book', {title: null, author: null});
        this.get('addDialog').dialog('open');
    },
    
    closeAddDialog: function() {
        this.get('addDialog').dialog('close');
    },
    
    onClickView: function(bookId) {
        var self = this;
        this.loadBook(bookId, function() {
            self.get('viewDialog').dialog('open');
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
    
    loadBook: function(bookId, success) {
        var self = this;
        var url = this.get('bookServiceUrl') + 'book/' + bookId;
        $.getJSON(url, function(book) {
            self.set('book', book);
            success();
        });
    }
});

App.SearchForm = Ember.View.extend({
    tagName: 'form',
    controller: null,
    title: null,
    
    submit: function(event) {
        event.preventDefault();
        this.get('controller').search();
    },

    clear: function(event) {
        event.preventDefault();
        this.set('title.value', '');
        this.get('controller').clearSearch();
    }
});

App.ListView = Em.View.extend({
    controller: null,
    
    onClickAdd: function(event) {
        this.get('controller').onClickAdd();
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
    }
});

App.AddForm = Ember.View.extend({
    tagName: 'form',
    controller: null,
    title: null,
    author: null
});

App.EditForm = Ember.View.extend({
    tagName: 'form',
    controller: null,
    title: null,
    author: null
});

App.DetailView = Em.View.extend({
    controller: null
});

App.ConfirmDeleteDialog = Ember.View.extend({
    controller: null
});

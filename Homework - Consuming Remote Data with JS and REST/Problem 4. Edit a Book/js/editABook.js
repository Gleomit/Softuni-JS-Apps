$(document).ready(function(){
    var baseUrl = 'https://api.parse.com/1/classes/';
    var bookISBNS = [];
    var main = $('main');

    var tabIndex = 0;

    makeRequest('GET', baseUrl + "Book/", null, function(result){
        result.results.forEach(function(currentBook){
            main.prepend(getBookHTML(currentBook.objectId, currentBook.title, currentBook.author, currentBook.isbn));
            bookISBNS.push(currentBook.isbn);

            $('.book').on('click', showForm);
        });
    }, null);

    $('#addBook').on('click', addBook);
    $('#saveBook').on('click', saveBook);

    function addBook(){
        var bookTitle = $('#bookTitle').val().trim();
        var bookAuthor = $('#bookAuthor').val().trim();

        if(bookTitle.length == 0 || bookAuthor.length == 0){
            alert('You left one of the fields empty.');
        } else{
            var uniqueISBN = generateISBN();

            while(bookISBNS.indexOf(uniqueISBN) > -1){
                uniqueISBN = generateISBN();
            }

            makeRequest('POST', baseUrl + 'Book/',
                {
                    title: bookTitle,
                    author: bookAuthor,
                    isbn: uniqueISBN
                }, function(result){
                    bookISBNS.push(uniqueISBN);

                    $('main').prepend(getBookHTML(result.objectId, bookTitle, bookAuthor, uniqueISBN));
                    $('#bookTitle').val('');
                    $('#bookAuthor').val('');
                    $('.book').first().on('click', showForm);
                }, null);
        }
    }

    function showForm(event){
        makeRequest('GET', baseUrl + 'Book/' + $(event.target.parentNode).attr('data-id'), null, function(result){
            $('#editForm').attr('data-id', result.objectId);
            $('#editBookTitle').val(result.title);
            $('#editBookAuthor').val(result.author);
            $('#editBookISBN').val(result.isbn);
        }, null);
    }

    function saveBook(){
        if($('#editForm').attr('data-id') == undefined){
            alert('You must select a book first.');
        } else{
            var bookTitle = $('#editBookTitle').val().trim();
            var bookAuthor = $('#editBookAuthor').val().trim();
            var bookISBN = $('#editBookISBN').val().trim();
            var selectedBook = $('#editForm').attr('data-id');

            if(bookTitle.length == 0 || bookAuthor.length == 0 || bookISBN.length == 0){
                alert('One of the fields is empty');

                var theBook = $(".book[data-id=" + selectedBook + "]");
                $('#editBookTitle').val(theBook.find('h2').first().text());
                $('#editBookAuthor').val(theBook.find('h2').first().next().text().substring(8));
                $('#editBookISBN').val(theBook.find('h2').last().text().substring(6));
            } else{
                makeRequest('PUT', baseUrl + 'Book/' + selectedBook,
                    {
                        title: bookTitle,
                        author: bookAuthor,
                        isbn: bookISBN
                    }, function(result){
                        var theBook = $(".book[data-id=" + selectedBook + "]");

                        theBook.find('h2').first().text("Title: " + bookTitle);
                        theBook.find('h2').first().next().text('Author: ' + bookAuthor);
                        theBook.find('h2').last().text('ISBN: ' + bookISBN);

                        $('#editForm').removeAttr('data-id');

                        $('#editBookTitle').val('');
                        $('#editBookAuthor').val('');
                        $('#editBookISBN').val('');
                    }, null);
            }
        }
    }

    function getBookHTML(objectId, title, author, isbn){
        var htmlToAppend = '<div class="book" data-id="' + objectId + '" tabindex="' + tabIndex + '"><h2 class="showInfo">Title: '
            + title + '</h2>'
            + '<h2>Author: ' + author + '</h3>'
            + '<h2>ISBN: ' + isbn + '</h3>'
            + '</div>';

        tabIndex++;
        return htmlToAppend;
    }

    function generateISBN(){
        var i = 0;
        var isbn = "";

        for(i = 0; i < 13; i += 1){
            if(i == 0){
                isbn += Math.floor((Math.random() * 9) + 1).toString()
            } else{
                isbn += Math.floor((Math.random() * 9) + 0).toString();
            }
        }

        return isbn;
    }

    function makeRequest(method, url, data, success, error){
        $.ajax({
            method: method,
            headers:{
                'X-Parse-Application-Id' : '9aWvS8y2dSQ6QOwHG6I1bqCmYWJltpMlcXFY7sbo',
                'X-Parse-REST-API-Key' : 'iEi0GmpDXhGYIP6ehczN1eyVwGTHklPcYC98D5VW'
            },
            url: url,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: success,
            error: error
        });
    }
});
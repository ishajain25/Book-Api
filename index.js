//Framework
const express = require("express");

//Database
const database = require("./database/index");

//Initialising express
const shapeAI = express();

//Configurations
shapeAI.use(express.json());

/*
 Route               /
 Description         To get all books
 Access              Public
 Parameters          None
 Method              Get
*/

shapeAI.get("/" , (req, res) => {
    return res.json({books: database.books});
});

/*
 Route               /is
 Description         To get specific books based on isbn
 Access              Public
 Parameters          isbn
 Method              Get
*/

shapeAI.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.ISBN === req.params.isbn);

if(getSpecificBook.length === 0) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
}

    return res.json({ book: getSpecificBook});
});

/*
 Route               /c
 Description         To get specific books based on category
 Access              Public
 Parameters          category
 Method              Get
*/

shapeAI.get("/c/:category", (req, res) => {
    const getSpecificBooks = database.books.filter((book) => book.category.includes (req.params.category));

    if(getSpecificBooks.length === 0) {
        return res.json({error: `No book found for the category of ${req.params.category}`});
    }
    
        return res.json({ book: getSpecificBooks});
    });


/*
 Route               /a
 Description         To get specific books based on authors
 Access              Public
 Parameters          authors
 Method              Get
*/

shapeAI.get("/a/:authors", (req, res) => {
    const getSpecificBooksAu = database.books.filter((book) => book.authors.includes (parseInt(req.params.authors)));

    if(getSpecificBooksAu.length === 0) {
        return res.json({error: `No book found for the Author ${req.params.authors}`});
    }
    
        return res.json({ book: getSpecificBooksAu});
    });


/*
 Route               /author
 Description         To get all authors
 Access              Public
 Parameters          None
 Method              Get
*/

shapeAI.get("/author" , (req, res) => {
    return res.json({authors: database.authors});
});

/*
 Route               /au
 Description         To get specific author
 Access              Public
 Parameters          id
 Method              Get
*/
 

shapeAI.get("/au/:id", (req, res) => {
    const getSpecificAuthor = database.authors.filter((author) => author.id === parseInt(req.params.id)); //params take string so for id we hv to  parse

    if(getSpecificAuthor.length === 0) {
        return res.json({error: `No author found with Id ${req.params.id}`});
    }

        return res.json({author: getSpecificAuthor });

});    

/*
 Route               /author/
 Description         To get a list of authors based on a book
 Access              Public
 Parameters          isbn
 Method              Get
*/

shapeAI.get("/author/:isbn", (req, res) => {
    const getSpecificAuthors = database.authors.filter((author) => author.books.includes(req.params.isbn));

    if(getSpecificAuthors.length === 0) {
        return res.json({error: `No author found for the book ${req.params.isbn}`});
    }

    return res.json({authors: getSpecificAuthors });

});

/*
 Route               /publications
 Description         To get all publications
 Access              Public
 Parameters          None
 Method              Get
*/

shapeAI.get("/publications" , (req, res) => {
    return res.json({publications: database.publications});
});

/*
 Route               /book/new
 Description         To add new books
 Access              Public
 Parameters          None
 Method              POST
*/

shapeAI.post("/book/new", (req, res) => {
    //body
    const { newBook } = req.body;

    database.books.push(newBook);

    return res.json({books: database.books, message: "book was added!"});
});

/*
 Route               /author/new
 Description         To add new author
 Access              Public
 Parameters          None
 Method              POST
*/

shapeAI.post("/author/new", (req, res) => {
    //body
    const { newAuthor } = req.body;

    database.authors.push(newAuthor);

    return res.json({books: database.authors, message: "Author was added!"});
});

/*
 Route               /book/update
 Description         To update title of a book
 Access              Public
 Parameters          isbn
 Method              PUT
*/

shapeAI.put("/book/update/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        } 
    });

    return res.json({ books: database.books });
});

/*
 Route               /book/author/update
 Description         To update/add new author
 Access              Public
 Parameters          isbn
 Method              PUT
*/

shapeAI.put("/book/author/update/:isbn", (req, res) => {
    //update the book database 
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) 
            return book.authors.push(req.body.newAuthor);
    });

    //update the author database 
    database.authors.forEach((author) => {
        if(author.id === req.body.newAuthor) 
        return author.books.push (req.params.isbn);
    });

    return res.json({
        books: database.books,
        authors: database.authors,
        message: "New author was added"
    });
});

/*
 Route               /author/name
 Description         To update author name
 Access              Public
 Parameters          id
 Method              PUT
*/

shapeAI.put("/author/name/:id" , (req, res) => {
    database.authors.forEach((author) => {
        if(author.id === parseInt(req.params.id)) {
            author.name = req.body.authorName;
            return;
        }
    });

    return res.json({ authors: database.authors });
});

/*
 Route               /publication/update/book
 Description         Update new book to a publication
 Access              Public
 Parameters          isbn
 Method              PUT
*/

shapeAI.put("/publication/update/book/:isbn" , (req, res) => {
    //update the publication database
    database.publications.forEach((publication) => {
        if(publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }
    });

    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });

    return res.json({
        books: database.books,
        publications: database.publications,
        message: "Successfully updated publication"
    });
});

/*
 Route               /book/delete
 Description         delete a book
 Access              Public
 Parameters          isbn
 Method              DELETE
*/

shapeAI.delete("/book/delete/:isbn" , (req, res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );

    database.books = updatedBookDatabase;

    return res.json({books: database.books});
});

/*
 Route               /book/delete/author
 Description         delete an author from a book 
 Access              Public
 Parameters          isbn, author id
 Method              DELETE
*/

shapeAI.delete("/book/delete/author/:isbn/:authorId" , (req, res) => {
    
    //update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter(
                (author) => author !== parseInt(req.params.authorId)
            );
            book.authors = newAuthorList;
            return;
        }
    });

    // update the author database
    database.authors.forEach((author) => {
        if(author.id === parseInt(req.params.authorId)) {
            const newBooksList = author.books.filter(
                (book) => book !== req.params.isbn
            );

            author.books = newBooksList;
            return;
        }
    });

    return res.json({
        book: database.books,
        author: database.authors,
        message: "author was deleted"
    })
});



shapeAI.listen(3000, () => console.log("Server running!😎"));

/*
 Route               /publication/delete/book
 Description         delete a book from publication
 Access              Public
 Parameters          isbn, publication id
 Method              DELETE
*/

shapeAI.delete("/publication/delete/book/:isbn/:pubId" , (req, res) => {
    //update publication database
    database.publications.forEach((publication) => {
        if(publication.id === parseInt(req.params.pubId)) {
            const newBooksList = publication.books.filter(
                (book) => book !== req.params.isbn
            )

            publication.books = newBooksList;
            return;
        }
    })

    //update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publication = 0; //no publication available
            return;
        }
    })

    return res.json({
        
        message: "book from publication deleted",
        books: database.books,
        publications: database.publications
    })
})






// doubts ----- 

// 1. when to use body and params with req.
// 2. what is tradeoff
// 3. how to know when we r using isbn or ISBN
// 4. how to know when to return directly and when to return empty 
// and why not either of them in all cases
// semicolons- are they a part of syntax like is it a good practice
// 5. in line 318 why did we remove book.ISBN
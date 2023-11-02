let books = [];

function addBook(event) {
  event.preventDefault();

  const inputBookTitle = document.getElementById('inputBookTitle');
  const inputBookAuthor = document.getElementById('inputBookAuthor');
  const inputBookYear = document.getElementById('inputBookYear');
  const inputBookIsComplete = document.getElementById('inputBookIsComplete');
  const newBook = {
    id: +new Date(),
    title: inputBookTitle.value,
    author: inputBookAuthor.value,
    year: inputBookYear.value,
    isComplete: inputBookIsComplete.checked,
  };
  console.log(newBook);

  books.push(newBook);
  alert('Buku berhasil ditambahkan');
  document.dispatchEvent(new Event('bookChange'));
}

function searchBooks(event) {
  event.preventDefault();
  const searchBookTitle = document.getElementById('searchBookTitle');
  const bookTitles = searchBookTitle.value;

  if (bookTitles) {
    renderBooks(
      books.filter(function (book) {
        return book.title.toLowerCase().includes(bookTitles.toLowerCase());
      })
    );
  } else {
    renderBooks(books);
  }
}

function complete(event) {
  const id = Number(event.target.id);
  const bookId = books.findIndex(function (book) {
    return book.id === id;
  });
  if (bookId !== -1) {
    books[bookId] = { ...books[bookId], isComplete: true };
    document.dispatchEvent(new Event('bookChange'));
  }
}

function inComplete(event) {
  const id = Number(event.target.id);
  const bookId = books.findIndex(function (book) {
    return book.id === id;
  });
  if (bookId !== -1) {
    books[bookId] = { ...books[bookId], isComplete: false };
    document.dispatchEvent(new Event('bookChange'));
  }
}

function deleteBook(event) {
  const id = event.target.parentElement.firstChild.id;
  const bookId = books.findIndex(function (book) {
    return book.id == id;
  });

  const Confirm = confirm('Apakah Anda yakin ingin menghapus buku ini?');
  if (bookId !== -1 && Confirm ) {
    books.splice(bookId, 1);
    document.dispatchEvent(new Event('bookChange'));  
    renderBooks(books);
  }
}

function renderBooks(books) {
  const inCompleteBookList = document.getElementById('incompleteBookshelfList');
  const completeBookList = document.getElementById('completeBookshelfList');

  inCompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of books) {
    const newBookElement = document.createElement('article');
    newBookElement.classList.add('book-item');

    const bookTitle = document.createElement('h2');
    bookTitle.innerText = book.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis: ' + book.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun: ' + book.year;

    newBookElement.appendChild(bookTitle);
    newBookElement.appendChild(bookAuthor);
    newBookElement.appendChild(bookYear);

    if (book.isComplete) {
      const container = document.createElement('div');
      container.classList.add('action');

      const inCompleteButton = document.createElement('button');
      inCompleteButton.id = book.id;
      inCompleteButton.innerText = 'Belum Selesai dibaca';
      inCompleteButton.classList.add('green');
      inCompleteButton.addEventListener('click', inComplete);

      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Hapus Buku';
      deleteButton.classList.add('red');
      deleteButton.addEventListener('click', deleteBook);

      container.appendChild(inCompleteButton);
      container.appendChild(deleteButton);
      newBookElement.appendChild(container);
      completeBookList.appendChild(newBookElement);
    } else {
      container = document.createElement('div');
      container.classList.add('action');

      const completeButton = document.createElement('button');
      completeButton.id = book.id;
      completeButton.innerText = 'Selesai dibaca';
      completeButton.classList.add('green');
      completeButton.addEventListener('click', complete);

      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Hapus Buku';
      deleteButton.classList.add('red');
      deleteButton.addEventListener('click', deleteBook);

      container.appendChild(completeButton);
      container.appendChild(deleteButton);
      newBookElement.appendChild(container);
      inCompleteBookList.appendChild(newBookElement);
    }
  }
}

function saveData() {
  localStorage.setItem('books', JSON.stringify(books));
  renderBooks(books);
}

window.addEventListener('load', function () {
  books = JSON.parse(localStorage.getItem('books')) || [];
  renderBooks(books);

  const inputBookForm = document.getElementById('inputBook');
  const searchBook = document.getElementById('searchBook');
  inputBookForm.addEventListener('submit', addBook);
  searchBook.addEventListener('submit', searchBooks);
  document.addEventListener('bookChange', saveData);
});

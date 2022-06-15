const localStorageKey = "HON_DATA"

const title = document.querySelector("#inputBookTitle")
const errorTitle = document.querySelector("#errorTitle")
const sectionTitle = document.querySelector("#sectionTitle")

const author = document.querySelector("#inputBookAuthor")
const errorAuthor = document.querySelector("#errorAuthor")
const sectionAuthor = document.querySelector("#sectionAuthor")

const year = document.querySelector("#inputBookYear")
const errorYear = document.querySelector("#errorYear")
const sectionYear = document.querySelector("#sectionYear")

const read = document.querySelector("#inputBookIsComplete")

const searchValue = document.querySelector("#searchBookTitle")
const btnSubmit = document.querySelector("#bookSubmit")
const btnSearch = document.querySelector("#searchSubmit")

let checkInput = []
let checkTitle = null
let checkAuthor = null
let checkYear = null

window.addEventListener("load", function () {
    if (localStorage.getItem(localStorageKey) !== null) {
        const honData = getData()
        showData(honData)
    }
})

btnSearch.addEventListener("click", function (e) {
    e.preventDefault()
    if (localStorage.getItem(localStorageKey) == null) {
        return alert("Tidak ada data buku")
    } else {
        const getByTitle = getData().filter(a => a.title == searchValue.value.trim());
        if (getByTitle.length == 0) {
            const getByAuthor = getData().filter(a => a.author == searchValue.value.trim());
            if (getByAuthor.length == 0) {
                const getByYear = getData().filter(a => a.year == searchValue.value.trim());
                if (getByYear.length == 0) {
                    alert(`Tidak ditemukan buku dengan kata kunci ${searchValue.value}`)
                } else {
                    showSearchResult(getByYear);
                }
            } else {
                showSearchResult(getByAuthor);
            }
        } else {
            showSearchResult(getByTitle);
        }
    }

    searchValue.value = ''
})

btnSubmit.addEventListener("click", function () {
    if (btnSubmit.value == "") {
        checkInput = []

        title.classList.remove("error")
        author.classList.remove("error")
        year.classList.remove("error")

        errorTitle.classList.add("error-display")
        errorAuthor.classList.add("error-display")
        errorYear.classList.add("error-display")

        if (title.value == "") {
            checkTitle = false
        } else {
            checkTitle = true
        }

        if (author.value == "") {
            checkAuthor = false
        } else {
            checkAuthor = true
        }

        if (year.value == "") {
            checkYear = false
        } else {
            checkYear = true
        }

        checkInput.push(checkTitle, checkAuthor, checkYear)
        let resultCheck = validation(checkInput)

        if (resultCheck.includes(false)) {
            return false
        } else {
            const newHon = {
                id: +new Date(),
                title: title.value.trim(),
                author: author.value.trim(),
                year: year.value,
                isCompleted: read.checked
            }
            insertData(newHon)

            title.value = ''
            author.value = ''
            year.value = ''
            read.checked = false
        }
    } else {
        const honData = getData().filter(a => a.id != btnSubmit.value);
        localStorage.setItem(localStorageKey, JSON.stringify(honData))

        const newHon = {
            id: btnSubmit.value,
            title: title.value.trim(),
            author: author.value.trim(),
            year: year.value,
            isCompleted: read.checked
        }
        insertData(newHon)
        btnSubmit.innerHTML = "Masukkan Buku"
        btnSubmit.value = ''
        title.value = ''
        author.value = ''
        year.value = ''
        read.checked = false
        alert("Buku berhasil diubah")
    }
})

function validation(check) {
    let resultCheck = []

    check.forEach((a, i) => {
        if (a == false) {
            if (i == 0) {
                title.classList.add("error")
                errorTitle.classList.remove("error-display")
                resultCheck.push(false)
            } else if (i == 1) {
                author.classList.add("error")
                errorAuthor.classList.remove("error-display")
                resultCheck.push(false)
            } else {
                year.classList.add("error")
                errorYear.classList.remove("error-display")
                resultCheck.push(false)
            }
        }
    });

    return resultCheck
}

function insertData(hon) {
    let honData = []


    if (localStorage.getItem(localStorageKey) === null) {
        localStorage.setItem(localStorageKey, 0);
    } else {
        honData = JSON.parse(localStorage.getItem(localStorageKey))
    }

    honData.unshift(hon)
    localStorage.setItem(localStorageKey, JSON.stringify(honData))

    showData(getData())
}

function getData() {
    return JSON.parse(localStorage.getItem(localStorageKey)) || []
}

function showData(books = []) {
    const inCompleted = document.querySelector("#incompleteBookshelfList")
    const completed = document.querySelector("#completeBookshelfList")

    inCompleted.innerHTML = ''
    completed.innerHTML = ''

    books.forEach(book => {
        if (book.isCompleted == false) {
            let hon = `
            <article class="book_item card">
                <h3>${book.title}</h3>
                <p>Nama Penulis: ${book.author}</p>
                <p>Tahun Terbit: ${book.year}</p>

                <div class="action">
                    <button class="green" onclick="readHon('${book.id}')">Selesai dibaca</button>
                    <button class="yellow" onclick="editHon('${book.id}')">Ubah Buku</button>
                    <button class="red" onclick="deleteHon('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `

            inCompleted.innerHTML += hon
        } else {
            let hon = `
            <article class="book_item card">
                <h3>${book.title}</h3>
                <p>Nama Penulis: ${book.author}</p>
                <p>TahunTerbit: ${book.year}</p>

                <div class="action">
                    <button class="green" onclick="unreadHon('${book.id}')">Belum selesai di Baca</button>
                    <button class="yellow" onclick="editHon('${book.id}')">Ubah Buku</button>
                    <button class="red" onclick="deleteHon('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `
            completed.innerHTML += hon
        }
    });
}

function showSearchResult(books) {
    const searchResult = document.querySelector("#searchResult")

    searchResult.innerHTML = ''

    books.forEach(book => {
        let hon = `
        <article class="book_item">
            <h3>${book.title}</h3>
            <p>Nama Penulis: ${book.author}</p>
            <p>Tahun Terbit: ${book.year}</p>
            <p>${book.isCompleted ? 'Buku ini sudah dibaca' : 'Buku ini belum dibaca'}</p>
        </article>
        `

        searchResult.innerHTML += hon
    });
}

function readHon(id) {
    let confirmation = confirm("Buku telah selesai dibaca?")

    if (confirmation == true) {
        const bookDataDetail = getData().filter(a => a.id == id);
        const newHon= {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].title,
            author: bookDataDetail[0].author,
            year: bookDataDetail[0].year,
            isCompleted: true
        }

        const bookData = getData().filter(a => a.id != id);
        localStorage.setItem(localStorageKey, JSON.stringify(bookData))

        insertData(newHon)
    } else {
        return 0
    }
}

function unreadHon(id) {
    let confirmation = confirm("Buku belum selesai dibaca?")

    if (confirmation == true) {
        const bookDataDetail = getData().filter(a => a.id == id);
        const newHon = {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].title,
            author: bookDataDetail[0].author,
            year: bookDataDetail[0].year,
            isCompleted: false
        }

        const bookData = getData().filter(a => a.id != id);
        localStorage.setItem(localStorageKey, JSON.stringify(bookData))

        insertData(newHon)
    } else {
        return 0
    }
}

function editHon(id) {
    const honDataDetail = getData().filter(a => a.id == id);
    title.value = honDataDetail[0].title
    author.value = honDataDetail[0].author
    year.value = honDataDetail[0].year
    honDataDetail[0].isCompleted ? read.checked = true : read.checked = false

    btnSubmit.innerHTML = "Ubah Buku"
    btnSubmit.value = honDataDetail[0].id

    let e = document.getElementById("inputSection");
    e.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
        inline: 'start'
    });
}

function deleteHon(id) {
    let confirmation = confirm("Apakah yakin ingin menghapusnya?")

    if (confirmation == true) {
        const honDataDetail = getData().filter(a => a.id == id);
        const honData = getData().filter(a => a.id != id);
        localStorage.setItem(localStorageKey, JSON.stringify(honData))
        showData(getData())
        alert(`Buku ${honDataDetail[0].title} berhasil dihapus`)
    } else {
        return 0
    }
}

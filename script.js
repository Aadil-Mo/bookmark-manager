const mainSection = document.getElementById('main-section');
const formSection = document.getElementById('form-section');
const bookmarkListSection = document.getElementById('bookmark-list-section');

const addBookmarkButton = document.getElementById('add-bookmark-button');
const closeFormButton = document.getElementById('close-form-button');
const addBookmarkFormButton = document.getElementById('add-bookmark-button-form');
const viewCategoryButton = document.getElementById('view-category-button');
const closeListButton = document.getElementById('close-list-button');
const deleteBookmarkButton = document.getElementById('delete-bookmark-button');

const nameInput = document.getElementById('name');
const urlInput = document.getElementById('url');
const categoryDropdown = document.getElementById('category-dropdown');

const categoryName = document.querySelectorAll('.category-name');
const categoryListDiv = document.getElementById('category-list');

let currentlyViewedCategory = '';

function getBookmarks() {
    const data = localStorage.getItem('bookmarks');
    if (!data) return [];

    try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.every(b => b.name && b.url && b.category)) {
            return parsed;
        }
    } catch (e) {
        // ignore JSON parsing errors
    }

    return [];
}

function saveBookmarks(bookmarks) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function displayOrCloseForm() {
    mainSection.classList.toggle('hidden');
    formSection.classList.toggle('hidden');
}

function displayOrHideCategory() {
    mainSection.classList.toggle('hidden');
    bookmarkListSection.classList.toggle('hidden');
}

function renderBookmarks(category) {
    currentlyViewedCategory = category;
    document.querySelector('.category-name').innerText = category;

    const allBookmarks = getBookmarks();
    const filtered = allBookmarks.filter(b => b.category === category);

    categoryListDiv.innerHTML = '';

    if (filtered.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'No Bookmarks Found';
        categoryListDiv.appendChild(p);
        return;
    }

    filtered.forEach(bookmark => {
        const container = document.createElement('div');

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'bookmark-selection';
        radio.id = bookmark.name;
        radio.value = bookmark.name;

        const label = document.createElement('label');
        label.htmlFor = bookmark.name;

        const anchor = document.createElement('a');
        anchor.href = bookmark.url;
        anchor.textContent = bookmark.name;
        anchor.target = '_blank';

        label.appendChild(anchor);
        container.appendChild(radio);
        container.appendChild(label);
        categoryListDiv.appendChild(container);
    });
}

// EVENT LISTENERS

addBookmarkButton.addEventListener('click', () => {
    const selectedCategory = categoryDropdown.value;
    categoryName.forEach(el => el.innerText = selectedCategory);
    displayOrCloseForm();
});

closeFormButton.addEventListener('click', () => {
    displayOrCloseForm();
});

addBookmarkFormButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    const category = categoryDropdown.value;

    if (!name || !url) return;

    const bookmarks = getBookmarks();
    bookmarks.push({ name, url, category });
    saveBookmarks(bookmarks);

    nameInput.value = '';
    urlInput.value = '';
    displayOrCloseForm();
});

viewCategoryButton.addEventListener('click', () => {
    const selectedCategory = categoryDropdown.value;
    categoryName.forEach(el => el.innerText = selectedCategory);
    displayOrHideCategory();
    renderBookmarks(selectedCategory);
});

closeListButton.addEventListener('click', () => {
    bookmarkListSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    categoryListDiv.innerHTML = '';
    currentlyViewedCategory = '';
});

deleteBookmarkButton.addEventListener('click', () => {
    const selectedRadio = categoryListDiv.querySelector('input[type="radio"]:checked');

    if (!selectedRadio || !currentlyViewedCategory) {
        alert("Please select a bookmark to delete.");
        return;
    }

    const nameToDelete = selectedRadio.value;
    let bookmarks = getBookmarks();

    bookmarks = bookmarks.filter(
        b => !(b.name === nameToDelete && b.category === currentlyViewedCategory)
    );

    saveBookmarks(bookmarks);
    renderBookmarks(currentlyViewedCategory);
});

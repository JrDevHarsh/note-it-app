export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.onNoteSelect = onNoteSelect;
        this.root.innerHTML = `
        <header class="header__container">
            <nav class="header__navbar">
                <h1 class="navbar__logo">
                    <a href="#" class="navbar__logo_link">Note-It</a>
                </h1>
                <ul class="navbar__menu">
                    <li class="navbar__menu_item">
                        <a href="#" class="navbar__menu_link">Home</a>
                    </li>
                    <li class="navbar__menu_item">
                        <a href="#" class="navbar__menu_link">Support</a>
                    </li>
                </ul>
            </nav>
        </header>
        <aside class="aside__menu">
            <div class="aside__header">
                <button type="button" class="btn btn__createNote" id="createNote">Add New Note</button>
            </div>
            <div class="aside__notes_content">
                <ul class="notes__list"></ul>
            </div>
            <div class="toggler" id="toggleSidebar">
                <div class="line line-1"></div>
                <div class="line line-2"></div>
                <div class="line line-3"></div>
            </div>
        </aside>
        <section class="write__note_content">
            <div class="container">
                <span>Last Updated: <span class="input__note_updated" id="inputNoteUpdated"></span></span>
                <input type="text" placeholder="Enter Title Here..." class="input__note_title" id="inputNoteTitle" />
                <textarea name="inputNoteBody" class="input__note_body" id="inputNoteBody"
                    placeholder="Enter Text Here..."></textarea>
            </div>
        </section>
        `;

        const toggleBtn = this.root.querySelector('#toggleSidebar');
        const btnAddNote = this.root.querySelector('#createNote');
        const inpTitle = this.root.querySelector('#inputNoteTitle');
        const inpBody = this.root.querySelector('#inputNoteBody');

        toggleBtn.addEventListener('click', () => {
            const aside = this.root.querySelector('aside');
            aside.classList.toggle('shift');
            this.root.querySelector('.write__note_content').classList.toggle('shift');
        })

        btnAddNote.addEventListener('click', () =>  this.onNoteAdd());

        inpBody.addEventListener('blur', () => {
            const updatedTitle = inpTitle.value.trim();
            const updatedBody = inpBody.value.trim();
            this.onNoteEdit(updatedTitle, updatedBody);
        });
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 20;

        return `
            <li class="notes__item" data-note-id="${id}">
                <h3 class="note__title">${title}</h3>
                <p class="note__body">${body.substring(0, MAX_BODY_LENGTH)}${body.length > MAX_BODY_LENGTH ? '...' : ''}</p>
                <p class="note__updated">${updated.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</p>
                <div class="note__tools">
                    <span class="material-icons edit__note">&#xe3c9;</span>
                    <span class="material-icons delete__note">&#xe872;</span>
                </div>
            </li>
        `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector('.notes__list');

        notesListContainer.innerHTML = ``;

        for (const note of notes) {
            const html = this._createListItemHTML(
                note.id,
                note.title,
                note.body,
                new Date(note.updated)
            );
            notesListContainer.insertAdjacentHTML('beforeend', html);
        }

        notesListContainer.querySelectorAll('.notes__item').forEach(noteListItem => {
            noteListItem.querySelector('.edit__note').addEventListener('click', () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });
            noteListItem.querySelector('.delete__note').addEventListener('click', () => {
                this.onNoteDelete(noteListItem.dataset.noteId);
            });
        });
    }

    updateActiveNote(note) {
        this.root.querySelector('#inputNoteTitle').value = note.title;
        this.root.querySelector('#inputNoteBody').value = note.body;
        this.root.querySelector('#inputNoteUpdated').innerText = note.updated;

        this.root.querySelectorAll('.notes__item').forEach(noteListItem => {
            noteListItem.classList.remove('active');
        });
        this.root.querySelector(`.notes__item[data-note-id='${note.id}']`).classList.add('active');
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector('.container').style.visibility = visible ? 'visible' : 'hidden';
    }
}

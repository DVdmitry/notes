'use strict';
(function () {
    let id = 0;
    const noteList = {};

    function Note(id, content, color) {
        this.id = id;
        this.content = content;
        this.color = color;
    }

    const creationBlock = document.getElementById('creation-block');
    const notesMessage = document.getElementById('notes-message');
    const noteColorElement = document.getElementById('color');
    const noteListElement = document.getElementById('note-list');
    const add = document.getElementById('add');
    const edit = document.getElementById('edit');
    const showNoteList = document.getElementById('list');
    const submit = document.getElementById('submit');
    const exit = document.getElementById('exit');
    const noteTextarea = document.getElementById('content');

    add.addEventListener('click', createTextarea);
    edit.addEventListener('click', editNote);
    showNoteList.addEventListener('click', showList);
    submit.addEventListener('click', submitNote);
    exit.addEventListener('click', hideCreationBlock);
    noteTextarea.addEventListener('keyup', textTyping);

    function checkRemoveChildNodes(parent) {
        if (parent.hasChildNodes()) {
            removeChilds(parent)
        }
    }

    function removeChilds(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    function textTyping(e) {
        const {target: {value}} = e;
        if (value && submit.classList.contains('hidden') && !edit.classList.contains('hidden')) {
            return
        }
        if (value && submit.classList.contains('hidden') && edit.classList.contains('hidden')) {
            submit.classList.remove('hidden')
        }
        if (!value && !submit.classList.contains('hidden')) {
            submit.classList.add('hidden')
        }
    }

    function createTextarea() {
        edit.classList.add('hidden');
        submit.classList.add('hidden');
        checkRemoveChildNodes(noteListElement);
        showNoteList.setAttribute('disabled', 'true');
        creationBlock.classList.remove('hidden');
        add.setAttribute('disabled', 'true');
    }

    function hideCreationBlock() {
        creationBlock.classList.add('hidden');
        noteTextarea.value = '';
        showNoteList.removeAttribute('disabled');
        add.removeAttribute('disabled');
    }

    function submitNote(e) {
        const noteId = id += 1;
        noteList[noteId] = new Note(noteId, noteTextarea.value, noteColorElement.value);
        updateView()
    }

    function updateView() {
        hideCreationBlock();
        showNoteList.disable = false;
        updateNotes();
    }

    function updateNotes() {
        const notesQuantity = Object.keys(noteList).length;
        if (notesQuantity) {
            notesMessage.innerText = `You have ${notesQuantity} note(s)`;
            showNoteList.classList.remove('hidden');
        } else {
            notesMessage.innerText = 'You don`t have any notes';
        }
    }

    function showList() {
        const notesArray = Object.values(noteList);
        checkRemoveChildNodes(noteListElement);
        notesArray.forEach((note, i) => {
            const existingNoteContainer = document.createElement('div');

            const existingNote = document.createElement('div');
            existingNote.setAttribute('class', 'note');
            existingNote.setAttribute('data-id', note.id);
            existingNote.setAttribute('title', 'Press to edit');
            existingNote.setAttribute('style', `background-color: ${note.color};`);
        // <p class="note-text">Note# ${note.id}</p>
            existingNote.innerHTML = `<p class="note-text">${note.content}</p>`;

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = 'Delete';
            deleteBtn.setAttribute('data-id', note.id);
            deleteBtn.addEventListener('click', deleteNote);

            existingNoteContainer.appendChild(existingNote);
            existingNoteContainer.appendChild(deleteBtn);
            noteListElement.appendChild(existingNoteContainer);

            existingNote.addEventListener('click', noteDetails);
        });
    }

    function noteDetails(e) {
        const {target, currentTarget} = e;
        const noteId = currentTarget.getAttribute('data-id');
        if (!target.classList.contains('note') && !target.classList.contains('note-text')) {
            return;
        }
        removeChilds(noteListElement);
        createTextarea();
        submit.classList.add('hidden');
        add.setAttribute('disabled', 'true');
        edit.classList.remove('hidden');
        const noteDetails = Object.values(noteList).filter(note => note.id === +noteId)[0];
        noteTextarea.value = noteDetails.content;
        noteTextarea.setAttribute('data-id', noteId)
    }

    function editNote() {
        noteList[noteTextarea.getAttribute('data-id')].content = noteTextarea.value;
        noteList[noteTextarea.getAttribute('data-id')].color = noteColorElement.value;
        updateView();
    }

    function deleteNote(e) {
        delete noteList[e.target.getAttribute('data-id')];
        removeChilds(noteListElement);
        showList();
        updateNotes();
        hideCreationBlock();
        if (!Object.keys(noteList).length) {
            showNoteList.classList.add('hidden');
        }

    }
})();
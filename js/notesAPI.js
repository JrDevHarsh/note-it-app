export default class NotesAPI {
    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem('notesapp-notes') || '[]');
        return notes.sort((a, b) => (new Date(a.updated) > new Date(b.updated)) ? - 1 : 1);
    }
    static saveNote(noteToSave){
        const notes = this.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id);
        
        // Edit/Update
        if(existing){
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toLocaleString();
        }else{
            noteToSave.id = Math.floor(Math.random() * 100000);
            noteToSave.updated = new Date().toLocaleString();
            notes.push(noteToSave);
        }
        localStorage.setItem('notesapp-notes', JSON.stringify(notes));
    }
    static deleteNote(id){
        const notes = this.getAllNotes();
        const updatedNotes = notes.filter(note => note.id != id);
        localStorage.setItem('notesapp-notes', JSON.stringify(updatedNotes));
    }
}

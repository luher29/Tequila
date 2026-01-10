import notes  from "../models/notes";

const notesDAOs = {};

notesDAOs.getAll = async () => {
    const note = await notes.find();
    return note;
};

notesDAOs.getOne = async (numberNote) => {
    return await notes.findOne({ numberNote: numberNote });
};

notesDAOs.insertOne = async (departureProduct) => {
    const newNote = await notes.create(departureProduct);
    return newNote;
};

notesDAOs.updateOne = async (numberNote, departureDate) => {
    const updateNote = await notes.findOneAndUpdate({ numberNote: numberNote }, departureDate);
    return updateNote;
};

notesDAOs.deleteOne = async (numberNote) =>{
    const deleteNote = await notes.findOneAndDelete({numberNote:numberNote});
    return deleteNote;

}

export default notesDAOs
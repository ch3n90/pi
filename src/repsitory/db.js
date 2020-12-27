import Dexie from 'dexie'

const db = new Dexie("pi");
db.version(1).stores({
    access: "&typ3",
});

export {db}
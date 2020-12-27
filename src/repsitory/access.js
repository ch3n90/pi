const {db} = require('./db');

function insert(doc){
    return db.access.put(doc);
}

function remove(typ3){
    return db.access
        .where("typ3")
        .equals(typ3)
        .delete();
}

function updatePropertyByTyp3(access){
    return db.access
        .update(access.typ3,access);
}

function query(typ3){
    return db.access.where('typ3').equals(typ3).first();
}

export {insert as addAccess,query as queryAccess,remove as removeAccess,updatePropertyByTyp3}
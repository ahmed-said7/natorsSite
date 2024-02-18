import mongoose from "mongoose";

mongoose.connect(process.env.db_url!)
    .then( () => {} )
    .catch( (e) => { console.error(e); });
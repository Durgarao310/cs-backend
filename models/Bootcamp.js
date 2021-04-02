const mongoose = require("mongoose");
const slugify = require('slugify');


const BootcampSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [ true, "please add a name"],
        unique: true,
        trim: true, 
        index:true,
        maxlength : [50, 'name can not be more than 5o char']
    },

    slug: String,
    user :{
        type : mongoose.Schema.ObjectId,
        ref: 'User',
        required: true  
    }

});

// Create bootcamp slug from the name
BootcampSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });

module.exports = mongoose.model("Bootcamp", BootcampSchema);
const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true},
  lastname: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: ''},
  phone: { type: String, required: false, default: '' },
  createdIn: {type: Date, default: Date.now }
});

const ContactModel = mongoose.model('Contact', ContactSchema);

class Contact {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async register() {
    this.check();
    if(this.errors.length > 0) return;
    this.contact = await ContactModel.create(this.body);
  }

  check() {
    this.cleanUp();

    if(!this.body.name) {
      this.errors.push('Nome é um campo obrigatório.');
    }
    if(this.body.email && !validator.isEmail(this.body.email)) { 
      this.errors.push('E-mail inválido');
    }
    if(!this.body.email && !this.body.phone) {
      this.errors.push('Pelo menos um contato precisa ser enviado: email ou telefone');
    }  
  }

  cleanUp() {
    for(const key in this.body) {
      if(typeof(this.body[key]) !== 'string') {
        this.body[key] = '';
      }  
    }

    this.body = {
      name: this.body.name,
      lastname: this.body.lastname,
      email: this.body.email,
      phone: this.body.phone,
    };
  }
}

Contact.searchById = async function(id){
  if(typeof id !== 'string') return;
  const user = await ContactModel.findById(id);
  return user;
}

module.exports = Contact;

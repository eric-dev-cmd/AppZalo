const axios = require('axios');
const http = require('../controllers/http');

class ContactService {
     addNew(currentUserId, contactId) {
        return new Promise(async (resolve, reject) => {
            let contactExists = await this.checkExistsContact(currentUserId, contactId);
            if (contactExists) {
                return reject(false);
            } else {
                const newContactItem = {
                    userId: currentUserId,
                    contactId: contactId
                };
            const newContact = await axios.post(http + '/contacts', newContactItem);
               return resolve(newContact);
            }
        })
    }

    remove(currentUserId, contactId) {
        return new Promise(async (resolve, reject) => {
            let findContact = await this.checkExistsContact(currentUserId, contactId);
            let removeContact = await axios.delete(http + '/contacts/' + findContact._id);
            if(removeContact.data == true){
                return resolve(true);
            }else{
                return reject(false);
            }
        })
    }

    async checkExistsContact(userId, contactId) {
       let checkExists = await axios.get(http + '/contacts/search/' + userId + '/' + contactId)
      return checkExists.data.contact;
    }
}

module.exports = new ContactService;

const axios = require('axios');
const http = require('../controllers/http');

class ContactService {
    addNew(currentUserId, contactId) {
        return new Promise(async (resolve, reject) => {
            const findContactByUserId = await this.findContactByUserId(currentUserId);   
            const findContactByContactId = await this.findContactByContactId(contactId); 
            const findContactByUserId1 = await this.findContactByUserId(contactId); 
            const findContactByContactId1 = await this.findContactByContactId(currentUserId);
            /**
             * phia gui yeu cau
             * tim kiem id cua nguoi gui co trong contact neu khac null
             * tim kiem id cua nguoi nhan co trong contact != null(da ton tai) => false
             * 
             * phia nguoc lai
             * 
             * 
             */
            if ((findContactByUserId !== null && findContactByContactId !== null) || (findContactByUserId1 !== null && findContactByContactId1 !== null)) {
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
            const contactByUserId = await this.findContactByUserId(currentUserId);
            const contactByContactId = await this.findContactByContactId(contactId);
            const removeContactByUserId = await axios.delete(http + '/contacts/' + contactByUserId._id);
            const removeContactByContactId = await axios.delete(http + '/contacts/' + contactByContactId._id);
            if(removeContactByUserId.data === null || removeContactByContactId.data === null){
                return  resolve(true);
            }else{
                return  reject(false);
            }
        })
    }

    async findContactByUserId(userId) {
       let findContactByUserId = await axios.get(http + '/contacts/searchUserId/' + userId);
        return findContactByUserId.data.contacts;
    }
    async findContactByContactId(contactId) {
        let findContactByContactId = await axios.get(http + '/contacts/searchContactId/' + contactId)
        return findContactByContactId.data.contacts;
    }
}

module.exports = new ContactService;

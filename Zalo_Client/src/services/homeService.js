const request = require('request')

class homeService {
    getListICE() {
        return new Promise(async (resolve, reject) => {
            let o = {
                format: "urls"
            };

            let bodyString = JSON.stringify(o);
            let options = {
                url: "https://global.xirsys.net/_turn/appChat",
                method: "PUT",
                headers: {
                    "Authorization": "Basic " + Buffer.from("catluynh:32e682c6-4b73-11ec-b945-0242ac130003").toString("base64"),
                    "Content-Type": "application/json",
                    "Content-Length": bodyString.length
                }
            };

            request(options, (error, res, body) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                return resolve(body);
            })

        })
    }
}
module.exports = new homeService();
const axios = require("axios");
const config = require("./config.json");


async function getStatus(){ 
    let result = await axios.post("http://192.168.1.1:8881/rci/", [
        {
            show: {
                sc: {
                    ip: {
                        hotspot: {
                            host: {},
                        },
                    },
                },
            },
        },
    ]);
    // console.log(result.data);
    let mac = config.mac;
    let hosts = result.data[0].show.sc.ip.hotspot.host;
    let hasPolicy = hosts.some((host) => {
        return host.policy === config.policy && host.mac === mac;
    });

    if (hasPolicy) {
        return "on";
    } else {
        return "off";
    }
}

async function setStatus(status) {
    let result = await axios.post("http://192.168.1.1:8881/rci/", [
        {
            ip: {
                hotspot: {
                    host: {
                        mac: config.mac,
                        permit: true,
                        policy: status === "on" ? config.policy : false,
                    },
                },
            },
        },
        {
            system: {
                configuration: {
                    save: {},
                },
            },
        },
    ]);
}

module.exports = {
    getStatus,
    setStatus,
};

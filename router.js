const axios = require("axios");
const fs = require("fs");
const YAML = require("yaml");

const file = fs.readFileSync("./config.yaml", "utf8");
const config = YAML.parse(file);

async function getStatus(){ 
    let result = await axios.post(config.URL, [
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
    let result = await axios.post(config.URL, [
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

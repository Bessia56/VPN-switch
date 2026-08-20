const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const yup = require("yup");
const router = require("./router");
const config = require("./read");
app.use(express.json());


app.use(express.static('front'));

app.get("/api/status", async(req, res) =>{
    let status = await router.getStatus()
    res.send({status});
});

app.post("/api/status", async(req, res) =>{
    const Schema = yup.object({
        status: yup.string().oneOf(['on','off']).required(),
    });

    let data = await Schema.validate(req.body, {
        stripUnknown: true,
    });

    await router.setStatus(data.status)
    res.send();
});


app.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
        console.error("[validation]", req.url, err.message);
        return res.status(400).send({
            name: "Ошибка данных",
            error: err.message,
        });
    }  if (err.isAxiosError) {
        console.error("[ROUTER ERROR]", req.url, err.message);

        return res.status(502).send({
            name: "Ошибка подключения к роутеру",
            error: err.message,
        });
    }

    console.error("[INTERNAL ERROR]", req.url, err);

    return res.status(500).send({
        name: "Внутренняя ошибка сервера",
        error: "Внутренняя ошибка сервера",
    });
});


app.listen(config.serverPort, () => {
    console.log(`Server running on port ${config.serverPort}`);
});
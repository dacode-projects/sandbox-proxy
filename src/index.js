const app = require("./config/app");

const main = async () => {
    try {
        await app.listen(app.get('port'));
        console.log(`server running on http://localhost:${app.get('port')}/`);
    } catch (error) {
        console.error('Error starting the app', error);
    }
}

main();

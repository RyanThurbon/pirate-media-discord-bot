import "@/core/setup";
import { PMClient } from "@/core/structures/PMClient";

const client = new PMClient();

const init = async () => {
    try {
        await client.login();
    } catch (error) {
        await client.abort(error);
    }
};

void init();

import type { PMClient } from "@/core/structures/PMClient";
import { ApplyOptions } from "@sapphire/decorators";
import { Listener } from "@sapphire/framework";
import { Events } from "discord.js";

@ApplyOptions<Listener.Options>({
    event: Events.ClientReady,
    once: true,
})
export class ClientReadyListener extends Listener {
    public override run(client: PMClient) {
        client.logger.info("Client has been initialized");
    }
}

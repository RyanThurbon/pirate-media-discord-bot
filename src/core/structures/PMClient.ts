import { SapphireClient } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { cast } from "@sapphire/utilities";
import { GatewayIntentBits } from "discord.js";

export class PMClient extends SapphireClient {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
            allowedMentions: {
                users: [],
                roles: [],
            },
            defaultCooldown: {
                delay: Time.Second * 10,
                limit: 1,
            },
            enforceNonce: true,
            shards: "auto",
        });
    }

    override login(): Promise<string> {
        return super.login(cast<string>(process.env.BOT_TOKEN_DEV));
    }

    async abort(error: unknown): Promise<never> {
        this.logger.fatal(error);
        await super.destroy();
        process.exit(1);
    }
}

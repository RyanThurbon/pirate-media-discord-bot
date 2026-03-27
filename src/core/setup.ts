import { ApplicationCommandRegistries, RegisterBehavior } from "@sapphire/framework";
import { cast } from "@sapphire/utilities";

ApplicationCommandRegistries.setDefaultGuildIds([cast<string>(process.env.GUILD_ID)]);
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

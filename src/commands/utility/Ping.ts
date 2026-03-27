import { UIMessage } from "@/lib/ui/UIMessage";
import { ApplyOptions, RegisterChatInputCommand } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { MessageFlags } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "ping",
    description: "Perform a health check on the bot",
    preconditions: ["EDefer"],
})
@RegisterChatInputCommand((builder, command) => builder.setName(command.name).setDescription(command.description))
export class PingCommand extends Command {
    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        return await interaction.editReply({
            components: [UIMessage.info(`Current websocket latency is ${interaction.client.ws.ping}ms`)],
            flags: [MessageFlags.IsComponentsV2],
        });
    }
}

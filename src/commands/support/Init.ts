import { ButtonCustomIds, UIColors } from "@/lib/constants";
import { UIContainer } from "@/lib/ui/UIContainer";
import { UIMessage } from "@/lib/ui/UIMessage";
import { ApplyOptions, RegisterChatInputCommand } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { ButtonBuilder, ButtonStyle, channelMention, ChannelType, ContainerBuilder, hyperlink, MessageFlags } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "support_init",
    description: "Initialize the support panel in the specified channel",
    requiredUserPermissions: ["Administrator"],
    preconditions: ["EDefer"],
})
@RegisterChatInputCommand((builder, command) =>
    builder
        .setName(command.name)
        .setDescription(command.description)
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("The channel where the panel will be initialized")
                .addChannelTypes([ChannelType.GuildText])
                .setRequired(true),
        ),
)
export class SupportInitCommand extends Command {
    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel("channel", true, [ChannelType.GuildText]);
        const mention = channelMention(channel.id);

        await channel.send({
            components: [this.panel],
            flags: [MessageFlags.IsComponentsV2],
        });

        return interaction.editReply({
            components: [UIMessage.success(`Support panel has been initialized in ${mention}`)],
            flags: [MessageFlags.IsComponentsV2],
        });
    }

    private get panel(): ContainerBuilder {
        const openTicketButton = new ButtonBuilder()
            .setCustomId(ButtonCustomIds.support.open)
            .setLabel("Open a ticket")
            .setStyle(ButtonStyle.Primary);

        const link = hyperlink("this site", "https://gamestatus.info/search");

        return new UIContainer()
            .title("PirateMedia Support")
            .text(
                `Before submitting any requests involving games, please ensure the game is cracked! You can do so by visiting ${link}. When submitting a ticket, include as much detail as possible and choose the appropriate category to help prevent delays`,
            )
            .separator()
            .actions(openTicketButton)
            .accent(UIColors.Info)
            .build();
    }
}

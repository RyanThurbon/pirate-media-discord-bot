import { ButtonCustomIds } from "@/core/constants";
import { UIContainer } from "@/core/ui/UIContainer";
import { UIContainerBuilder } from "@/core/ui/UIContainerBuilder";
import { ApplyOptions, RegisterChatInputCommand } from "@sapphire/decorators";
import { Subcommand } from "@sapphire/plugin-subcommands";
import {
    ButtonBuilder,
    ButtonStyle,
    channelMention,
    ChannelType,
    Colors,
    ContainerBuilder,
    HeadingLevel,
    hyperlink,
    MessageFlags,
} from "discord.js";
@ApplyOptions<Subcommand.Options>({
    name: "support",
    description: "Support command group",
    requiredUserPermissions: ["Administrator"],
    subcommands: [
        {
            name: "init",
            preconditions: ["EDefer"],
            runIn: [ChannelType.GuildText],
            chatInputRun: "chatInputInit",
        },
    ],
})
@RegisterChatInputCommand((builder, command) =>
    builder
        .setName(command.name)
        .setDescription(command.description)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("init")
                .setDescription("Initialize the support panel in the specified channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel where the panel will be initialized")
                        .setRequired(true),
                ),
        ),
)
export class SupportCommand extends Subcommand {
    public async chatInputInit(interaction: Subcommand.ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel("channel", true, [ChannelType.GuildText]);
        const mention = channelMention(channel.id);

        await channel.send({
            components: [this.supportPanelContainer],
            flags: [MessageFlags.IsComponentsV2],
        });

        return interaction.editReply({
            components: [UIContainer.success(`Support panel has been initialized in ${mention}`)],
            flags: [MessageFlags.IsComponentsV2],
        });
    }

    private get supportPanelContainer(): ContainerBuilder {
        const container = UIContainerBuilder.create();

        const openTicketButton = new ButtonBuilder()
            .setCustomId(ButtonCustomIds.SupportTicketOpen)
            .setLabel("Open a ticket")
            .setStyle(ButtonStyle.Primary);

        const link = hyperlink("this site", "https://gamestatus.info/search");

        return container
            .addAccent(Colors.DarkBlue)
            .addHeading("PirateMedia Support", HeadingLevel.Three)
            .addText(
                `Before submitting any requests involving games, please ensure the game is cracked! You can do so by visiting ${link}. When submitting a ticket, include as much detail as possible and choose the appropriate category to help prevent delays.`,
            )
            .addLargeSeparator()
            .addActionButtons(openTicketButton)
            .build();
    }
}

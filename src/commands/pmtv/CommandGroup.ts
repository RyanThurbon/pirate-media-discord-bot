import { ButtonCustomIds, PMTV_PRICE_MAP, type PMTVPricingPlan } from "@/core/constants";
import { UIContainer } from "@/core/ui/UIContainer";
import { UIContainerBuilder } from "@/core/ui/UIContainerBuilder";
import { ApplyOptions, RegisterChatInputCommand } from "@sapphire/decorators";
import { Subcommand } from "@sapphire/plugin-subcommands";
import {
    bold,
    ButtonBuilder,
    ButtonStyle,
    channelMention,
    ChannelType,
    Colors,
    ContainerBuilder,
    HeadingLevel,
    inlineCode,
    MessageFlags,
} from "discord.js";

@ApplyOptions<Subcommand.Options>({
    name: "pmtv",
    description: "Pmtv command group",
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
                .setDescription("Initialize the pmtv panel in the specified channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel where the panel will be initialized")
                        .setRequired(true),
                ),
        ),
)
export class PMTVCommand extends Subcommand {
    public async chatInputInit(interaction: Subcommand.ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel("channel", true, [ChannelType.GuildText]);
        const mention = channelMention(channel.id);

        await channel.send({
            components: [this.pmtvPanelContainer],
            flags: [MessageFlags.IsComponentsV2],
        });

        return interaction.editReply({
            components: [UIContainer.success(`PMTV panel has been initialized in ${mention}`)],
            flags: [MessageFlags.IsComponentsV2],
        });
    }

    private get pmtvPanelContainer(): ContainerBuilder {
        const trialButton = new ButtonBuilder()
            .setCustomId(ButtonCustomIds.PMTVTicketTrialOpen)
            .setLabel("Start 24h trial")
            .setStyle(ButtonStyle.Primary);

        const purchaseButton = new ButtonBuilder()
            .setCustomId(ButtonCustomIds.PMTVTicketPurchaseOpen)
            .setLabel("Purchase a plan")
            .setStyle(ButtonStyle.Success);

        const container = UIContainerBuilder.create()
            .addAccent(Colors.DarkBlue)
            .addHeading("Premium IPTV, Reliable & Affordable", HeadingLevel.Two)
            .addText(
                "We provide one of the most reliable and competitively priced IPTV services currently available. We offer 24/7 support and a smooth, buffer-free streaming experience!",
            )
            .addLargeSeparator()
            .addSection("Features", [
                `${bold("Extensive channel selection")} - 18,000+ channels`,
                `${bold("High-quality streaming")} - No lag or buffering, HD experience`,
                `${bold("No ads, no waiting")} - Just pure entertainment`,
                `${bold("On-demand content")} - Thousands of movies & series anytime`,
                `${bold("All major sports packages")} - NFL, NBA, UFC, MLB, NHL & more`,
                `${bold("Works on any device")} - Roku, Apple TV, iOS, Smart TVs, PC, etc.`,
            ])
            .addLargeSeparator();

        for (const [title, plans] of Object.entries(this.pmtvPlans)) {
            container.addSection(title, plans.map(inlineCode));
        }

        return container
            .addLargeSeparator()
            .addSection("Payment Options", ["PayPal", "Crypto"])
            .addLargeSeparator()
            .addActionButtons(trialButton, purchaseButton)
            .build();
    }

    private get pmtvPlans(): Record<string, string[]> {
        const result: Record<string, string[]> = {};

        for (const plan of Object.keys(PMTV_PRICE_MAP) as PMTVPricingPlan[]) {
            const connections = PMTV_PRICE_MAP[plan];

            result[plan] = Object.entries(connections).map(([count, price]) => {
                const connectionsCount = Number(count);
                return `${connectionsCount} connections - $${price}`;
            });
        }

        return result;
    }
}

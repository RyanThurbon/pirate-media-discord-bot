import {
    ButtonCustomIds,
    PMTV_DEVICE_CONNECTIONS,
    PMTV_PLAN_DURATIONS,
    PMTV_PRICE_MAP,
    UIColors,
    type PMTVPricingPlan,
} from "@/lib/constants";
import { UIContainer } from "@/lib/ui/UIContainer";
import { UIMessage } from "@/lib/ui/UIMessage";
import { ApplyOptions, RegisterChatInputCommand } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { cast } from "@sapphire/utilities";
import {
    bold,
    ButtonBuilder,
    ButtonStyle,
    channelMention,
    ChannelType,
    ContainerBuilder,
    inlineCode,
    MessageFlags,
} from "discord.js";

@ApplyOptions<Command.Options>({
    name: "pmtv_init",
    description: "Initialize the pmtv panel in the specified channel",
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
export class PMTVInitCommand extends Command {
    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel("channel", true, [ChannelType.GuildText]);
        const mention = channelMention(channel.id);

        await channel.send({
            components: [this.panel],
            flags: [MessageFlags.IsComponentsV2],
        });

        return interaction.editReply({
            components: [UIMessage.success(`PMTV panel has been initialized in ${mention}`)],
            flags: [MessageFlags.IsComponentsV2],
        });
    }

    private get panel(): ContainerBuilder {
        const trialButton = new ButtonBuilder()
            .setCustomId(ButtonCustomIds.pmtv.trial.open)
            .setLabel("Start 24h trial")
            .setStyle(ButtonStyle.Primary);

        const purchaseButton = new ButtonBuilder()
            .setCustomId(ButtonCustomIds.pmtv.purchase.open)
            .setLabel("Purchase a plan")
            .setStyle(ButtonStyle.Success);

        const panel = new UIContainer()
            .title("Premium IPTV, Reliable & Affordable")
            .text(
                "We provide one of the most reliable and competitively priced IPTV services currently available. We offer 24/7 support and a smooth, buffer-free streaming experience!",
            )
            .separator()
            .sectionList("Features", [
                `${bold("Extensive channel selection")} - 18,000+ channels`,
                `${bold("High-quality streaming")} - No lag or buffering, HD experience`,
                `${bold("No ads, no waiting")} - Just pure entertainment`,
                `${bold("On-demand content")} - Thousands of movies & series anytime`,
                `${bold("All major sports packages")} - NFL, NBA, UFC, MLB, NHL & more`,
                `${bold("Works on any device")} - Roku, Apple TV, iOS, Smart TVs, PC, etc.`,
            ])
            .separator();

        for (const [plan, prices] of Object.entries(this.plans) as [PMTVPricingPlan, string[]][]) {
            panel.sectionList(plan, prices.map(inlineCode));
        }

        return panel
            .separator()
            .sectionList("Payment Methods", ["PayPal", "Crypto"])
            .separator()
            .actions(trialButton, purchaseButton)
            .accent(UIColors.Info)
            .build();
    }

    private get plans(): Record<PMTVPricingPlan, string[]> {
        const result = cast<Record<PMTVPricingPlan, string[]>>({});

        for (const plan of PMTV_PLAN_DURATIONS) {
            const connections = PMTV_PRICE_MAP[plan];
            result[plan] = PMTV_DEVICE_CONNECTIONS.map((count) => `${count} connections - $${connections[count]}`);
        }

        return result;
    }
}

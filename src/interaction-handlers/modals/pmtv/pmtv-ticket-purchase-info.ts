import {
    ButtonCustomIds,
    ChannelParentIds,
    ModalCustomIds,
    ModalInputCustomIds,
    PMTV_PRICE_MAP,
    type PMTVConnectionCount,
    type PMTVPaymentMethod,
    type PMTVPricingPlan,
} from "@/lib/constants";
import { UIMessage } from "@/lib/ui/UIMessage";
import { createTicketChannel } from "@/lib/utils/tickets";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { cast } from "@sapphire/utilities";
import type { ModalSubmitInteraction } from "discord.js";
import { hyperlink, MessageFlags } from "discord.js";
import { isNullOrUndefined } from "node_modules/@sapphire/utilities/dist/cjs/index.cjs";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
})
export class PMTVTicketPurchaseInfoModalSubmitHandler extends InteractionHandler {
    public override parse(interaction: ModalSubmitInteraction) {
        if (interaction.customId !== ModalCustomIds.pmtv.purchase.info) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ModalSubmitInteraction<"cached">) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const fields = interaction.fields;

        const ids = {
            username: ModalInputCustomIds.pmtv.purchase.username,
            rawPassword: ModalInputCustomIds.pmtv.purchase.password,
            plan: ModalInputCustomIds.pmtv.purchase.plan,
            connections: ModalInputCustomIds.pmtv.purchase.connections,
            paymentMethod: ModalInputCustomIds.pmtv.purchase.method,
            closeTicket: ButtonCustomIds.pmtv.close,
        };

        const username = fields.getTextInputValue(ids.username);
        const rawPassword = fields.getTextInputValue(ids.rawPassword);
        const plan = cast<PMTVPricingPlan>(fields.getStringSelectValues(ids.plan)[0]);
        const connections = cast<PMTVConnectionCount>(fields.getStringSelectValues(ids.connections)[0]);
        const paymentMethod = cast<PMTVPaymentMethod>(fields.getStringSelectValues(ids.paymentMethod)[0]);

        const password = rawPassword || "Randomly generated";
        const totalCost = PMTV_PRICE_MAP[plan][connections];

        const ticketChannel = await createTicketChannel(interaction, {
            title: "PMTV Purchase Ticket",
            category: "Purchase",
            parentId: ChannelParentIds.PMTVTickets,
            fields: {
                "Preferred username": username,
                "Preferred password": password,
                "Plan duration": plan,
                "Device connections": cast<string>(connections),
                "Payment method": paymentMethod,
                "Total cost": `$${totalCost}`,
            },
            closeTicketBtnId: ids.closeTicket,
        });

        //handled by createTicketChannel()
        if (isNullOrUndefined(ticketChannel)) {
            return;
        }

        const here = hyperlink("here", ticketChannel.url);

        return interaction.editReply({
            components: [UIMessage.success(`Your ticket has been created. You can access it ${here}`)],
            flags: [MessageFlags.IsComponentsV2],
        });
    }
}

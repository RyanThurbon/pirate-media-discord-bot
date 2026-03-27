import { ButtonCustomIds, ChannelParentIds, ModalCustomIds, ModalInputCustomIds } from "@/lib/constants";
import { UIMessage } from "@/lib/ui/UIMessage";
import { createTicketChannel } from "@/lib/utils/tickets";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { isNullOrUndefined } from "@sapphire/utilities";
import type { ModalSubmitInteraction } from "discord.js";
import { hyperlink, MessageFlags } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
})
export class PMTVTicketTrialInfoModalSubmitHandler extends InteractionHandler {
    public override parse(interaction: ModalSubmitInteraction) {
        if (interaction.customId !== ModalCustomIds.pmtv.trial.info) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ModalSubmitInteraction<"cached">) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const fields = interaction.fields;

        const ids = {
            username: ModalInputCustomIds.pmtv.trial.username,
            rawPassword: ModalInputCustomIds.pmtv.trial.password,
            closeTicket: ButtonCustomIds.pmtv.close,
        };

        const username = fields.getTextInputValue(ids.username);
        const rawPassword = fields.getTextInputValue(ids.rawPassword);

        const password = rawPassword || "Randomly generated";

        const ticketChannel = await createTicketChannel(interaction, {
            title: "PMTV Trial Ticket",
            category: "Trial",
            parentId: ChannelParentIds.PMTVTickets,
            fields: {
                "Preferred username": username,
                "Preferred password": password,
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

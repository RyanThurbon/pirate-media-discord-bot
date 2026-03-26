import { ApplyOptions } from "@sapphire/decorators";
import type { InteractionHandlerError } from "@sapphire/framework";
import { Events, Listener } from "@sapphire/framework";
import { handleInteractionHandlerError } from "./_shared";

@ApplyOptions<Listener.Options>({
    event: Events.InteractionHandlerError,
})
export class InteractionHandlerErrorListener extends Listener<typeof Events.InteractionHandlerError> {
    public async run(error: unknown, payload: InteractionHandlerError) {
        return handleInteractionHandlerError(error, payload);
    }
}

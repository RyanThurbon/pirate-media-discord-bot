import { ApplyOptions } from "@sapphire/decorators";
import type { InteractionHandlerParseError } from "@sapphire/framework";
import { Events, Listener } from "@sapphire/framework";
import { handleInteractionHandlerError } from "./_shared";

@ApplyOptions<Listener.Options>({
    event: Events.InteractionHandlerParseError,
})
export class InteractionHandlerParseErrorListener extends Listener<typeof Events.InteractionHandlerParseError> {
    public async run(error: unknown, payload: InteractionHandlerParseError) {
        return handleInteractionHandlerError(error, payload);
    }
}

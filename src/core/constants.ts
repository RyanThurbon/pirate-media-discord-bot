export const enum ChannelParentIds {
    SupportTickets = "1468872910759395411",
    PMTVTickets = "1468872870481498165",
}

export const enum ButtonCustomIds {
    SupportTicketOpen = "support.ticket.button_open",
    SupportTicketClose = "support.ticket.button_close",
    PMTVTicketTrialOpen = "pmtv.ticket.trial.button_open",
    PMTVTicketPurchaseOpen = "pmtv.ticket.purchase.button_open",
    PMTVTicketClose = "pmtv.ticket.button_close",
}

export const enum ModalCustomIds {
    SupportTicketInfo = "support.ticket.modal_info",
    SupportTicketConfirmClose = "support.ticket.modal_confirm_close",
    PMTVTicketTrialInfo = "pmtv.ticket.trial.modal_info",
    PMTVTicketPurchaseInfo = "pmtv.ticket.purchase.modal_info",
    PMTVTicketConfirmClose = "pmtv.ticket.modal_confirm_close",
}

export const enum ModalInputCustomIds {
    SupportTicketInfoIssue = "support.ticket.modal_info.issue",
    SupportTicketInfoCategory = "support.ticket.modal_info.category",
    SupportTicketConfirmCloseConfirmation = "support.ticket.modal_confirm_close.confirmation",
    PMTVTicketTrialInfoUsername = "pmtv.ticket.trial.modal_info.username",
    PMTVTicketTrialInfoPassword = "pmtv.ticket.trial.modal_info.password",
    PMTVTicketPurchaseInfoUsername = "pmtv.ticket.purchase.modal_info.username",
    PMTVTicketPurchaseInfoPassword = "pmtv.ticket.purchase.modal_info.password",
    PMTVTicketPurchaseInfoDuration = "pmtv.ticket.purchase.modal_info.duration",
    PMTVTicketPurchaseInfoConnections = "pmtv.ticket.purchase.modal_info.connections",
    PMTVTicketPurchaseInfoMethod = "pmtv.ticket.purchase.modal_info.method",
    PMTVTicketConfirmCloseConfirmation = "pmtv.ticket.modal_confirm_close.confirmation",
}

export const SUPPORT_TICKET_CATEGORIES = ["Games", "Software", "PMTV", "Movies", "Sports", "Other"] as const;

export const PMTV_PLAN_DURATIONS = ["1 Month", "3 Months", "6 Months", "1 Year", "Lifetime"] as const;
export const PMTV_DEVICE_CONNECTIONS = [1, 2, 3, 4, 5] as const;
export const PMTV_PAYMENT_METHODS = ["PayPal", "Crypto"] as const;

export type PMTVPricingPlan = (typeof PMTV_PLAN_DURATIONS)[number];
export type PMTVConnectionCount = (typeof PMTV_DEVICE_CONNECTIONS)[number];
export type PMTVPaymentMethod = (typeof PMTV_PAYMENT_METHODS)[number];

export const PMTV_PRICE_MAP: Record<PMTVPricingPlan, Record<PMTVConnectionCount, number>> = {
    "1 Month": {
        1: 15,
        2: 25,
        3: 35,
        4: 45,
        5: 55,
    },
    "3 Months": {
        1: 35,
        2: 45,
        3: 60,
        4: 75,
        5: 90,
    },
    "6 Months": {
        1: 55,
        2: 70,
        3: 85,
        4: 95,
        5: 110,
    },
    "1 Year": {
        1: 90,
        2: 105,
        3: 120,
        4: 135,
        5: 150,
    },
    Lifetime: {
        1: 250,
        2: 320,
        3: 400,
        4: 480,
        5: 400,
    },
};

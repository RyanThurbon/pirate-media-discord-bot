export const enum UIColors {
    Info = 0x206694,
    Warning = 0xfee75c,
    Success = 0x57f287,
    Error = 0xed4245,
}

export const enum ChannelParentIds {
    SupportTickets = "1272506359358951579",
    PMTVTickets = "1440216852176568340",
}

export const ButtonCustomIds = {
    support: {
        open: "support.ticket.button_open",
        close: "support.ticket.button_close",
    },
    pmtv: {
        trial: {
            open: "pmtv.ticket.trial.button_open",
        },
        purchase: {
            open: "pmtv.ticket.purchase.button_open",
        },
        close: "pmtv.ticket.button_close",
    },
} as const;

export const ModalCustomIds = {
    support: {
        info: "support.ticket.modal_info",
        confirmClose: "support.ticket.modal_confirm_close",
    },
    pmtv: {
        trial: {
            info: "pmtv.ticket.trial.modal_info",
        },
        purchase: {
            info: "pmtv.ticket.purchase.modal_info",
        },
        confirmClose: "pmtv.ticket.modal_confirm_close",
    },
} as const;

export const ModalInputCustomIds = {
    support: {
        issue: "support.ticket.modal_info.issue",
        category: "support.ticket.modal_info.category",
        confirmCloseConfirmation: "support.ticket.modal_confirm_close.confirmation",
    },
    pmtv: {
        trial: {
            username: "pmtv.ticket.trial.modal_info.username",
            password: "pmtv.ticket.trial.modal_info.password",
        },
        purchase: {
            username: "pmtv.ticket.purchase.modal_info.username",
            password: "pmtv.ticket.purchase.modal_info.password",
            plan: "pmtv.ticket.purchase.modal_info.plan",
            connections: "pmtv.ticket.purchase.modal_info.connections",
            method: "pmtv.ticket.purchase.modal_info.method",
        },
        confirmCloseConfirmation: "pmtv.ticket.modal_confirm_close.confirmation",
    },
} as const;

export const SUPPORT_TICKET_CATEGORIES = ["Games", "Software", "PMTV", "Movies", "Sports", "Other"] as const;
export const PMTV_TICKET_CATEGORIES = ["Trial", "Purchase"] as const;

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

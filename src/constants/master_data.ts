export const STATUS_LIST = {
    0: {
        id: 0,
        name: 'inactive'
    },
    1: {
        id: 1,
        name: 'active',
    },
    2: {
        id: 2,
        name: 'submitted',
    },
    3: {
        id: 3,
        name: 'assigned'
    },
    4: {
        id: 4,
        name: 'pending'
    },
    5: {
        id: 5,
        name: 'inProgress'
    },
    6: {
        id: 6,
        name: 'completed',
    },
    7: {
        id: 7,
        name: 'block'
    },
    8: {
        id: 8,
        name: 'success'
    },
    9: {
        id: 9,
        name: 'failed'
    },
    10: {
        id: 10,
        name: 'sent'
    },
    11: {
        id: 11,
        name: 'resend'
    },
    12: {
        id: 12,
        name: 'accept'
    },
    13: {
        id: 13,
        name: 'decline'
    },
    14: {
        id: 14,
        name: 'cancelled'
    },
    15: {
        id: 15,
        name: 'approved'
    },
    16: {
        id: 16,
        name: 'deleted'
    },
    17: {
        id: 17,
        name: 'drafted'
    }
};

export const ROLE_LIST = {
    SUPER_ADMIN: {
        name: 'super admin',
        id: 1,
    },
    CIVIL_ENGINEER: {
        name: 'civil engineer',
        id: 2
    },
    USER: {
        name: 'user',
        id: 3
    }
};

export const USER_DOC_TYPES = {
    EDUCATION_CERTIFICATE: {
        name: 'education certificate',
    },
    GOVT_ID_FRONT: {
        name: 'Govt id front',
    },
    GOVT_ID_BACK: {
        name: 'Govt Id back',
    }
};

export const PAYMENT_AMOUNT: number = +(process.env.PAYMENT_AMOUNT ?? 2000);

export const SEQUENCE_TYPES = {
    PROPERTY_REQUEST: {
        name: 'property_request',
        default_series: 'DCA'
    }
};

export const REGION_TYPES = {
    MRO: {
        name: 'MRO',
    },
    SRO: {
        name: 'SRO',
    }
};

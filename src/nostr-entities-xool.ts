export const defNoStrRoles = [
    {
        id: "org.nostr.entities.roles.actor",
        flags: {
            creator: true
        },
        permissions: {
            observe: true,
            create: true,
            update: true,
            promote: true,
            demote: true,
        }
    },
    {
        id: "org.nostr.entities.roles.observer",
        permissions: {
            observe: true,
        }
    }
]

export const defNoStrModels = [
    {
        id: "org.nostr.entities.entity",
        abilities: {
            abstract: true
        },
        template: {
            name: {
                type: 'String', required: true
            },
            description: {
                type: 'String', required:
                    false
            },
        },
    },
    {
        id: "org.nostr.entities.organization",
        inherits:
            ["org.nostr.entities.entity"],
        abilities: {
            abstract: false,
            root: true,
        },
        roles: {
            "org.nostr.entities.roles.actor": true, "org.nostr.entities.roles.observer": true
        },
        subtypes: [
            "org.nostr.entities.organization",
            "org.nostr.entities.project",
            "org.nostr.entities.task",
        ]
    },
    {
        id: "org.nostr.entities.project",
        inherits:
            ["org.nostr.entities.entity"],
        abilities: {
            abstract: false,
        },
        subtypes: [
            "org.nostr.entities.project",
            "org.nostr.entities.task",
        ]
    },
    {
        id: "org.nostr.entities.task",
        inherits:
            ["org.nostr.entities.entity"],
        abilities: {
            abstract: false,
        },
        template: {
            time_spent: {
                type: 'String', required: false
            },
            time_remaining: {
                type: 'String', required: false
            },
            delivery_date: {
                type: 'Date', required: false
            },
            due_date: {
                type: 'Date', required: false
            },
            state: {
                type: 'State',
                required: true,
                state_map: {
                    open: {
                        initial: true,
                        transitions: {
                            done: {},
                        },
                    },
                    done: {
                        final: true,
                        transitions: {
                            open: {},
                        },
                    },
                },
            },
        },
        subtypes: [
            "org.nostr.entities.task",
        ]
    }
]

export const billoxi = {
    'com.biloxi': {
        inherits: ['org.nostr.entities.organization'],
        abilities: {singleton: true},
        subtypes: ['com.biloxi.project.project', 'com.biloxi.project.task']
    },
    'com.biloxi.project': {
        inherits: ['org.nostr.entities.project'],
        subtypes: ['com.biloxi.project.project', 'com.biloxi.project.task']
    },
    'com.biloxi.project.task': {
        inherits: ['org.nostr.entities.task'],
        subtypes: ['com.biloxi.project.task']
    },
    'com.biloxi.project.code-task': {
        inherits: ['com.biloxi.project.task'],
        subtypes: ['com.biloxi.project.code-task'],
        template: {
            vcs_commit: {
                type: 'String',
                required: true,
                // The hex string of the commit
                regex: '/^[a-f0-9]{40}$/i'
            },
        },
    },
    // Customer Trouble Report
    // Here we have a team that has configured their own process, where a special role, reporter is the only one that
    // Can close tasks
    'com.biloxi.cta': {
        inherits: ['org.nostr.entities.task'],
        roles: {
            'com.biloxi.roles.reporter': {
                inherits: ['org.nostr.entities.roles.actor'],
            },
        },
        template: {
            state: {
                state_map: {
                    // Remove the open state
                    open: null,
                    reported: {
                        initial: true,
                        transitions: {
                            ongoing: {},
                        },
                    },
                    ongoing: {
                        initial: false,
                        transitions: {
                            done: {roles: {'com.biloxi.roles.reporter': {}}},
                        },
                    },
                    done: {
                        final: true,
                        transitions: {
                            open: null,
                            ongoing: {},
                        },
                    },
                },
            },
        },
    },
}

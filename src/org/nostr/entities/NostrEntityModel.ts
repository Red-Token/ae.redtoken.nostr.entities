import {AbstractNostrEntity, cleanDeepMergeVariable, getFirstVariable} from "./AbstractNostrEntity";
import {NostrEntityRole} from "./NostrEntityRole";

export class NostrEntityModel extends AbstractNostrEntity<NostrEntityModel> {
    static models = new Map<string, NostrEntityModel>();

    static {
        const defEntityModels = {
            'org.nostr.entities.entity': {
                abilities: {
                    abstract: true,
                },
                roles: {
                    'org.nostr.entities.roles.actor': {
                        flags: {creator: true,},
                        permissions: {read: true, write: true, promote: true},
                    },
                    'org.nostr.entities.roles.observer': {
                        permissions: {read: true}
                    },
                },
                template: {
                    model: {type: 'String', required: true, writeOnce: true,},
                    name: {type: 'String', required: true},
                    description: {type: 'String', required: false},
                },
            },
            'org.nostr.entities.organization': {
                inherits: ['org.nostr.entities.entity'],
                abilities: {
                    abstract: false,
                    root: true,
                },
                subtypes: ['org.nostr.entities.organization', 'org.nostr.entities.project'],
            },
            'org.nostr.entities.project': {
                inherits: ['org.nostr.entities.entity'],
                abilities: {
                    abstract: false,
                },
                subtypes: ['org.nostr.entities.project', 'org.nostr.entities.task']
            },
            'org.nostr.entities.task': {
                inherits: ['org.nostr.entities.entity'],
                abilities: {
                    abstract: false,
                },
                template: {
                    time_spent: {type: 'String', required: false},
                    time_remaining: {type: 'String', required: false},
                    delivery_date: {type: 'Date', required: false},
                    due_date: {type: 'Date', required: false},
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
                subtypes: ['org.nostr.entities.task']
            },
        }

        Object.entries(defEntityModels).forEach(([id, data]) => {
            new NostrEntityModel(id, data)
            console.log(id)
        })
    }

    readonly roles: any
    readonly abilities: any
    readonly subtypes: any
    readonly template: any
    readonly roleMap: Map<string, NostrEntityRole>

    constructor(id: string, data: any) {
        super(id, data.inherits, NostrEntityModel.models)
        this.realm.set(this.id, this)

        this.roles = data.roles === undefined ? {} : data.roles
        this.roleMap = new Map<string, NostrEntityRole>();

        this.template = data.template === undefined ? {} : data.template
        this.abilities = data.abilities === undefined ? {} : data.abilities
        this.subtypes = data.subtypes

        Object.entries(this.getRoles()).forEach(([id, data]) => {
            new NostrEntityRole(id, data, this.roleMap)
        })
    }

    getRoles() {
        return cleanDeepMergeVariable<NostrEntityModel>("roles", this)
    }

    getTemplate() {
        return cleanDeepMergeVariable<NostrEntityModel>("template", this)
    }

    getSubtypes() {
        return getFirstVariable<NostrEntityModel>('subtypes', this)
    }

    getAbilities() {
        return cleanDeepMergeVariable<NostrEntityModel>("abilities", this)
    }


}

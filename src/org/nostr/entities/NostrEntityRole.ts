import {AbstractNostrEntity, cleanDeepMergeVariable} from "./AbstractNostrEntity";

export class NostrEntityRole extends AbstractNostrEntity<NostrEntityRole> {

    // static roles = new Map<string, NostrEntityRole>();

    // static {
    //     const defNoStrRoles = [
    //         {
    //             id: "org.nostr.entities.roles.actor",
    //             flags: {
    //                 creator: true
    //             },
    //             permissions: {
    //                 observe: true,
    //                 create: true,
    //                 update: true,
    //                 promote: true,
    //                 demote: true,
    //             }
    //         },
    //         {
    //             id: "org.nostr.entities.roles.observer",
    //             permissions: {
    //                 observe: true,
    //             }
    //         }
    //     ]
    //
    //     for (const role of defNoStrRoles) {
    //         new NostrEntityRole(role)
    //     }
    // }

    flags: any;
    permissions: any

    constructor(id: string, data: any, map: Map<string, NostrEntityRole> ) {
        super(id, data.inherits, map);
        this.realm.set(this.id, this)

        this.permissions = data.permissions !== undefined ? data.permissions : {};
        this.flags = data.flags !== undefined ? data.flags : {};
    }

    getFlags() {
        return cleanDeepMergeVariable<NostrEntityRole>("flags", this);
    }

    getPermissions() {
        return cleanDeepMergeVariable<NostrEntityRole>("permissions", this);
    }
}

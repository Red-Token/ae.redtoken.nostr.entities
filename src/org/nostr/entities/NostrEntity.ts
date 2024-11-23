import {AbstractNostrEntity} from "./AbstractNostrEntity";

class NostrEntity extends AbstractNostrEntity<NostrEntity> {
    static entities = new Map<string, NostrEntity>();

    events: any
    children:Set<NostrEntity> = new Set();

    constructor(event: any) {
        super(event.id, [], NostrEntity.entities)
        this.realm.set(this.id, this)
        this.events = [event]

        //Process the tags and update the relatives

        //Process the tags and update the children
    }

    update(event: any) {
        this.events.unshift(event)
    }

    bindChild(entity: NostrEntity) {
        this.children.add(entity)
        entity.inherits.push(this.id)
    }
}

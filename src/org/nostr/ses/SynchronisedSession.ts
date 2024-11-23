/**
 * A SynchronisedSession uses one identity and a set of Subscriptions to create a SynchronisedEventStream. It also
 * Allows the user to create a set of Publishers that can be used to publish events into the EventStream.
 */
class SynchronisedSession {
    private eventStream: SynchronisedEventStream;

    constructor(private session: any) {
        this.eventStream = new SynchronisedEventStream()
    }

    createPublisher() {
        return new Publisher(this)
    }
}

import {expect} from 'chai';
import {describe, it} from 'node:test';
import {greet} from "../src";

import {billoxi} from "./billoxi";
// import {NostrEntityRole} from "../src/org/nostr/entities/NostrEntityRole";
import {NostrEntityModel} from "../src/org/nostr/entities/NostrEntityModel";
import {ISigner, Nip01Signer} from "@welshman/signer";
import {
    addSession,
    getDefaultAppContext,
    getDefaultNetContext,
    PartialSubscribeRequest, publishThunk, session,
    subscribe
} from "@welshman/app";
import {nip19} from "nostr-tools";
import {bytesToHex} from "@noble/hashes/utils";
import {createEvent, DELETE, normalizeRelayUrl, REACTION, TrustedEvent} from "@welshman/util";
import {NodeSSH} from "node-ssh";
import {ctx, now, setContext} from "@welshman/lib";

class MockLocalStorage {
    private store: Record<string, string> = {};

    setItem(key: string, value: string): void {
        this.store[key] = value;
    }

    getItem(key: string): string | null {
        return this.store[key] || null;
    }

    removeItem(key: string): void {
        delete this.store[key];
    }

    clear(): void {
        this.store = {};
    }
}

const localStorage = new MockLocalStorage();

const TEST_EVENT = 10666

describe('Math functions', () => {

    before(async () => {
        const ssh = new NodeSSH()

        await ssh.connect({host: 'relay.lxc', username: 'ubuntu', password: 'Qwerty'})

        const result = await ssh.execCommand("cd git/strfry;./strfry delete --filter='{\"kinds\":[0,1,10666]}'")

        console.log(result)

    })


    it('should correctly add two numbers', async () => {
        const z = greet("julius")
        const x = 5
        expect(x).to.equal(5);

        Object.entries(billoxi).forEach(([id, data]) => {
            new NostrEntityModel(id, data)
            // console.log(id, data)
        })

        // expect(NostrEntityRole.roles.size).to.equal(2);
        // const xx = NostrEntityRole.roles.get("org.nostr.entities.roles.actor")
        // const yy = xx?.getPermissions()
        // console.log(yy)

        NostrEntityModel.models.forEach((model) => {
            console.log(model.id)
            model.roleMap.forEach((value, key) => {
                console.log(key)
                console.log(value.getFlags())
                console.log(value.getPermissions())
            })

            console.log(model.getRoles())
            console.log(model.getTemplate())
            console.log(model.getSubtypes())
            console.log(model.getAbilities())
        })

        // Alice creates a new organisation

        // Welshman uses a default context to load different kind of variables we have to create it first
        setContext({
            net: getDefaultNetContext({
                // The default NetContext has a eventHandler for handling incoming events that we can override
                onEvent: (url: string, event: TrustedEvent) => {
                    console.log(url)
                    console.log(event)
                }
            }),
            app: getDefaultAppContext()
        })

        // This is a bit weird way of doing it, welshman has something that is called a session, that in turn has a signer
        // Now a signer can be of different types, NIP01 Signer is a regular signer based on a NSEC, while an NIP07 uses
        // Nos2x type signer (in browser) and NIP44 uses a remote signer.
        // The a bit strange thing is that the signer (if sent in) does provide and interface to getting the public key
        // But this is on a promise, so to get around it pubkey is also sent in as a parameter in hex
        // Should we make a SessionBuilder here?

        const aliceNSec = 'nsec18c4t7czha7g7p9cm05ve4gqx9cmp9w2x6c06y6l4m52jrry9xp7sl2su9x'
        const secKey = nip19.decode(aliceNSec).data
        const secHex = bytesToHex(secKey)
        // const pubkey = getPubkey(secHex)
        const signer: Nip01Signer = Nip01Signer.fromSecret(secHex)

        // TODO: pubkey needs to be set?
        function createSession(signer: ISigner) {
            return new Promise<any>((resolve, reject) => {
                signer.getPubkey().then((pubkey: string) => {
                    // This a bit of a strange interface?
                    // resolve({method: "nip01", secret: secHex,  pubkey, signer});
                    // This work too
                    resolve({method: "nip01", secret: secHex, pubkey});
                }).catch(reject)
            })
        }

        // Here we create a session

        // we define memberships as 10209

        await createSession(signer).then(session => addSession(session))
        const url = 'wss://relay.lxc'
        const nurl = normalizeRelayUrl(url)


        const psr: PartialSubscribeRequest = {
            relays: [nurl],
            // The filters are the kind of event we want to subscribe to
            filters: [
                // Here we subscribe to the membership kind
                {kinds: [TEST_EVENT]},
                // Here we subscribe to the DELETE and REACTION kind that is generated from now
                {kinds: [DELETE, REACTION], since: now()}
            ],
            // Here we pass in the event handler
            onEvent: (event: Event) => {
                console.log(event)
            }
        }

        subscribe(psr)

        const event = createEvent(TEST_EVENT, {content: JSON.stringify('Hello World'), tags: [['z', 'Iamatag']]})

        // Sent the message
        const px = publishThunk({
            event,
            relays: [nurl],
        })

        const res = await px.result

        console.log("The end!")
    });
});

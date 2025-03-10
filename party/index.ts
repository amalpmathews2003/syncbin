import { pack } from 'msgpackr';
import type * as Party from 'partykit/server';

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  readMessages() {
    return this.room.storage.get('messages');
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`,
    );

    // let's send a message to the connection
    // conn.send('hello from server');
    const messages = await this.readMessages();
    if (messages) {
      conn.send(pack(messages));
    } else {
      conn.send('hello');
    }
  }

  onMessage(message: string | ArrayBuffer, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(
      message,
      // ...except for the connection it came from
      [sender.id],
    );
    this.room.storage.put('messages', message);
  }
}

Server satisfies Party.Worker;

import { Injectable } from "@nestjs/common";
import { MyLogger } from "src/logger/my-logger.service";
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { Post } from "./post.entity";

@Injectable()
@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {

  constructor(
    private connection: Connection,
    private logger: MyLogger
    ) {
    connection.subscribers.push(this);
  }
  
  listenTo() {
    return Post;
  }

  beforeInsert(event: InsertEvent<Post>) {
    this.logger.log('New title inserted', event.entity.title);
  }
}
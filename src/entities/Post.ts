import { Entity as TOEntity } from "typeorm";
import Entity from "./shared/Entity";

@TOEntity("posts")
export default class Post extends Entity {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }
}

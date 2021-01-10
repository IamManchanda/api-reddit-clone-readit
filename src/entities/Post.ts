import { Column, Entity as TOEntity, Index } from "typeorm";
import Entity from "./shared/Entity";

@TOEntity("posts")
export default class Post extends Entity {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Index()
  @Column()
  identifier: string;

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column({ nullable: true, type: "text", name: "sub_name" })
  subName: string;
}

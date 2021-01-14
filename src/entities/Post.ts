import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { makeId, slugify } from "../utils/helpers";
import Entity from "./shared/Entity";
import User from "./User";
import Sub from "./Sub";
import Comment from "./Comment";
import { Expose } from "class-transformer";

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

  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Column({ name: "sub_name" })
  subName: string;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "sub_name", referencedColumnName: "name" })
  sub: Sub;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @BeforeInsert()
  makeIdentifierAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}

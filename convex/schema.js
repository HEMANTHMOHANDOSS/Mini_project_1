import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
    token: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number())
  }).index("by_email", ["email"]),
  
  workspace: defineTable({
    messages: v.any(),
    fileData: v.optional(v.any()),
    user: v.id('users'),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number())
  }).index("by_user", ["user"])
});
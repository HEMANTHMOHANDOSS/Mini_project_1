import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        picture: v.string(),
        uid: v.string()
    },
    handler: async (ctx, args) => {
        try {
            const existingUser = await ctx.db
                .query('users')
                .filter((q) => q.eq(q.field('email'), args.email))
                .collect();

            if (existingUser?.length === 0) {
                const result = await ctx.db.insert('users', {
                    name: args.name,
                    picture: args.picture,
                    email: args.email,
                    uid: args.uid,
                    createdAt: Date.now(),
                    token: 50000 // Default tokens for new users
                });
                console.log("New user created:", result);
                return result;
            } else {
                console.log("User already exists:", existingUser[0]);
                return existingUser[0]._id;
            }
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
        }
    }
});

export const GetUser = query({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        try {
            const user = await ctx.db
                .query('users')
                .filter((q) => q.eq(q.field('email'), args.email))
                .collect();
            
            return user[0] || null;
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    }
});

export const UpdateToken = mutation({
    args: {
        userId: v.id('users'),
        token: v.number()
    },
    handler: async (ctx, args) => {
        try {
            const result = await ctx.db.patch(args.userId, {
                token: args.token,
                updatedAt: Date.now()
            });
            return result;
        } catch (error) {
            console.error("Error updating tokens:", error);
            throw new Error("Failed to update tokens");
        }
    }
});
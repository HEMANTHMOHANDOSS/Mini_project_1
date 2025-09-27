import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateWorkspace = mutation({
    args: {
        messages: v.any(),
        user: v.id('users')
    },
    handler: async (ctx, args) => {
        try {
            const workspaceId = await ctx.db.insert('workspace', {
                messages: args.messages,
                user: args.user,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
            return workspaceId;
        } catch (error) {
            console.error("Error creating workspace:", error);
            throw new Error("Failed to create workspace");
        }
    }
});

export const GetWorkspace = query({
    args: { workspaceId: v.id('workspace') },
    handler: async (ctx, args) => {
        try {
            const result = await ctx.db.get(args.workspaceId);
            return result;
        } catch (error) {
            console.error("Error fetching workspace:", error);
            return null;
        }
    }
});

export const UpdateMessages = mutation({
    args: {
        workspaceId: v.id('workspace'),
        messages: v.any()
    },
    handler: async (ctx, args) => {
        try {
            const result = await ctx.db.patch(args.workspaceId, {
                messages: args.messages,
                updatedAt: Date.now()
            });
            return result;
        } catch (error) {
            console.error("Error updating messages:", error);
            throw new Error("Failed to update messages");
        }
    }
});

export const UpdateFiles = mutation({
    args: {
        workspaceId: v.id('workspace'),
        files: v.any()
    },
    handler: async (ctx, args) => {
        try {
            const result = await ctx.db.patch(args.workspaceId, {
                fileData: args.files,
                updatedAt: Date.now()
            });
            return result;
        } catch (error) {
            console.error("Error updating files:", error);
            throw new Error("Failed to update files");
        }
    }
});

export const GetAllWorkspace = query({
    args: {
        userId: v.id('users')
    },
    handler: async (ctx, args) => {
        try {
            const result = await ctx.db
                .query('workspace')
                .filter(q => q.eq(q.field('user'), args.userId))
                .order('desc')
                .collect();

            return result;
        } catch (error) {
            console.error("Error fetching workspaces:", error);
            return [];
        }
    }
});

export const DeleteWorkspace = mutation({
    args: {
        workspaceId: v.id('workspace')
    },
    handler: async (ctx, args) => {
        try {
            await ctx.db.delete(args.workspaceId);
            return { success: true };
        } catch (error) {
            console.error("Error deleting workspace:", error);
            throw new Error("Failed to delete workspace");
        }
    }
});
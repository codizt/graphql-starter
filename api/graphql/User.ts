import argon2 from "argon2";
import { extendType, nonNull, objectType, stringArg } from "nexus";

export const User = objectType({
	name: "User",
	definition(t) {
		t.string("id");
		t.string("username");
		t.string("email");
		t.string("password");
	},
});

export const UserQuery = extendType({
	type: "Query",
	definition(t) {
		t.nonNull.list.field("Users", {
			type: "User",
			resolve(_root, _args, ctx) {
				return ctx.db.user.findMany();
			},
		});
	},
});

export const UserMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("createUser", {
			type: User,
			args: {
				username: nonNull(stringArg()),
				email: nonNull(stringArg()),
				password: nonNull(stringArg()),
			},
			async resolve(_root, args, ctx) {
				const userData = {
					username: args.username,
					email: args.email,
					password: await argon2.hash(args.password),
				};
				return ctx.db.user.create({ data: userData });
			},
		});
	},
});
